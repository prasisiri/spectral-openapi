#!/bin/bash

# Script to run Spectral with MJS ruleset
# Usage: ./lint-with-mjs.sh <openapi-file>

# Default to pet-store.yaml if no argument provided
TARGET_FILE=${1:-"openapi-spec/pet-store.yaml"}

# Ensure dependencies are installed
if ! npm list -g @stoplight/spectral-cli >/dev/null 2>&1; then
    echo "Installing Spectral CLI..."
    npm install -g @stoplight/spectral-cli
fi

if ! npm list @stoplight/spectral-functions >/dev/null 2>&1; then
    echo "Installing Spectral Functions..."
    npm install @stoplight/spectral-functions
fi

# Run Spectral with the MJS ruleset
echo "Running Spectral with MJS ruleset..."
echo "File: $TARGET_FILE"
spectral lint "$TARGET_FILE" --ruleset spectral.mjs

# Show success or error info
if [ $? -eq 0 ]; then
    echo "✅ Validation successful with MJS ruleset!"
else
    echo "❌ Validation found issues with MJS ruleset."
fi
