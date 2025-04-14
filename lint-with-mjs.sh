#!/bin/bash

# Script to run Spectral with MJS ruleset
# Usage: ./lint-with-mjs.sh <openapi-file> [ruleset-file]

# Default to pet-store.yaml if no argument provided
TARGET_FILE=${1:-"openapi-spec/pet-store.yaml"}
# Default to local ruleset if not specified
RULESET_FILE=${2:-"spectral.mjs"}

# Ensure dependencies are installed
if ! npm list -g @stoplight/spectral-cli >/dev/null 2>&1; then
    echo "Installing Spectral CLI..."
    npm install -g @stoplight/spectral-cli
fi

if ! npm list @stoplight/spectral-functions >/dev/null 2>&1; then
    echo "Installing Spectral Functions..."
    npm install @stoplight/spectral-functions
fi

# Check if external ruleset
if [[ $RULESET_FILE == http* ]]; then
    echo "Using external ruleset: $RULESET_FILE"
    # When using an external ruleset, use a local fallback if it fails
    spectral lint "$TARGET_FILE" --ruleset "$RULESET_FILE" || {
        echo "External ruleset failed, falling back to local ruleset"
        spectral lint "$TARGET_FILE" --ruleset spectral.mjs
    }
else
    # Run Spectral with the specified MJS ruleset
    echo "Running Spectral with ruleset: $RULESET_FILE"
    echo "File: $TARGET_FILE"
    spectral lint "$TARGET_FILE" --ruleset "$RULESET_FILE"
fi

# Show success or error info
if [ $? -eq 0 ]; then
    echo "✅ Validation successful with MJS ruleset!"
else
    echo "❌ Validation found issues with MJS ruleset."
fi
