#!/bin/bash

STRAPI_URL="http://localhost:1337"
CONTENT_DIR="./content"
ASSETS_DIR="../assets"

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
    response=$(curl -s -w "%{http_code}" --silent --output /tmp/response.log -X PUT "$url" \
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
    "category": "navigation",
    "displayName": "nav-item",
    "icon": "menu",
    "attributes": {
      "label": { "type": "string", "required": true },
      "slug": { "type": "string", "required": true }
    }
  }
}' "component 'nav-item'"
sleep 7 && wait_for_strapi && validate_jwt

# footer-link
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "footer",
    "displayName": "footer-link",
    "icon": "link",
    "attributes": {
      "name": { "type": "string" },
      "url": { "type": "string" }
    }
  }
}' "component 'footer-link'"
sleep 7 && wait_for_strapi && validate_jwt

# footer-column
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "footer",
    "displayName": "footer-column",
    "icon": "columns",
    "attributes": {
      "title": { "type": "string" },
      "footer_links": {
        "type": "component",
        "repeatable": true,
        "component": "footer.footer-link"
      }
    }
  }
}' "component 'footer-column'"
sleep 7 && wait_for_strapi && validate_jwt

# social-link
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "footer",
    "displayName": "social-link",
    "icon": "globe",
    "attributes": {
      "platform": {
        "type": "enumeration",
        "enum": ["Mail", "Github", "Twitter", "Linkedin", "Instagram"],
        "required": true
      },
      "url": { "type": "string" }
    }
  }
}' "component 'social-link'"
sleep 7 && wait_for_strapi && validate_jwt

# hero
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "home",
    "displayName": "hero",
    "icon": "heading",
    "attributes": {
      "title": { "type": "string" },
      "subtitle": { "type": "string" },
      "backgroundImage": { "type": "media", "multiple": false },
      "buttonText": { "type": "string" },
      "buttonUrl": { "type": "string" },
      "description": { "type": "text" }
    }
  }
}' "component 'hero'"
sleep 7 && wait_for_strapi && validate_jwt

# showcase
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "home",
    "displayName": "showcase",
    "icon": "grid",
    "attributes": {
      "title": { "type": "string" },
      "description": { "type": "text" },
      "imageUrl": { "type": "media" },
      "buttonText": { "type": "string" },
      "imagePosition": {
        "type": "enumeration",
        "enum": ["left", "right"]
      }
    }
  }
}' "component 'showcase'"
sleep 7 && wait_for_strapi && validate_jwt

# story
post_with_retry "$STRAPI_URL/content-type-builder/components" '{
  "component": {
    "category": "home",
    "displayName": "story",
    "icon": "book",
    "attributes": {
      "title": { "type": "string" },
      "subtitle": { "type": "string" },
      "description": { "type": "text" },
      "backgroundImage": { "type": "media" },
      "buttonText": { "type": "string" },
      "buttonUrl": { "type": "string" }
    }
  }
}' "component 'story'"
sleep 7 && wait_for_strapi && validate_jwt

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
sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "header"

# Footer
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Footer",
    "singularName": "footer",
    "pluralName": "footers",
    "collectionName": "footers",
    "description": "Footer section",
    "attributes": {
      "text": { "type": "string" },
      "description": { "type": "string" },
      "social_links": {
        "type": "component",
        "repeatable": true,
        "component": "footer.social-link"
      },
      "footer_columns": {
        "type": "component",
        "repeatable": true,
        "component": "footer.footer-column"
      }
    }
  }
}' "collection type 'Footer'"
sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "footer"

# Home 
post_with_retry "$STRAPI_URL/content-type-builder/content-types" '{
  "contentType": {
    "displayName": "Home",
    "singularName": "home",
    "pluralName": "homes",
    "collectionName": "homes",
    "description": "Homepage main content",
    "attributes": {
      "title": { "type": "string", "required": true },
      "slug": { "type": "uid", "targetField": "title", "required": true },
      "seo_title": { "type": "text" },
      "seo_description": { "type": "text" },
      "hero": {
        "type": "component",
        "repeatable": false,
        "component": "home.hero"
      },
      "showcases": {
        "type": "component",
        "repeatable": true,
        "component": "home.showcase"
      },
      "story": {
        "type": "component",
        "repeatable": false,
        "component": "home.story"
      }
    }
  }
}' "collection type 'Home'"

sleep 7 && wait_for_strapi && validate_jwt
grant_public_permissions "home"

# Category (no relation yet)
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

# Article (no relations yet)
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

# Author (no relation yet)
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

# STEP 2.5: Add relations in the correct order
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

### STEP 3: Upload all media files and capture their IDs
echo "🖼️ Uploading images..."

