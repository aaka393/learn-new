#!/bin/bash

# === CONFIGURATION ===
STRAPI_URL="http://localhost:1337"

echo "=================================================="
echo "📌 Paste your JWT Admin Token below (from /admin login page after login):"
echo "=================================================="
read -r -p "JWT Token: " JWT

echo "🧹 Starting cleanup..."

# === DELETE COMPONENTS ===
COMPONENTS=("footer.footer-column" "footer.footer-link" "social.social-link" "navigation.nav-item" "home.hero")

for COMPONENT in "${COMPONENTS[@]}"; do
  echo "🗑️ Deleting component: $COMPONENT..."
  curl -s -X DELETE "$STRAPI_URL/content-type-builder/components/$COMPONENT" \
    -H "Authorization: Bearer $JWT" > /dev/null
  echo "✅ Deleted $COMPONENT."
done

# === DELETE MEDIA FILES ===
echo "🧹 Deleting all uploaded media files..."
MEDIA_IDS=$(curl -s -X GET "$STRAPI_URL/api/upload/files" \
  -H "Authorization: Bearer $JWT" | jq -r '.[].id')

for ID in $MEDIA_IDS; do
  curl -s -X DELETE "$STRAPI_URL/api/upload/files/$ID" \
    -H "Authorization: Bearer $JWT" > /dev/null
done
echo "✅ Deleted all media files."

# === DELETE COLLECTION TYPES ===
COLLECTION_TYPES=("header" "footer" "home")

for TYPE in "${COLLECTION_TYPES[@]}"; do
  echo "🗑️ Deleting collection type: $TYPE..."
  curl -s -X DELETE "$STRAPI_URL/content-type-builder/content-types/api::$TYPE.$TYPE" \
    -H "Authorization: Bearer $JWT" > /dev/null
  echo "✅ Deleted $TYPE."
done

# === WAIT FOR STRAPI TO REBUILD ===
echo "⏳ Waiting 15s for rebuild after deleting collection types..."
sleep 15



# === DELETE FILE SYSTEM CONTENT ===
echo "🧹 Cleaning up src/api folders..."
rm -rf ./src/api/*
echo "✅ Deleted src/api content."

echo "🧹 Cleaning up src/components folders..."
rm -rf ./src/components/*
echo "✅ Deleted src/components content."

echo "🧹 Cleaning up public/uploads..."
rm -rf ./public/uploads/*
echo "✅ Deleted all media files from file system."

echo "🧼 Final cleanup complete!"
