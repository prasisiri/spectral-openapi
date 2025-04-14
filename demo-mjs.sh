#!/bin/bash

# Demo script for MJS files with Spectral
set -e

echo "====================================================="
echo "🚀 Spectral MJS Ruleset Demo"
echo "====================================================="

# Display MJS file structure
echo -e "\n📋 MJS Ruleset Structure (Preview)"
echo "====================================================="
head -n 20 spectral.mjs
echo "..."
echo ""

# Install dependencies if needed
if ! npm list @stoplight/spectral-functions >/dev/null 2>&1; then
    echo -e "\n📦 Installing Dependencies"
    echo "====================================================="
    npm install @stoplight/spectral-functions
    echo ""
fi

# Run Spectral on problematic spec
echo -e "\n🔍 Validating Problematic Spec"
echo "====================================================="
spectral lint openapi-spec/pet-store.yaml --ruleset spectral.mjs
echo ""

# Run Spectral on fixed spec
echo -e "\n✅ Validating Fixed Spec"
echo "====================================================="
spectral lint openapi-spec/pet-store-fixed.yaml --ruleset spectral.mjs
echo ""

# Show how to integrate with Spring Boot
echo -e "\n🔄 Spring Boot Integration"
echo "====================================================="
echo "To integrate with Spring Boot, run:"
echo "./run-gradle.sh lintOpenApi"
echo ""

echo -e "\n📚 MJS Benefits"
echo "====================================================="
echo "- Native JavaScript for complex validations"
echo "- ES Modules support for better organization"
echo "- Custom validation functions"
echo "- Better IDE integration"
echo ""
