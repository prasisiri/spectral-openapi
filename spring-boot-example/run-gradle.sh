#!/bin/bash

# Simple script to run Gradle commands directly (for demo purposes)
# Usage: ./run-gradle.sh <command>
# Example: ./run-gradle.sh lintOpenApi

# Check if Gradle is installed
if ! command -v gradle &> /dev/null; then
    echo "Gradle is not installed. Please install it first."
    echo "On macOS: brew install gradle"
    echo "On Ubuntu: sudo apt install gradle"
    exit 1
fi

# Run the gradle command
cd "$(dirname "$0")"
gradle "$@" 