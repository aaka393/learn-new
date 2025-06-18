#!/bin/bash

STRAPI_URL="http://localhost:1337"
CONTENT_DIR="./content"
UPLOADS_DIR="../uploads"

echo "=================================================="
echo "📌 Paste your JWT Admin Token below (from /admin login page after registration):"
echo "=================================================="
read -p "JWT Token: " ADMIN_JWT

# Enhanced waiting function with better error handling
wait_for_strapi() {
  echo "⏳ Waiting for Strapi to be available..."
  local max_attempts=60
  local attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    if curl --silent --fail --max-time 10 "$STRAPI_URL/admin/project-type" > /dev/null 2>&1; then
      echo "✅ Strapi is available!"
      sleep 2  # Extra buffer time
      return 0
    fi
    attempt=$((attempt + 1))
    echo "  Attempt $attempt/$max_attempts..."
    sleep 5
  done
  
  echo "❌ Strapi failed to become available after $max_attempts attempts"
  exit 1
}

# Enhanced JWT validation with retry
validate_jwt() {
  local max_attempts=3
  local attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    status=$(curl --write-out "%{http_code}" --silent --output /dev/null --max-time 10 \
      -H "Authorization: Bearer $ADMIN_JWT" "$STRAPI_URL/admin/users/me" 2>/dev/null)
    
    if [[ "$status" == "200" ]]; then
      return 0
    fi
    
    attempt=$((attempt + 1))
    
    if [ $attempt -lt $max_attempts ]; then
      echo "🔄 Retrying JWT validation in 3 seconds..."
      sleep 3
    fi
  done
  
  echo "❌ Invalid or expired JWT token after $max_attempts attempts"
  echo "💡 Please get a fresh JWT token from Strapi admin and try again"
  echo "🔗 Go to: $STRAPI_URL/admin and copy the JWT from browser dev tools"
  exit 1
}

# Enhanced post function with better retry logic
post_with_retry() {
  local url="$1"
  local json="$2"
  local label="$3"
  local method="${4:-POST}"
  
  echo "📦 Creating $label..."
  
  for i in {1..5}; do
    # Validate JWT before each attempt
    validate_jwt
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.log --max-time 30 -X "$method" "$url" \
      -H "Authorization: Bearer $ADMIN_JWT" \
      -H "Content-Type: application/json" \
      -d "$json" 2>/dev/null)
    
    if [[ "$response" =~ ^20[0-9]$ ]]; then
      echo "✅ $label created successfully"
      sleep 2  # Buffer time after successful creation
      return 0
    fi
    
    echo "⚠️ Retry $i failed (HTTP $response)"
    
    # Show error details for debugging
    if [[ -f /tmp/response.log ]]; then
      echo "📄 Error response: $(cat /tmp/response.log)"
    fi
    
    # Check if it's an auth error - prompt for new token
    if [[ "$response" == "401" ]]; then
      echo "🔑 JWT token has expired. Please provide a new token:"
      read -p "New JWT Token: " ADMIN_JWT
      continue
    fi
    
    # Progressive backoff
    local sleep_time=$((i * 3))
    echo "🔄 Waiting ${sleep_time}s before retry..."
    sleep $sleep_time
    
    # Check if Strapi is still available
    wait_for_strapi
  done
  
  echo "❌ Failed to create $label after 5 attempts"
  echo "💡 Check Strapi logs for more details"
  exit 1
}

# Enhanced image upload with better error handling
upload_image() {
  local image_path="$1"
  local filename=$(basename "$image_path")
  echo "🖼️ Uploading image: $filename" >&2

  if [[ ! -f "$image_path" ]]; then
    echo "❌ Image file not found: $image_path" >&2
    exit 1
  fi

  # Validate JWT before upload
  validate_jwt

  local upload_response=$(curl -s --max-time 60 -X POST "$STRAPI_URL/upload" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -F "files=@$image_path" 2>/dev/null)

  echo "📄 Upload response: $upload_response" >&2
  local image_id=$(echo "$upload_response" | jq -r '.[0].id // empty' 2>/dev/null)

  # If direct upload failed, try to find existing file
  if [[ -z "$image_id" || "$image_id" == "null" ]]; then
    echo "🔍 Trying to find uploaded file..." >&2
    local media_lookup=$(curl -s --max-time 30 "$STRAPI_URL/upload/files" -H "Authorization: Bearer $ADMIN_JWT" 2>/dev/null)
    echo "📄 Media lookup response: $media_lookup" >&2
    
    # Try multiple JSON path approaches
    image_id=$(echo "$media_lookup" | jq -r --arg name "$filename" '.results[]? | select(.name == $name) | .id // empty' 2>/dev/null)
    [[ -z "$image_id" || "$image_id" == "null" ]] && image_id=$(echo "$media_lookup" | jq -r --arg name "$filename" '.[]? | select(.name == $name) | .id // empty' 2>/dev/null)
    [[ -z "$image_id" || "$image_id" == "null" ]] && image_id=$(echo "$media_lookup" | jq -r '.results[0].id // .0.id // empty' 2>/dev/null)
  fi

  if [[ -z "$image_id" || "$image_id" == "null" ]]; then
    echo "❌ Failed to get image ID for: $filename" >&2
    echo "📋 Available files:" >&2
    echo "$media_lookup" | jq -r '.results[]?.name // .[]?.name' 2>/dev/null >&2
    exit 1
  fi

  echo "✅ Image uploaded successfully: $filename (ID: $image_id)" >&2
  echo "$image_id"
}

