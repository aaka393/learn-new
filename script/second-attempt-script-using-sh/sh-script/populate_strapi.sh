#!/bin/bash

# Check if JWT token is provided
if [ -z "$1" ]; then
  echo "Usage: ./populate_strapi.sh <JWT_TOKEN> [<filename>]"
  exit 1
fi

ADMIN_JWT="$1"

# Check if filename is provided
if [ -z "$2" ]; then
  echo "No filename provided. Using default content files."
  FILENAME=""
else
  FILENAME="$2"
fi

echo "=================================================="
echo "🚀 Starting Strapi content population..."
echo "=================================================="

echo "⏳ Populating Home content..."
source home.sh "$ADMIN_JWT" "home"
echo "✅ Home content populated."

echo "⏳ Populating Header content..."
source header.sh "$ADMIN_JWT" "header"
echo "✅ Header content populated."

echo "⏳ Populating Footer content..."
source footer.sh "$ADMIN_JWT" "footer"
echo "✅ Footer content populated."

echo "⏳ Populating Article content..."
source article.sh "$ADMIN_JWT" "article"
echo "✅ Article content populated."

echo "⏳ Populating About content..."
source about.sh "$ADMIN_JWT" "about"
echo "✅ About content populated."

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
