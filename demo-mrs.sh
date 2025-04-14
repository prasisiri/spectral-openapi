#!/bin/bash

# Demo script for MJS files with Spectral

# Display MJS file
echo "=== Module JavaScript Ruleset (.mjs) ==="
cat spectral.mjs | head -20
echo "..."
echo ""

# Copy to a temporary JSON file for Spectral
echo "=== Converting MJS to JSON for Spectral compatibility ==="
cp spectral.mjs temp-ruleset.json
echo "Created temporary JSON file for Spectral compatibility"
echo ""

# Run Spectral on problematic spec
echo "=== Running validation on problematic spec ==="
spectral lint openapi-spec/pet-store.yaml --ruleset temp-ruleset.json
echo ""

# Run Spectral on fixed spec
echo "=== Running validation on fixed spec ==="
spectral lint openapi-spec/pet-store-fixed.yaml --ruleset temp-ruleset.json
echo ""

# Clean up
rm temp-ruleset.json

echo "=== Demo completed ==="
echo "The .mjs file format is used for JavaScript ES modules,"
echo "which allows using native JavaScript for complex validations."
