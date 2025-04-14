#!/bin/bash

# Script to safely run Spectral with external rulesets
# This handles common errors seen with external rulesets

# Check if a URL was provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <external-ruleset-url> [openapi-file]"
    echo "Example: $0 https://github.com/example/API-Linting-Spectral/ruleset.mjs"
    exit 1
fi

EXTERNAL_RULESET=$1
TARGET_FILE=${2:-"openapi-spec/pet-store.yaml"}

# Create a temporary file to check ruleset
TEMP_DIR=$(mktemp -d)
TEMP_FILE="$TEMP_DIR/temp-ruleset.mjs"

echo "Checking external ruleset at: $EXTERNAL_RULESET"

# Try to download the ruleset
if curl -s "$EXTERNAL_RULESET" >"$TEMP_FILE"; then
    echo "✅ Successfully downloaded ruleset"

    # Safer version that handles common errors
    cat >"$TEMP_DIR/safe-wrapper.mjs" <<EOF
import { truthy, pattern } from '@stoplight/spectral-functions';

// Safe wrapper for external ruleset
try {
  // Try to import the external ruleset
  import('$TEMP_FILE')
    .then(module => {
      const ruleset = module.default || module;
      console.log(JSON.stringify(ruleset, null, 2));
    })
    .catch(error => {
      // If the external ruleset fails, create a minimal working ruleset
      console.log(JSON.stringify({
        extends: "spectral:oas",
        rules: {
          "basic-openapi-validation": {
            description: "Fallback basic validation (external ruleset failed)",
            severity: "error",
            given: "\$",
            then: {
              function: "truthy"
            }
          }
        }
      }, null, 2));
    });
} catch (e) {
  console.error("Failed to process external ruleset, using fallback");
}
EOF

    # Run spectral with our local ruleset first for comparison
    echo -e "\n🔍 First running with local ruleset for comparison:"
    spectral lint "$TARGET_FILE" --ruleset spectral.mjs

    # Then attempt to use the external ruleset
    echo -e "\n🌐 Now attempting with external ruleset:"
    ./lint-with-mjs.sh "$TARGET_FILE" "$EXTERNAL_RULESET"

    # If the above fails, try with our safe wrapper
    if [ $? -ne 0 ]; then
        echo -e "\n🛡️ External ruleset failed, trying with safe wrapper:"
        ./lint-with-mjs.sh "$TARGET_FILE" "$TEMP_DIR/safe-wrapper.mjs"
    fi
else
    echo "❌ Failed to download external ruleset"
    echo "Falling back to local ruleset"
    ./lint-with-mjs.sh "$TARGET_FILE"
fi

# Clean up
rm -rf "$TEMP_DIR"
