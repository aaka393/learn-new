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