# Check if assets directory exists
if [[ ! -d "$ASSETS_DIR" ]]; then
  echo "❌ Assets directory not found: $ASSETS_DIR"
  echo "📁 Please ensure the assets directory exists with the required images:"
  echo "   - girl-with-screen.jpeg"
  echo "   - laptop-right.jpeg" 
  echo "   - beautiful-robot.jpeg"
  echo "   - programmers.jpeg"
  echo "   - yensi-tech-logo.png"
  echo "   - HPGL.png"
  echo "   - rakesh.png"
  exit 1
fi

IMAGE_HERO=$(upload_image "$ASSETS_DIR/girl-with-screen.jpeg")
IMAGE_SHOWCASE_1=$(upload_image "$ASSETS_DIR/laptop-right.jpeg")
IMAGE_SHOWCASE_2=$(upload_image "$ASSETS_DIR/beautiful-robot.jpeg")
IMAGE_STORY=$(upload_image "$ASSETS_DIR/programmers.jpeg")

# Upload article images
IMAGE_ARTICLE_1=$(upload_image "$ASSETS_DIR/yensi-tech-logo.png")
IMAGE_ARTICLE_2=$(upload_image "$ASSETS_DIR/HPGL.png")

# Upload author image
IMAGE_AVATAR=$(upload_image "$ASSETS_DIR/rakesh.png")

echo "✅ Uploaded image IDs:"
echo "  Hero:         $IMAGE_HERO"
echo "  Showcase 1:   $IMAGE_SHOWCASE_1"
echo "  Showcase 2:   $IMAGE_SHOWCASE_2"
echo "  Story:        $IMAGE_STORY"
echo "  Article 1:    $IMAGE_ARTICLE_1"
echo "  Article 2:    $IMAGE_ARTICLE_2"
echo "  Author Avatar: $IMAGE_AVATAR"

# Validate all image IDs were captured
if [[ -z "$IMAGE_HERO" || -z "$IMAGE_SHOWCASE_1" || -z "$IMAGE_SHOWCASE_2" || -z "$IMAGE_STORY" || -z "$IMAGE_ARTICLE_1"  || -z "$IMAGE_ARTICLE_2" || -z "$IMAGE_AVATAR" ]]; then
  echo "❌ Failed to capture all image IDs. Exiting..."
  exit 1
fi

### STEP 4: Add Sample Data with media IDs injected

# Read original JSON files
HEADER_JSON=$(<"$CONTENT_DIR/header.json")
FOOTER_JSON=$(<"$CONTENT_DIR/footer.json")
HOME_RAW_JSON=$(<"$CONTENT_DIR/home.json")
ARTICLE_RAW_JSON=$(<"$CONTENT_DIR/article.json")
AUTHOR_RAW_JSON=$(<"$CONTENT_DIR/author.json")
CATEGORY_JSON=$(<"$CONTENT_DIR/category.json")

