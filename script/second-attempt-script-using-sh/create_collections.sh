#!/bin/bash

STRAPI_URL="http://localhost:1337"

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

wait_for_strapi
validate_jwt

### STEP 1: CREATE COMPONENT
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "navigation",
    "displayName": "nav-item",
    "icon": "menu",
    "attributes": {
      "label": { "type": "string", "required": true },
      "slug": { "type": "string", "required": true }
    }
  }
}' "component 'nav-item'"

echo "⏳ Waiting 25s for Strapi to rebuild component..."
sleep 25
wait_for_strapi
validate_jwt

### STEP 2: CREATE COLLECTION TYPES

# Header
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Header",
    "singularName": "header",
    "pluralName": "headers",
    "collectionName": "headers",
    "description": "Header section",
    "attributes": {
      "title": { "type": "string", "required": true },
      "menu_items": {
        "type": "component",
        "repeatable": true,
        "component": "navigation.nav-item"
      }
    }
  }
}' "collection type 'Header'"

echo "⏳ Waiting 30s for Header schema to build..."
sleep 30
wait_for_strapi
validate_jwt

# Footer
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Footer",
    "singularName": "footer",
    "pluralName": "footers",
    "collectionName": "footers",
    "description": "Footer section",
    "attributes": {
      "text": { "type": "text" },
      "links": { "type": "json" }
    }
  }
}' "collection type 'Footer'"

echo "⏳ Waiting 30s for Footer schema to build..."
sleep 30
wait_for_strapi
validate_jwt

# Main
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Main",
    "singularName": "main",
    "pluralName": "mains",
    "collectionName": "mains",
    "description": "Homepage main content",
    "attributes": {
      "headline": { "type": "string", "required": true },
      "description": { "type": "richtext" }
    }
  }
}' "collection type 'Main'"

echo "⏳ Waiting 30s for Main schema to build..."
sleep 30
wait_for_strapi
validate_jwt

### STEP 3: Add Sample Content

# Header content with proper component structure
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::header.header" '{
  "title": "My Website Header",
  "menu_items": [
    { "label": "Home", "slug": "/" },
    { "label": "Articles", "slug": "/articles" },
    { "label": "About", "slug": "/about" }
  ]
}' "sample data in 'Header'"

# Footer content
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::footer.footer" '{
    "text": "© 2025 Yensi Solution. All rights reserved.",
    "links": [
      { "label": "Privacy Policy", "url": "/privacy" },
      { "label": "Terms of Service", "url": "/terms" }
    ]
}' "sample data in 'Footer'"

# Main content
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::main.main" '{
    "headline": "Welcome to Yensi Solution",
    "description": "We build AI-driven frontend solutions with speed and precision."
}' "sample data in 'Main'"

echo "✅ All components, collection types, and content created successfully!"

### STEP 4: Start Frontend App

echo "🚀 Starting your frontend..."
cd ./frontend-apple-template
      frontend-apple-template

# Optional: Install dependencies if not already done
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run Vite dev server
npm run dev &

# Wait for the Vite server to start (you can adjust the sleep time if needed)
sleep 5

# Open the app in the default browser (for Windows)
start http://localhost:5174