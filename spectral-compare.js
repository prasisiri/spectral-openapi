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
      const tempFile = path.join(os.tmpdir(), `temp-ruleset-${Date.now()}.js`);

      // Create a temporary CommonJS wrapper to import the ESM
      fs.writeFileSync(
        tempFile,
        `
        import * as ruleset from '${path.resolve(filePath)}';
        import { writeFileSync } from 'fs';
        
        // Extract the default export or the entire module
        const rulesetData = ruleset.default || ruleset;
        
        // Write to stdout for the parent process to capture
        writeFileSync(1, JSON.stringify(rulesetData));
      `
      );

      try {
        // Execute the wrapper with Node.js ESM support
        const result = execSync(`node --input-type=module ${tempFile}`, {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        });

        return JSON.parse(result);
      } catch (execError) {
        console.error(
          `Error executing MJS file ${filePath}: ${execError.message}`
        );
        if (execError.stderr) console.error(execError.stderr);
        process.exit(1);
      } finally {
        // Clean up temp file
        fs.unlinkSync(tempFile);
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
    commonRules.forEach((rule) => {
      const rule1 = ruleset1.rules[rule];
      const rule2 = ruleset2.rules[rule];

      if (rule1.severity !== rule2.severity) {
        console.log(
          `- ${rule}: Severity differs (${rule1.severity} vs ${rule2.severity})`
        );
      }

      if (rule1.description !== rule2.description) {
        console.log(`- ${rule}: Description differs`);
      }

      // Compare given paths
      if (rule1.given !== rule2.given) {
        console.log(`- ${rule}: Target paths differ`);
        console.log(`  ${rulesetPath1}: ${rule1.given}`);
        console.log(`  ${rulesetPath2}: ${rule2.given}`);
      }

      // Compare function types
      const function1 = rule1.then?.function;
      const function2 = rule2.then?.function;

      if (typeof function1 !== typeof function2) {
        console.log(
          `- ${rule}: Function implementation differs (${typeof function1} vs ${typeof function2})`
        );
      }
    });
  }

  // Check for custom JavaScript functions
  console.log(`\n=== Custom JavaScript Functions ===\n`);

  const jsFunction1 = Object.values(ruleset1.rules || {}).filter(
    (r) => typeof r.then?.function === "function"
  ).length;

  const jsFunction2 = Object.values(ruleset2.rules || {}).filter(
    (r) => typeof r.then?.function === "function"
  ).length;

  console.log(`Custom functions in ${rulesetPath1}: ${jsFunction1}`);
  console.log(`Custom functions in ${rulesetPath2}: ${jsFunction2}`);
}

// Run the comparison
compareRulesets().catch((error) => {
  console.error("Comparison failed:", error);
  process.exit(1);
});
