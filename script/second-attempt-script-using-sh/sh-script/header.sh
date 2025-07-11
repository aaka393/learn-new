#!/bin/bash
#
# Script to create the Header content type in Strapi
#

STRAPI_URL="http://localhost:1337"
CONTENT_DIR="./content"
UPLOADS_DIR="../uploads"

# Check if JWT token is provided
if [ -z "$1" ]; then
  echo "Usage: ./header.sh <JWT_TOKEN> [<filename>]"
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
    response=$(curl -s -w "%{http_code}" --silent --output /tmp/response.log -X POST "$url" \
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

# nav-item
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "header",
    "displayName": "nav-item",
    "icon": "link",
    "attributes": {
      "label": { "type": "string" },
      "slug": { "type": "string" }
    }
  }
}' "component 'nav-item'"
sleep 7 && wait_for_strapi && validate_jwt

### STEP 2: CREATE COLLECTION TYPES

# Header
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Header",
    "singularName": "header",
    "pluralName": "headers",
    "collectionName": "headers",
    "description": "Header section with title and menu items",
    "attributes": {
      "title": { "type": "string", "required": true },
      "menu_items": {
        "type": "component",
        "repeatable": true,
        "component": "header.nav-item"
      }
    }
  }
}' "collection type 'Header'"

sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "header"

### STEP 3: Add Sample Data

# Read original JSON files
HEADER_RAW_JSON=$(<"$CONTENT_DIR/header.json")

# Post header
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::header.header" "$HEADER_RAW_JSON" "sample data in 'Header'"

echo "✅ All components, collection types, permissions, and content created successfully!"
