#!/bin/bash

# Demo script for MRS files with Spectral

# Display MRS file
echo "=== Multi Ruleset Specification (.mrs) ==="
cat spectral.mrs | head -20
echo "..."
echo ""

# Copy to a temporary JSON file for Spectral
echo "=== Converting MRS to JSON for Spectral compatibility ==="
cp spectral.mrs temp-ruleset.json
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
echo "The .mrs file format is used for Multi Ruleset Specification,"
echo "which is more structured than traditional YAML rulesets." 