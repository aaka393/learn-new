#!/bin/bash
#
#
STRAPI_URL="http://localhost:1337"
CONTENT_DIR="./content"
UPLOADS_DIR="../uploads"

# Check if JWT token is provided
if [ -z "$1" ]; then
  echo "Usage: ./about.sh <JWT_TOKEN> [<filename>]"
  exit 1
fi

ADMIN_JWT="$1"
FILENAME="$2"

echo "=================================================="
echo "Using JWT Token: $ADMIN_JWT"

# Function to wait for Strapi to be up
wait_for_strapi() {
  echo "⏳ Waiting for Strapi to be available..."
  until curl --silent --fail "$STRAPI_URL/admin/project-type" > /dev/null; do
    sleep 3
  done
  echo "✅ Strapi is available!"
}

# Function to validate JWT
validate_jwt() {
  echo "🔒 Validating JWT token..."
  status=$(curl --write-out "%{http_code}" --silent --output /dev/null \
    -H "Authorization: Bearer $ADMIN_JWT" "$STRAPI_URL/admin/users/me")
  if [[ "$status" != "200" ]]; then
    echo "❌ JWT is invalid or expired. Please re-run the script with a fresh token."
    exit 1
  fi
}

# Function to retry POST calls
post_with_retry() {
  local url="$1"
  local json="$2"
  local label="$3"
  echo "📦 Creating $label..."
  for i in {1..3}; do
    response=$(curl -s -w "%{http_code}" -o /tmp/response.log -X POST "$url" \
      -H "Authorization: Bearer $ADMIN_JWT" \
      -H "Content-Type: application/json" \
      -d "$json")

    if [[ "$response" == "200" || "$response" == "201" ]]; then
      echo "✅ $label created successfully."
      cat /tmp/response.log
      return
    fi

    echo "⚠️ Attempt $i failed (HTTP $response), retrying in 10s..."
    echo "📄 Server response:"
    cat /tmp/response.log
    sleep 10
    wait_for_strapi
    validate_jwt
  done

  echo "❌ Failed to create $label after 3 attempts."
  exit 1
}

# Function to retry PUT calls
put_with_retry() {
  local url="$1"
  local json="$2"
  local label="$3"
  echo "📦 Updating $label..."
  for i in {1..3}; do
    response=$(curl -s -w "%{http_code}" -o /tmp/response.log -X PUT "$url" \
      -H "Authorization: Bearer $ADMIN_JWT" \
      -H "Content-Type: application/json" \
      -d "$json")

    if [[ "$response" == "200" || "$response" == "201" ]]; then
      echo "✅ $label updated successfully."
      cat /tmp/response.log
      return
    fi

    echo "⚠️ Attempt $i failed (HTTP $response), retrying in 10s..."
    echo "📄 Server response:"
    cat /tmp/response.log
    sleep 10
    wait_for_strapi
    validate_jwt
  done

  echo "❌ Failed to update $label after 3 attempts."
  exit 1
}

# Function to grant public permissions
grant_public_permissions() {
  local collection="$1"
  echo "🔐 Granting public access to '$collection' (find & findOne)..."

  PUBLIC_ROLE_ID=$(curl -s "$STRAPI_URL/users-permissions/roles" \
    -H "Authorization: Bearer $ADMIN_JWT" | jq '.roles[] | select(.type == "public") | .id')

  if [[ -z "$PUBLIC_ROLE_ID" ]]; then
    echo "❌ Failed to get public role ID"
    exit 1
  fi

  PERMISSIONS_JSON=$(cat <<EOF
{
  "permissions": {
    "api::${collection}.${collection}": {
      "controllers": {
        "${collection}": {
          "find": { "enabled": true },
          "findOne": { "enabled": true }
        }
      }
    }
  }
}
EOF
)

  curl -s -X PUT "$STRAPI_URL/users-permissions/roles/$PUBLIC_ROLE_ID" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -H "Content-Type: application/json" \
    -d "$PERMISSIONS_JSON" > /dev/null

  echo "✅ Public role permissions granted for '$collection'."
}

# Fixed upload_image function with correct API response parsing
upload_image() {
  local image_path="$1"
  local filename=$(basename "$image_path")

  echo "🖼️ Uploading image: $filename" >&2

  # Check if file exists
  if [[ ! -f "$image_path" ]]; then
    echo "❌ Image file not found: $image_path" >&2
    exit 1
  fi

  # Upload the image and capture response
  local upload_response=$(curl -s -X POST "$STRAPI_URL/upload" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -F "files=@$image_path")

  echo "📄 Upload response: $upload_response" >&2

  # Try to extract ID from upload response first (direct array)
  local image_id=$(echo "$upload_response" | jq -r '.[0].id // empty' 2>/dev/null)

  # If that fails, try getting it from the files endpoint
  if [[ -z "$image_id" || "$image_id" == "null" ]]; then
    echo "🔍 Trying to find uploaded file..." >&2
    local media_lookup=$(curl -s "$STRAPI_URL/upload/files" \
      -H "Authorization: Bearer $ADMIN_JWT")

    echo "📄 Media lookup response: $media_lookup" >&2

    # Handle the new API structure with 'results' array
    image_id=$(echo "$media_lookup" | jq -r --arg name "$filename" '.results[]? | select(.name == $name) | .id // empty' 2>/dev/null)

    # If still not found, try the old structure (direct array)
    if [[ -z "$image_id" || "$image_id" == "null" ]]; then
      image_id=$(echo "$media_lookup" | jq -r --arg name "$filename" '.[]? | select(.name == $name) | .id // empty' 2>/dev/null)
    fi

    # If still not found, try without extension
    if [[ -z "$image_id" || "$image_id" == "null" ]]; then
      local basename_no_ext="${filename%.*}"
      image_id=$(echo "$media_lookup" | jq -r --arg name "$basename_no_ext" '.results[]? | select(.name | startswith($name)) | .id // empty' 2>/dev/null)

      # Try old structure too
      if [[ -z "$image_id" || "$image_id" == "null" ]]; then
        image_id=$(echo "$media_lookup" | jq -r --arg name "$basename_no_ext" '.[]? | select(.name | startswith($name)) | .id // empty' 2>/dev/null)
      fi
    fi
  fi

  if [[ -z "$image_id" || "$image_id" == "null" ]]; then
    echo "❌ Failed to get image ID for: $filename" >&2
    echo "📄 Available files:" >&2
    echo "$media_lookup" | jq -r '.results[]?.name // .[]?.name' 2>/dev/null >&2
    exit 1
  fi

  echo "✅ Image uploaded successfully: $filename (ID: $image_id)" >&2
  echo "$image_id"
}

