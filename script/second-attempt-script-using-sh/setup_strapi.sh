#!/bin/bash

PROJECT_NAME="my-strapi-project"
STRAPI_PORT=1337
STRAPI_URL="http://localhost:$STRAPI_PORT"

# Step 1: Create new Strapi project
echo "Creating Strapi project: $PROJECT_NAME..."
npx create-strapi-app@latest $PROJECT_NAME --quickstart

cd $PROJECT_NAME || exit 1

echo "Installing dependencies..."
npm install

echo "Starting Strapi backend in background..."
npm run develop &

sleep 20

# Prompt user to register manually
echo "=================================================="
echo "🛠️  Please open this link in browser and register manually:"
echo "➡️  $STRAPI_URL/admin"
echo ""
echo "🔑 After registering and logging in, open DevTools -> Application -> Local Storage -> copy token"
echo "Paste your admin JWT token below 👇"
echo "=================================================="
read -p "JWT Token: " ADMIN_JWT

# Check token is not empty
if [ -z "$ADMIN_JWT" ]; then
    echo "❌ Token not provided. Exiting."
    exit 1
fi

# Create Header collection
echo "Creating 'Header' collection type..."
curl -s -X POST "$STRAPI_URL/content-type-builder/content-types" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -d '{
    "contentType": {
      "displayName": "Header",
      "singularName": "header",
      "pluralName": "headers",
      "description": "Site Header",
      "collectionName": "headers",
      "attributes": {
        "title": { "type": "string", "required": true },
        "logoUrl": { "type": "string" }
      }
    }
  }'

# Create Footer collection
echo "Creating 'Footer' collection type..."
curl -s -X POST "$STRAPI_URL/content-type-builder/content-types" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -d '{
    "contentType": {
      "displayName": "Footer",
      "singularName": "footer",
      "pluralName": "footers",
      "description": "Site Footer",
      "collectionName": "footers",
      "attributes": {
        "text": { "type": "text" },
        "links": { "type": "json" }
      }
    }
  }'

echo "✅ Header and Footer created!"
echo "🔁 Restart the server to apply changes if needed."
