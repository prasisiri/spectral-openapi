#!/usr/bin/env node

const fs = require("fs");
const yaml = require("js-yaml");
const { difference, intersection, keys, union } = require("lodash");

// Get ruleset paths from arguments
const rulesetPath1 = process.argv[2];
const rulesetPath2 = process.argv[3];

if (!rulesetPath1 || !rulesetPath2) {
  console.error(
    "Usage: node spectral-compare.js <ruleset1.mjs> <ruleset2.mjs>"
  );
  process.exit(1);
}

// Load rulesets
function loadRuleset(path) {
  const content = fs.readFileSync(path, "utf8");
  try {
    if (path.endsWith(".yaml") || path.endsWith(".yml")) {
      return yaml.load(content);
    } else {
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error parsing ${path}: ${e.message}`);
    process.exit(1);
  }
}

const ruleset1 = loadRuleset(rulesetPath1);
const ruleset2 = loadRuleset(rulesetPath2);

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

    // Could add more detailed comparison of other properties
  });
}
