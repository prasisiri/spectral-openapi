#!/usr/bin/env node

/**
 * MJS (Module JavaScript) validator script
 * This script allows using .mjs files with Spectral
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const os = require("os");

// Get the MJS file path from command line args or use default
const mjsFilePath = process.argv[2] || "spectral.mjs";
const targetFile = process.argv[3] || "openapi-spec/pet-store.yaml";

// Create a temporary JSON file
const tempFile = path.join(os.tmpdir(), "spectral-temp-ruleset.json");

try {
  // Read the MJS file
  const mjsContent = fs.readFileSync(mjsFilePath, "utf8");

  // Write to temp file
  fs.writeFileSync(tempFile, mjsContent);

  console.log(`Using MJS file: ${mjsFilePath}`);
  console.log(`Validating: ${targetFile}`);

  // Run spectral with the temp file
  const spectral = spawnSync(
    "spectral",
    ["lint", targetFile, "--ruleset", tempFile, "--format", "pretty"],
    { stdio: "inherit" }
  );

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
