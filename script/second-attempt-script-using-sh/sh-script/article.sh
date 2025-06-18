#!/bin/bash
#
#
STRAPI_URL="http://localhost:1337"
CONTENT_DIR="./content"
UPLOADS_DIR="../uploads"

echo "=================================================="
echo "📌 Paste your JWT Admin Token below (from /admin login page after registration):"
echo "=================================================="
read -p "JWT Token: " ADMIN_JWT

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

### STEP 2: CREATE COLLECTION TYPES

# Author
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Author",
    "singularName": "author",
    "pluralName": "authors",
    "collectionName": "authors",
    "description": "Article authors",
    "attributes": {
      "name": { "type": "string", "required": true },
      "email": { "type": "email", "required": true },
      "avatar": { "type": "media", "multiple": false },
      "bio": { "type": "richtext" }
    }
  }
}' "collection type 'Author'"
sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "author"

# Category
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Category",
    "singularName": "category",
    "pluralName": "categories",
    "collectionName": "categories",
    "description": "Article categories",
    "attributes": {
      "name": { "type": "string", "required": true },
      "slug": { "type": "uid", "targetField": "name", "required": true },
      "description": { "type": "text" }
    }
  }
}' "collection type 'Category'"
sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "category"

# Article (without author and category relations)
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Article",
    "singularName": "article",
    "pluralName": "articles",
    "collectionName": "articles",
    "description": "Blog articles",
    "attributes": {
      "title": { "type": "string", "required": true },
      "description": { "type": "string" },
      "slug": { "type": "uid", "targetField": "title" },
      "coverMedia": { "type": "media", "multiple": false },
      "uploaded": { "type": "datetime" },
      "markdownContent": { "type": "richtext" },
      "textContent": { "type": "richtext" },
      "email": { "type": "email" }
    }
  }
}' "collection type 'Article'"
sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "article"

### STEP 3: Upload all media files and capture their IDs
echo "🖼️ Uploading images..."

# Check if uploads directory exists
if [[ ! -d "$UPLOADS_DIR" ]]; then
  echo "❌ Uploads directory not found: $UPLOADS_DIR"
  echo "📁 Please ensure the uploads directory exists with the required images:"
  echo "   - yensi-tech-logo.png"
  echo "   - HPGL.png"
  echo "   - rakesh.png"
  echo "   - nitish.png"
  exit 1
fi

# Upload article images
IMAGE_ARTICLE_1=$(upload_image "$UPLOADS_DIR/yensi-tech-logo.png")
IMAGE_ARTICLE_2=$(upload_image "$UPLOADS_DIR/HPGL.png")

# Upload author image
IMAGE_AVATAR_1=$(upload_image "$UPLOADS_DIR/rakesh.png")
IMAGE_AVATAR_2=$(upload_image "$UPLOADS_DIR/nitish.png")

echo "✅ Uploaded image IDs:"
echo "  Article 1:    $IMAGE_ARTICLE_1"
echo "  Article 2:    $IMAGE_ARTICLE_2"
echo "  Author Avatar 1: $IMAGE_AVATAR_1"
echo "  Author Avatar 2: $IMAGE_AVATAR_2"

# Validate all image IDs were captured
if [[ -z "$IMAGE_ARTICLE_1"  || -z "$IMAGE_ARTICLE_2" || -z "$IMAGE_AVATAR_1" || -z "$IMAGE_AVATAR_2" ]]; then
  echo "❌ Failed to capture all image IDs. Exiting..."
  exit 1
fi

### STEP 4: Add Sample Data with media IDs injected

# Post category data first
echo "📂 Creating categories..."
CATEGORY_JSON=$(<"$CONTENT_DIR/category.json")
echo "$CATEGORY_JSON" | jq -c '.[]' | while read -r category; do
  post_with_retry "$STRAPI_URL/content-manager/collection-types/api::category.category" "$category" "category $(echo "$category" | jq -r '.name')"
done

# Load author.json and inject image IDs dynamically
echo "👤 Creating authors from author.json..."

AUTHOR_RAW=$(<"$CONTENT_DIR/author.json")

