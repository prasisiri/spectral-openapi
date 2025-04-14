#!/usr/bin/env node

/**
 * MRS (Multi Ruleset Specification) validator script
 * This script allows using .mrs files with Spectral
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const os = require('os');

// Get the MRS file path from command line args or use default
const mrsFilePath = process.argv[2] || 'spectral.mrs';
const targetFile = process.argv[3] || 'openapi-spec/pet-store.yaml';

// Create a temporary JSON file
const tempFile = path.join(os.tmpdir(), 'spectral-temp-ruleset.json');

try {
  // Read the MRS file
  const mrsContent = fs.readFileSync(mrsFilePath, 'utf8');
  
  // Write to temp file
  fs.writeFileSync(tempFile, mrsContent);
  
  console.log(`Using MRS file: ${mrsFilePath}`);
  console.log(`Validating: ${targetFile}`);
  
  // Run spectral with the temp file
  const spectral = spawnSync('spectral', [
    'lint',
    targetFile,
    '--ruleset',
    tempFile,
    '--format',
    'pretty'
  ], { stdio: 'inherit' });
  
  process.exit(spectral.status);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} finally {
  // Clean up temp file
  try {
    fs.unlinkSync(tempFile);
  } catch (e) {
    // Ignore cleanup errors
  }
} 