# Function to wait for content type to be ready
wait_for_content_type() {
  local content_type="$1"
  echo "⏳ Waiting for content type '$content_type' to be ready..."
  
  for i in {1..30}; do
    # Check if the content type is available via API
    local status=$(curl -s -w "%{http_code}" -o /dev/null --max-time 10 \
      -H "Authorization: Bearer $ADMIN_JWT" \
      "$STRAPI_URL/api/$content_type" 2>/dev/null)
    
    if [[ "$status" == "200" || "$status" == "404" ]]; then
      echo "✅ Content type '$content_type' is ready!"
      return 0
    fi
    
    echo "  Waiting for content type... attempt $i/30 (status: $status)"
    sleep 3
  done
  
  echo "⚠️ Content type may not be fully ready, but continuing..."
  return 0
}

# Function to create/update About content using multiple strategies
create_about_content() {
  local payload="$1"
  
  echo "📤 Creating/updating About content..."
  
  # Wait for the content type to be ready
  wait_for_content_type "about"
  
  # Strategy 1: Try the public API endpoint (most reliable for single types)
  echo "📝 Strategy 1: Using public API endpoint..."
  local response=$(curl -s -w "%{http_code}" -o /tmp/public_response.log --max-time 30 -X PUT \
    "$STRAPI_URL/api/about" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null)
  
  if [[ "$response" =~ ^20[0-9]$ ]]; then
    echo "✅ About content created/updated successfully via public API!"
    return 0
  else
    echo "⚠️ Public API failed (HTTP $response)"
    echo "📄 Response: $(cat /tmp/public_response.log 2>/dev/null)"
  fi
  
  # Strategy 2: Try admin content manager with proper single type endpoint
  echo "📝 Strategy 2: Using admin content manager..."
  local admin_payload='{"data":'"$(echo "$payload" | jq '.data')"'}'
  
  local response=$(curl -s -w "%{http_code}" -o /tmp/admin_response.log --max-time 30 -X PUT \
    "$STRAPI_URL/admin/content-manager/single-types/api::about.about" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -H "Content-Type: application/json" \
    -d "$admin_payload" 2>/dev/null)
  
  if [[ "$response" =~ ^20[0-9]$ ]]; then
    echo "✅ About content created/updated successfully via admin API!"
    return 0
  else
    echo "⚠️ Admin API failed (HTTP $response)"
    echo "📄 Response: $(cat /tmp/admin_response.log 2>/dev/null)"
  fi
  
  # Strategy 3: Try direct database approach via admin
  echo "📝 Strategy 3: Using direct admin approach..."
  local direct_payload=$(echo "$payload" | jq '.data')
  
  local response=$(curl -s -w "%{http_code}" -o /tmp/direct_response.log --max-time 30 -X POST \
    "$STRAPI_URL/admin/content-manager/single-types/api::about.about/actions/create" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -H "Content-Type: application/json" \
    -d "$direct_payload" 2>/dev/null)
  
  if [[ "$response" =~ ^20[0-9]$ ]]; then
    echo "✅ About content created successfully via direct admin!"
    return 0
  else
    echo "⚠️ Direct admin failed (HTTP $response)"
    echo "📄 Response: $(cat /tmp/direct_response.log 2>/dev/null)"
  fi
  
  # Strategy 4: Manual creation via content manager
  echo "📝 Strategy 4: Manual content manager creation..."
  
  # First check if content exists
  local check_response=$(curl -s -w "%{http_code}" -o /tmp/check_response.log --max-time 30 \
    -H "Authorization: Bearer $ADMIN_JWT" \
    "$STRAPI_URL/admin/content-manager/single-types/api::about.about" 2>/dev/null)
  
  if [[ "$check_response" == "200" ]]; then
    echo "📋 Content exists, trying update..."
    local response=$(curl -s -w "%{http_code}" -o /tmp/update_response.log --max-time 30 -X PUT \
      "$STRAPI_URL/admin/content-manager/single-types/api::about.about" \
      -H "Authorization: Bearer $ADMIN_JWT" \
      -H "Content-Type: application/json" \
      -d "$admin_payload" 2>/dev/null)
    
    if [[ "$response" =~ ^20[0-9]$ ]]; then
      echo "✅ About content updated successfully!"
      return 0
    fi
  fi
  
  echo "❌ All strategies failed to create About content"
  echo "💡 You may need to create the content manually in Strapi admin"
  echo "🔗 Go to: $STRAPI_URL/admin/content-manager/single-types/api::about.about"
  echo ""
  echo "📋 Content to add manually:"
  echo "$payload" | jq '.data'
  
  return 1
}