# Inject image IDs into home.json and retain all other data
echo "🔧 Processing home.json with image IDs..."
HOME_JSON=$(echo "$HOME_RAW_JSON" | jq \
  --argjson hero "$IMAGE_HERO" \
  --argjson sc1 "$IMAGE_SHOWCASE_1" \
  --argjson sc2 "$IMAGE_SHOWCASE_2" \
  --argjson story "$IMAGE_STORY" \
  '
  .hero.backgroundImage = $hero
  | .showcases[0].imageUrl = $sc1
  | .showcases[1].imageUrl = $sc2
  | .story.backgroundImage = $story
  ')

echo "📄 Final home.json structure:"
echo "$HOME_JSON" | jq .

# Validate that title and slug are present
TITLE_CHECK=$(echo "$HOME_JSON" | jq -r '.title // empty')
SLUG_CHECK=$(echo "$HOME_JSON" | jq -r '.slug // empty')

if [[ -z "$TITLE_CHECK" || -z "$SLUG_CHECK" ]]; then
  echo "❌ ERROR: Title or slug missing from home.json"
  echo "Title: '$TITLE_CHECK'"
  echo "Slug: '$SLUG_CHECK'"
  exit 1
fi

echo "✅ Validation passed - Title: '$TITLE_CHECK', Slug: '$SLUG_CHECK'"

# Post category data first
echo "📂 Creating multiple categories from category.json..."
echo "$CATEGORY_JSON" | jq -c '.[]' | while read -r category; do
  post_with_retry "$STRAPI_URL/content-manager/collection-types/api::category.category" "$category" "category $(echo "$category" | jq -r '.name')"
done

# Create arrays to store article IDs
ARTICLE_IDS=()

# Post articles and capture their IDs
echo "📝 Creating articles and capturing IDs..."
echo "$ARTICLE_RAW_JSON" | jq -c '.[]' | while read -r article; do
  post_with_retry "$STRAPI_URL/content-manager/collection-types/api::article.article" "$article" "article $(echo "$article" | jq -r '.title')"
  
  # Capture the ID of the created article
  ARTICLE_ID=$(curl -s "$STRAPI_URL/api/articles?filters[title]=$(echo "$article" | jq -r '.title')" -H "Authorization: Bearer $ADMIN_JWT" | jq -r '.data[0].id')
  
  if [[ -z "$ARTICLE_ID" || "$ARTICLE_ID" == "null" ]]; then
    echo "❌ Failed to get article ID for article: $(echo "$article" | jq -r '.title')"
    exit 1
  fi
  
  ARTICLE_IDS+=("$ARTICLE_ID")
  echo "✅ Captured Article ID: $ARTICLE_ID"
done

# Validate that all article IDs were captured
if [[ ${#ARTICLE_IDS[@]} -ne $(echo "$ARTICLE_RAW_JSON" | jq -r '. | length') ]]; then
  echo "❌ Failed to capture all article IDs. Exiting..."
  exit 1
fi

echo "✅ All Article IDs captured: ${ARTICLE_IDS[@]}"

# Post authors with avatar image
echo "👤 Creating authors with avatar images..."
echo "$AUTHOR_RAW_JSON" | jq -c '.[]' | while read -r author; do
  # Inject avatar for rakesh
  if [[ $(echo "$author" | jq -r '.email') == "rakesh2@aiyensi.com" ]]; then
    author=$(echo "$author" | jq --argjson avatar_id "$IMAGE_AVATAR" '.avatar = $avatar_id')
    
    # Inject article IDs
    author=$(echo "$author" | jq --argjson article_ids "$(jq -n <<<"${ARTICLE_IDS[@]}" )" '.articles = $article_ids')
  fi
  post_with_retry "$STRAPI_URL/content-manager/collection-types/api::author.author" "$author" "author $(echo "$author" | jq -r '.name')"
done

# Fetch IDs of rakesh and tech category
echo "🔍 Fetching author and category IDs..."
RAKESH_ID=$(curl -s "$STRAPI_URL/api/authors?filters[email]=rakesh2@aiyensi.com" -H "Authorization: Bearer $ADMIN_JWT" | jq -r '.data[0].id')
TECH_CAT_ID=$(curl -s "$STRAPI_URL/api/categories?filters[slug]=tech" -H "Authorization: Bearer $ADMIN_JWT" | jq -r '.data[0].id')

echo "Rakesh ID: $RAKESH_ID"
echo "Tech Category ID: $TECH_CAT_ID"

if [[ -z "$RAKESH_ID" || "$RAKESH_ID" == "null" || -z "$TECH_CAT_ID" || "$TECH_CAT_ID" == "null" ]]; then
  echo "❌ Failed to get author or category IDs"
  exit 1
fi

# Inject author and category into each article
ARTICLE_JSON=$(echo "$ARTICLE_RAW_JSON" | jq \
  --argjson author_id "$RAKESH_ID" \
  --argjson category_id "$TECH_CAT_ID" \
  --argjson img1 "$IMAGE_ARTICLE_1" \
  --argjson img2 "$IMAGE_ARTICLE_2" \
  '.[0].author = $author_id | .[0].category = $category_id | .[0].coverMedia = $img1 |
   .[1].author = $author_id | .[1].category = $category_id | .[1].coverMedia = $img2')

# Post header, footer, and home
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::header.header" "$HEADER_JSON" "sample data in 'Header'"
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::footer.footer" "$FOOTER_JSON" "sample data in 'Footer'"
post_with_retry "$STRAPI_URL/content-manager/collection-types/api::home.home" "$HOME_JSON" "sample data in 'Home'"

echo "✅ All sample content successfully added!"
echo "✅ All components, collection types, permissions, and content created successfully!"

### STEP 5: Start Frontend App

TEMPLATES_DIR="../templates"

# Check if fzf is installed
if ! command -v fzf &> /dev/null; then
  echo "❌ 'fzf' is required but not installed. Please install it:"
  echo "🔧 macOS: brew install fzf"
  echo "🔧 Linux: sudo apt install fzf"
  echo "🔧 Windows (Git Bash): install from https://github.com/junegunn/fzf"
  exit 1
fi

echo "🎯 Scanning available frontend templates in '$TEMPLATES_DIR'..."

# List template folders and select using fzf
SELECTED_TEMPLATE=$(find "$TEMPLATES_DIR" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | fzf --prompt "👉 Select a frontend template: " --height=10)

if [ -z "$SELECTED_TEMPLATE" ]; then
  echo "⚠️ No template selected. Exiting..."
  exit 1
fi

echo "✅ Selected: $SELECTED_TEMPLATE"

# Navigate to the selected template
cd "$TEMPLATES_DIR/$SELECTED_TEMPLATE" || { echo "🚨 Failed to enter template directory."; exit 1; }

# Install dependencies if not already done
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the dev server
echo "🚀 Starting Vite dev server..."
npm run dev &

# Wait for the server and open browser
sleep 5
start http://localhost:5174