wait_for_strapi
validate_jwt

### STEP 1: CREATE COMPONENTS

# about.value-item

post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "about",
    "displayName": "value-item",
    "icon": "tag",
    "attributes": {
      "title": { "type": "string" },
      "description": { "type": "string" }
    }
  }
}' "component 'value-item'"
sleep 7 && wait_for_strapi && validate_jwt

# about.values (flattened version - correct for use inside dynamic zone)
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


sleep 7 && wait_for_strapi && validate_jwt



#  about.section

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
sleep 7 && wait_for_strapi && validate_jwt

# about.team

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
sleep 7 && wait_for_strapi && validate_jwt



### STEP 2: CREATE COLLECTION TYPES

# About

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
      "blocks": {
        "type": "dynamiczone",
        "components": [
          "about.values",
          "about.section"
        ]
      },
      "subtitle": { "type": "string" },
      "team": {
        "type": "component",
        "repeatable": true,
        "component": "about.team-member"
      }
    }
  }
}' "single type 'About'"
sleep 7 && wait_for_strapi && validate_jwt

### STEP 3: Upload all media files and capture their IDs
echo "🖼️ Uploading images..."

# Check if uploads directory exists
if [[ ! -d "$UPLOADS_DIR" ]]; then
  echo "❌ Uploads directory not found: $UPLOADS_DIR"
  echo "📁 Please ensure the uploads directory exists with the required images:"
  echo "   - rakesh.png"
  echo "   - nitish.png"
  echo "   - aakash.png"
  echo "   - chandu.png"
  echo "   - programmers.jpeg"
  exit 1
fi

# Upload author image
IMAGE_AVATAR_1=$(upload_image "$UPLOADS_DIR/rakesh.png")
IMAGE_AVATAR_2=$(upload_image "$UPLOADS_DIR/nitish.png")
IMAGE_AVATAR_3=$(upload_image "$UPLOADS_DIR/aakash.png")
IMAGE_AVATAR_4=$(upload_image "$UPLOADS_DIR/chandu.png")
IMAGE_STORY=$(upload_image "$UPLOADS_DIR/programmers.jpeg")

# About team member images

echo "✅ Uploaded image IDs:"
echo "  Author Avatar 1: $IMAGE_AVATAR_1"
echo "  Author Avatar 2: $IMAGE_AVATAR_2"
echo "  About Team Member 1: $IMAGE_AVATAR_1"
echo "  About Team Member 2: $IMAGE_AVATAR_2"
echo "  About Team Member 3: $IMAGE_AVATAR_3"
echo "  About Team Member 4: $IMAGE_AVATAR_4"
echo "  Story:        $IMAGE_STORY"

# Validate all image IDs were captured
if [[ -z "$IMAGE_AVATAR_1" || -z "$IMAGE_AVATAR_2" || -z "$IMAGE_AVATAR_3" || -z "$IMAGE_AVATAR_4" || -z "$IMAGE_STORY" ]]; then
  echo "❌ Failed to capture all image IDs. Exiting..."
  exit 1
fi

### STEP 4: Add Sample Data with media IDs injected

ABOUT_RAW_JSON=$(<"$CONTENT_DIR/about.json")
# Inject image IDs into about.json and retain all other data
ABOUT_JSON=$(echo "$ABOUT_RAW_JSON" | jq \
  --arg avatar1 "$IMAGE_AVATAR_1" \
  --arg avatar2 "$IMAGE_AVATAR_2" \
  --arg avatar3 "$IMAGE_AVATAR_3" \
  --arg avatar4 "$IMAGE_AVATAR_4" \
  --arg programmers "$IMAGE_STORY" '
  .team[0].photo = ($avatar1 | tonumber)
  | .team[1].photo = ($avatar2 | tonumber)
  | .team[2].photo = ($avatar3 | tonumber)
  | .team[3].photo = ($avatar4 | tonumber)
  | .blocks[] |= (
      if has("image") then
        .image = ($programmers | tonumber)
      else .
      end
    )
')

echo "📄 Final about.json structure:"
echo "$ABOUT_JSON" | jq .

put_with_retry "$STRAPI_URL/content-manager/single-types/api::about.about" "$ABOUT_JSON" "sample data in 'About'"

echo "✅ All sample content successfully added!"
echo "✅ All components, collection types, permissions, and content created successfully!"
