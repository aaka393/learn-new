#!/bin/bash

PROJECT_NAME="my-strapi-project"
STRAPI_PORT=1337
STRAPI_URL="http://localhost:$STRAPI_PORT"
PROJECT_DIR="D:\learn-new\script\second-attempt-script-using-sh"  # Replace this with the absolute path where you want the project to be created

# Step 1: Create new Strapi project in the specified directory
echo "Creating Strapi project: $PROJECT_NAME at $PROJECT_DIR..."
npx create-strapi-app@latest "$PROJECT_DIR/$PROJECT_NAME" --quickstart

cd "$PROJECT_DIR/$PROJECT_NAME" || exit 1

echo "Installing dependencies..."
npm install

echo "Starting Strapi backend in background..."
npm run develop &