AUTHOR_JSON=$(echo "$AUTHOR_RAW" | jq \
  --arg avatar1 "$IMAGE_AVATAR_1" \
  --arg avatar2 "$IMAGE_AVATAR_2" '
  .[0].avatar = ($avatar1 | tonumber)
  | .[1].avatar = ($avatar2 | tonumber)
')

# Post each author entry
echo "$AUTHOR_JSON" | jq -c '.[]' | while read -r author; do
  post_with_retry "$STRAPI_URL/content-manager/collection-types/api::author.author" "$author" "author $(echo "$author" | jq -r '.name')"
done


# Inject image IDs into article.json and create a new temp JSON file
echo "📝 Preparing articles from article.json..."

ARTICLE_RAW=$(<"$CONTENT_DIR/article.json")

ARTICLE_JSON=$(echo "$ARTICLE_RAW" | jq \
  --arg img1 "$IMAGE_ARTICLE_1" \
  --arg img2 "$IMAGE_ARTICLE_2" '
  .[0].coverMedia = ($img1 | tonumber)
  | .[1].coverMedia = ($img2 | tonumber)
')

# Post each article entry from JSON
echo "$ARTICLE_JSON" | jq -c '.[]' | while read -r article; do
  post_with_retry "$STRAPI_URL/content-manager/collection-types/api::article.article" "$article" "article $(echo "$article" | jq -r '.title')"
done


# Wait for all content to be created
sleep 5

# Now add relations to existing content types
echo "🔗 Adding relations to content types..."

# First, add the articles relation to Author
put_with_retry "$STRAPI_URL/content-type-builder/content-types/api::author.author" '{
  "contentType": {
    "displayName": "Author",
    "singularName": "author",
    "pluralName": "authors",
    "collectionName": "authors",
    "description": "Article authors",
    "attributes": {
      "name": { "type": "string", "required": true },
      "email": { "type": "email", "required": true },
      "avatar": { "type": "media", "multiple": false },
      "bio": { "type": "richtext" },
       "articles": {
        "type": "relation",
        "relation": "oneToMany",
        "target": "api::article.article",
        "mappedBy": "author"
      }
    }
  }
}' "update Author with articles relation"
sleep 7 && wait_for_strapi && validate_jwt

# Add the articles relation to Category
put_with_retry "$STRAPI_URL/content-type-builder/content-types/api::category.category" '{
  "contentType": {
    "displayName": "Category",
    "singularName": "category",
    "pluralName": "categories",
    "collectionName": "categories",
    "description": "Article categories",
    "attributes": {
      "name": { "type": "string", "required": true },
      "slug": { "type": "uid", "targetField": "name", "required": true },
      "description": { "type": "text" },
       "articles": {
        "type": "relation",
        "relation": "oneToMany",
        "target": "api::article.article",
        "mappedBy": "category"
      }
    }
  }
}' "update Category with articles relation"
sleep 7 && wait_for_strapi && validate_jwt

# Finally, update Article with relations to Author and Category
put_with_retry "$STRAPI_URL/content-type-builder/content-types/api::article.article" '{
  "contentType": {
    "displayName": "Article",
    "singularName": "article",
    "pluralName": "articles",
    "collectionName": "articles",
    "description": "Blog articles",
    "attributes": {
      "title": { "type": "string", "required": true },
      "description": { "type": "string" },
      "slug": { "type": "uid", "targetField": "title" },
      "coverMedia": { "type": "media", "multiple": false },
      "uploaded": { "type": "datetime" },
      "markdownContent": { "type": "richtext" },
      "textContent": { "type": "richtext" },
      "email": { "type": "email" },
      "author": {
        "type": "relation",
        "relation": "manyToOne",
        "target": "api::author.author",
        "inversedBy": "articles"
      },
      "category": {
        "type": "relation",
        "relation": "manyToOne",
        "target": "api::category.category",
        "inversedBy": "articles"
      }
    }
  }
}' "update Article with relations"
sleep 7 && wait_for_strapi && validate_jwt

# Now fetch the IDs and update articles with proper relations
echo "🔍 Fetching created author and category IDs..."
sleep 3  # Give time for data to be available

# Use the correct API endpoints to fetch IDs
RAKESH_RESPONSE=$(curl -s "$STRAPI_URL/content-manager/collection-types/api::author.author" -H "Authorization: Bearer $ADMIN_JWT")
TECH_CAT_RESPONSE=$(curl -s "$STRAPI_URL/content-manager/collection-types/api::category.category" -H "Authorization: Bearer $ADMIN_JWT")
ARTICLES_RESPONSE=$(curl -s "$STRAPI_URL/content-manager/collection-types/api::article.article" -H "Authorization: Bearer $ADMIN_JWT")