# --- START MAIN SCRIPT ---
echo "🚀 Starting Strapi content setup..."

wait_for_strapi
validate_jwt

echo "📋 Creating components in sequence..."

# --- COMPONENTS (Create in dependency order) ---
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "about",
    "displayName": "value-item",
    "icon": "star",
    "attributes": {
      "title": { "type": "string" },
      "description": { "type": "text" }
    }
  }
}' "component 'value-item'"

sleep 3
wait_for_strapi

post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "about",
    "displayName": "values",
    "icon": "award",
    "attributes": {
      "values": {
        "type": "component",
        "repeatable": true,
        "component": "about.value-item"
      }
    }
  }
}' "component 'values'"

sleep 3
wait_for_strapi

post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "about",
    "displayName": "section",
    "icon": "file-text",
    "attributes": {
      "content": { "type": "richtext" },
      "image": { "type": "media", "multiple": false }
    }
  }
}' "component 'section'"

sleep 3
wait_for_strapi

post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "about",
    "displayName": "team-member",
    "icon": "users",
    "attributes": {
      "name": { "type": "string" },
      "role": { "type": "string" },
      "bio": { "type": "string" },
      "photo": { "type": "media", "multiple": false }
    }
  }
}' "component 'team-member'"

echo "⏳ Waiting for components to be fully registered..."
sleep 10
wait_for_strapi
validate_jwt

# --- SINGLE TYPE: About ---
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "kind": "singleType",
    "displayName": "About",
    "singularName": "about",
    "pluralName": "abouts",
    "collectionName": "abouts",
    "description": "About page content",
    "attributes": {
      "title": { "type": "string" },
      "subtitle": { "type": "string" },
      "blocks": {
        "type": "dynamiczone",
        "components": [
          "about.section",
          "about.team-member", 
          "about.values"
        ]
      },
      "team": {
        "type": "component",
        "repeatable": true,
        "component": "about.team-member"
      }
    }
  }
}' "single type 'About'"

echo "⏳ Waiting for content type to be fully registered..."
sleep 15
wait_for_strapi
validate_jwt

# --- IMAGE UPLOADS ---
echo "🖼️ Starting image uploads..."

if [[ ! -d "$UPLOADS_DIR" ]]; then
  echo "❌ Uploads directory not found: $UPLOADS_DIR"
  exit 1
fi

# Upload images with error handling - capture IDs cleanly
echo "📸 Uploading story image..."
IMAGE_STORY=""
if [[ -f "$UPLOADS_DIR/programmers.jpeg" ]]; then
  IMAGE_STORY=$(upload_image "$UPLOADS_DIR/programmers.jpeg" 2>/dev/null | tail -1)
else
  echo "⚠️ Story image not found, continuing without it"
fi

echo "📸 Uploading team member images..."
IMAGE_AVATAR_1=""
if [[ -f "$UPLOADS_DIR/rakesh.png" ]]; then
  IMAGE_AVATAR_1=$(upload_image "$UPLOADS_DIR/rakesh.png" 2>/dev/null | tail -1)
else
  echo "⚠️ Rakesh image not found, continuing without it"
fi

IMAGE_AVATAR_2=""
if [[ -f "$UPLOADS_DIR/nitish.png" ]]; then
  IMAGE_AVATAR_2=$(upload_image "$UPLOADS_DIR/nitish.png" 2>/dev/null | tail -1)
else
  echo "⚠️ Nitish image not found, continuing without it"
fi

IMAGE_AVATAR_3=""
if [[ -f "$UPLOADS_DIR/aakash.png" ]]; then
  IMAGE_AVATAR_3=$(upload_image "$UPLOADS_DIR/aakash.png" 2>/dev/null | tail -1)
else
  echo "⚠️ Aakash image not found, continuing without it"
