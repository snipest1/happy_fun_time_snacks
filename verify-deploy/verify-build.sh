#!/bin/bash

# Create log file if it doesn't exist
LOG_FILE="verify-deploy/.search-history.log"
mkdir -p verify-deploy
touch $LOG_FILE

# Ask what to verify in the final build
read -p "🔍 Enter string to verify in build output: " search

if [ -z "$search" ]; then
  echo "❌ No input provided. Exiting."
  exit 1
fi

# Log the search
echo "$(date): $search" >> $LOG_FILE

# Clean and build
echo "🧹 Cleaning old build..."
rm -rf frontend/dist

echo "🔨 Building frontend..."
npm --prefix frontend run build

# Validate
echo "🔎 Searching for '$search' in frontend/dist..."
if grep -r "$search" frontend/dist > /dev/null; then
  echo "✅ '$search' found. Deploying to Netlify..."
  netlify deploy --prod
else
  echo "❌ '$search' NOT found. Deployment cancelled."
  echo "📝 Check your source files, save your changes, then rebuild."
  exit 1
fi