echo "📄 Authors Response: $RAKESH_RESPONSE"
echo "📄 Categories Response: $TECH_CAT_RESPONSE"
echo "📄 Articles Response: $ARTICLES_RESPONSE"

# Extract IDs from responses
RAKESH_ID=$(echo "$RAKESH_RESPONSE" | jq -r '.results[] | select(.email == "rakesh2@aiyensi.com") | .id')
TECH_CAT_ID=$(echo "$TECH_CAT_RESPONSE" | jq -r '.results[] | select(.slug == "tech") | .id')
ARTICLE_1_ID=$(echo "$ARTICLES_RESPONSE" | jq -r '.results[] | select(.slug == "yensi-blogs") | .documentId')
ARTICLE_2_ID=$(echo "$ARTICLES_RESPONSE" | jq -r '.results[] | select(.slug == "hyderabad-premier-golf-league-hpgl-analytics-auctions-live") | .documentId')

echo "Rakesh ID: $RAKESH_ID"
echo "Tech Category ID: $TECH_CAT_ID"
echo "Article 1 ID: $ARTICLE_1_ID"
echo "Article 2 ID: $ARTICLE_2_ID"

if [[ -z "$RAKESH_ID" || "$RAKESH_ID" == "null" || -z "$TECH_CAT_ID" || "$TECH_CAT_ID" == "null" ]]; then
  echo "❌ Failed to get author or category IDs"
  exit 1
fi

# 📌 Dynamically update articles with author + category relations
echo "🔗 Updating articles with author and category relations..."

ARTICLE_RAW=$(<"$CONTENT_DIR/article.json")

ARTICLE_INDEX=1
echo "$ARTICLE_RAW" | jq -c '.[]' | while read -r article; do
  if [[ "$ARTICLE_INDEX" -eq 1 ]]; then
  ARTICLE_ID="$ARTICLE_1_ID"
  IMAGE_ID="$IMAGE_ARTICLE_1"
  echo "✅ Selected article index: $ARTICLE_INDEX"
  echo "➡️ Article ID: $ARTICLE_ID"
  echo "🖼️  Image ID: $IMAGE_ID"
elif [[ "$ARTICLE_INDEX" -eq 2 ]]; then
  ARTICLE_ID="$ARTICLE_2_ID"
  IMAGE_ID="$IMAGE_ARTICLE_2"
  echo "✅ Selected article index: $ARTICLE_INDEX"
  echo "➡️ Article ID: $ARTICLE_ID"
  echo "🖼️  Image ID: $IMAGE_ID"
else
  echo "⚠️ Skipping unexpected article index: $ARTICLE_INDEX"
  continue
fi

  if [[ -n "$ARTICLE_ID" && "$ARTICLE_ID" != "null" ]]; then
    echo "🔄 Updating article at index $ARTICLE_INDEX (ID: $ARTICLE_ID)..."
    # Include author and category IDs in the update
    UPDATED_ARTICLE=$(echo "$article" | jq \
      --arg coverMedia "$IMAGE_ID" \
      --arg authorId "$RAKESH_ID" \
      --arg categoryId "$TECH_CAT_ID" '
      .coverMedia = ($coverMedia | tonumber) |
      .author = ($authorId | tonumber) |
      .category = ($categoryId | tonumber)
    ')

    echo "Shell Variable Values:"
    echo "IMAGE_ID: $IMAGE_ID"
    echo "RAKESH_ID: $RAKESH_ID"
    echo "TECH_CAT_ID: $TECH_CAT_ID"

    echo -e "\nUpdated JSON Values:"
    echo "$UPDATED_ARTICLE" | jq '. | {coverMedia, author, category}'


    put_with_retry "$STRAPI_URL/content-manager/collection-types/api::article.article/$ARTICLE_ID" "$UPDATED_ARTICLE" "Article $((ARTICLE_INDEX+1)) with relations"
  fi

  ARTICLE_INDEX=$((ARTICLE_INDEX+1))
done

echo "✅ All sample content successfully added!"
echo "✅ All components, collection types, permissions, and content created successfully!"