fi

IMAGE_AVATAR_4=""
if [[ -f "$UPLOADS_DIR/chandu.png" ]]; then
  IMAGE_AVATAR_4=$(upload_image "$UPLOADS_DIR/chandu.png" 2>/dev/null | tail -1)
else
  echo "⚠️ Chandu image not found, continuing without it"
fi

echo "✅ Uploaded image IDs:"
echo "  Story image: $IMAGE_STORY"
echo "  Rakesh: $IMAGE_AVATAR_1"
echo "  Nitish: $IMAGE_AVATAR_2"
echo "  Aakash: $IMAGE_AVATAR_3"  
echo "  Chandu: $IMAGE_AVATAR_4"

# --- CONTENT CREATION ---
echo "📄 Processing content from about.json..."

if [[ ! -f "$CONTENT_DIR/about.json" ]]; then
  echo "❌ about.json not found in $CONTENT_DIR"
  exit 1
fi

ABOUT_RAW_JSON=$(<"$CONTENT_DIR/about.json")

# Enhanced JSON processing to preserve ALL content
ABOUT_JSON=$(echo "$ABOUT_RAW_JSON" | jq \
  --arg avatar1 "$IMAGE_AVATAR_1" \
  --arg avatar2 "$IMAGE_AVATAR_2" \
  --arg avatar3 "$IMAGE_AVATAR_3" \
  --arg avatar4 "$IMAGE_AVATAR_4" \
  --arg story_img "$IMAGE_STORY" '
  # Update team photos if images are available
  .team[0].photo = (if $avatar1 != "" and $avatar1 != null then ($avatar1 | tonumber) else null end) |
  .team[1].photo = (if $avatar2 != "" and $avatar2 != null then ($avatar2 | tonumber) else null end) |
  .team[2].photo = (if $avatar3 != "" and $avatar3 != null then ($avatar3 | tonumber) else null end) |
  .team[3].photo = (if $avatar4 != "" and $avatar4 != null then ($avatar4 | tonumber) else null end) |
  
  # Update section images if story image is available
  .blocks = (.blocks | map(
    if .__component == "about.section" and has("image") and $story_img != "" and $story_img != null then
      .image = ($story_img | tonumber)
    else . end
  ))
')

# Validate the JSON structure
if ! echo "$ABOUT_JSON" | jq empty 2>/dev/null; then
  echo "❌ Generated JSON is invalid"
  echo "📄 Raw JSON:"
  echo "$ABOUT_JSON"
  exit 1
fi

echo "📄 Final about.json structure:"
echo "$ABOUT_JSON" | jq .

# Re-validate JWT before final content creation
echo "🔑 Re-validating JWT token before content creation..."
validate_jwt

# Create the About content with proper data structure
FINAL_PAYLOAD=$(echo '{"data":'"$ABOUT_JSON"'}')

# Validate final payload
if ! echo "$FINAL_PAYLOAD" | jq empty 2>/dev/null; then
  echo "❌ Final payload JSON is invalid"
  echo "📄 Payload:"
  echo "$FINAL_PAYLOAD"
  exit 1
fi

# Use the new function to create/update content
if create_about_content "$FINAL_PAYLOAD"; then
  echo ""
  echo "🎉 SUCCESS! About page setup completed successfully!"
  echo "📋 Created:"
  echo "  ✅ 4 Components (value-item, values, section, team-member)"
  echo "  ✅ 1 Single Type (About)"
  echo "  ✅ $(echo "$IMAGE_STORY $IMAGE_AVATAR_1 $IMAGE_AVATAR_2 $IMAGE_AVATAR_3 $IMAGE_AVATAR_4" | wc -w) Images uploaded"
  echo "  ✅ All content from about.json"
  echo ""
  echo "🌐 You can now check your About content in Strapi admin:"
  echo "   $STRAPI_URL/admin/content-manager/single-types/api::about.about"
  echo ""
else
  echo ""
  echo "⚠️ PARTIAL SUCCESS! Components and structure created, but content creation failed"
  echo "📋 Successfully created:"
  echo "  ✅ 4 Components (value-item, values, section, team-member)"
  echo "  ✅ 1 Single Type (About)"
  echo "  ✅ $(echo "$IMAGE_STORY $IMAGE_AVATAR_1 $IMAGE_AVATAR_2 $IMAGE_AVATAR_3 $IMAGE_AVATAR_4" | wc -w) Images uploaded"
  echo ""
  echo "💡 Please manually add the content in Strapi admin:"
  echo "   $STRAPI_URL/admin/content-manager/single-types/api::about.about"
  echo ""
  exit 1
fi