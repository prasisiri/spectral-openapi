#!/usr/bin/env node

const fs = require("fs");
const yaml = require("js-yaml");
const { difference, intersection, keys, union } = require("lodash");
const { execSync } = require("child_process");
const path = require("path");
const os = require("os");

// Get ruleset paths from arguments
const rulesetPath1 = process.argv[2];
const rulesetPath2 = process.argv[3];

if (!rulesetPath1 || !rulesetPath2) {
  console.error(
    "Usage: node spectral-compare.js <ruleset1.mjs> <ruleset2.mjs>"
  );
  process.exit(1);
}

// Load rulesets, handling different formats including .mjs
async function loadRuleset(filePath) {
  try {
    // Handle MJS files (ES Modules)
    if (filePath.endsWith(".mjs")) {
      const tempDir = os.tmpdir();
      const tempJsonFile = path.join(tempDir, `ruleset-${Date.now()}.json`);
      const tempEsmFile = path.join(tempDir, `loader-${Date.now()}.mjs`);

      // Create a temporary ESM loader that will export the ruleset to JSON
      const loaderCode = `
        import * as rulesetModule from '${path.resolve(filePath)}';
        import fs from 'fs';
        import path from 'path';
        
        const ruleset = rulesetModule.default || rulesetModule;
        fs.writeFileSync('${tempJsonFile}', JSON.stringify(ruleset, null, 2));
      `;

      fs.writeFileSync(tempEsmFile, loaderCode);

      try {
        // Execute the ESM loader
        execSync(`node ${tempEsmFile}`, {
          encoding: "utf8",
          stdio: "inherit",
        });

        // Read the resulting JSON file
        const rulesetJson = fs.readFileSync(tempJsonFile, "utf8");
        const ruleset = JSON.parse(rulesetJson);

        // Clean up temporary files
        fs.unlinkSync(tempEsmFile);
        fs.unlinkSync(tempJsonFile);

        return ruleset;
      } catch (execError) {
        console.error(
          `Error loading MJS file ${filePath}: ${execError.message}`
        );
        process.exit(1);
      }
    }

    // Handle YAML and JSON files
    const content = fs.readFileSync(filePath, "utf8");
    if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
      return yaml.load(content);
    } else {
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error parsing ${filePath}: ${e.message}`);
    process.exit(1);
  }
}

// Main function to run the comparison
async function compareRulesets() {
  console.log("Loading rulesets...");
  const ruleset1 = await loadRuleset(rulesetPath1);
  const ruleset2 = await loadRuleset(rulesetPath2);

  // Get rule names
  const rules1 = keys(ruleset1.rules || {});
  const rules2 = keys(ruleset2.rules || {});

  // Compare rules
  const commonRules = intersection(rules1, rules2);
  const uniqueToFirst = difference(rules1, rules2);
  const uniqueToSecond = difference(rules2, rules1);
  const allRules = union(rules1, rules2);

  // Output comparison
  console.log(
    `\n=== Ruleset Comparison: ${rulesetPath1} vs ${rulesetPath2} ===\n`
  );
  console.log(`Total rules in ${rulesetPath1}: ${rules1.length}`);
  console.log(`Total rules in ${rulesetPath2}: ${rules2.length}`);
  console.log(`Common rules: ${commonRules.length}`);
  console.log(`Rules unique to ${rulesetPath1}: ${uniqueToFirst.length}`);
  console.log(`Rules unique to ${rulesetPath2}: ${uniqueToSecond.length}\n`);

  // Detailed comparison
  if (uniqueToFirst.length > 0) {
    console.log(`\n=== Rules only in ${rulesetPath1} ===\n`);
    uniqueToFirst.forEach((rule) => {
      console.log(
        `- ${rule} (${ruleset1.rules[rule].severity}): ${ruleset1.rules[rule].description}`
      );
    });
  }

  if (uniqueToSecond.length > 0) {
    console.log(`\n=== Rules only in ${rulesetPath2} ===\n`);
    uniqueToSecond.forEach((rule) => {
      console.log(
        `- ${rule} (${ruleset2.rules[rule].severity}): ${ruleset2.rules[rule].description}`
      );
    });
  }

  if (commonRules.length > 0) {
    console.log(`\n=== Common rules with different configurations ===\n`);
    let foundDifferences = false;

    commonRules.forEach((rule) => {
      const rule1 = ruleset1.rules[rule];
      const rule2 = ruleset2.rules[rule];
      let hasDifference = false;

      if (rule1.severity !== rule2.severity) {
        console.log(
          `- ${rule}: Severity differs (${rule1.severity} vs ${rule2.severity})`
        );
        hasDifference = true;
      }

      if (rule1.description !== rule2.description) {
        console.log(`- ${rule}: Description differs`);
        console.log(`  ${rulesetPath1}: ${rule1.description}`);
        console.log(`  ${rulesetPath2}: ${rule2.description}`);
        hasDifference = true;
      }

      // Compare given paths
      if (rule1.given !== rule2.given) {
        console.log(`- ${rule}: Target paths differ`);
        console.log(`  ${rulesetPath1}: ${rule1.given}`);
        console.log(`  ${rulesetPath2}: ${rule2.given}`);
        hasDifference = true;
      }

      foundDifferences = foundDifferences || hasDifference;
    });

    if (!foundDifferences) {
      console.log("No differences found in common rules.");
    }
  }

  // Custom functions are hard to detect after serialization since they become undefined or empty objects
  // Instead, we'll analyze the rule configurations to infer if they might have had custom functions
  const customFunctionRules1 = rules1.filter(
    (rule) =>
      !ruleset1.rules[rule].then?.function ||
      typeof ruleset1.rules[rule].then?.function !== "string"
  );

  const customFunctionRules2 = rules2.filter(
    (rule) =>
      !ruleset2.rules[rule].then?.function ||
      typeof ruleset2.rules[rule].then?.function !== "string"
  );

  if (customFunctionRules1.length > 0 || customFunctionRules2.length > 0) {
    console.log(`\n=== Potential Custom JavaScript Functions ===\n`);

    if (customFunctionRules1.length > 0) {
      console.log(`Rules in ${rulesetPath1} that might use custom functions:`);
      customFunctionRules1.forEach((rule) => {
        console.log(`- ${rule}: ${ruleset1.rules[rule].description}`);
      });
    }

    if (customFunctionRules2.length > 0) {
      console.log(`Rules in ${rulesetPath2} that might use custom functions:`);
      customFunctionRules2.forEach((rule) => {
        console.log(`- ${rule}: ${ruleset2.rules[rule].description}`);
      });
    }
  }
}

// Run the comparison
compareRulesets().catch((error) => {
  console.error("Comparison failed:", error);
  process.exit(1);
});
