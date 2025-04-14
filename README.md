# OpenAPI Spectral Linting Demo

This project demonstrates how to use Spectral to validate OpenAPI specifications against custom linting rules.

## Setup

1. Install dependencies:

```bash
npm install -g @stoplight/spectral-cli
```

2. The ruleset is defined in `.spectral.yaml` with custom rules for:
   - Path naming conventions (kebab-case)
   - Required operation descriptions
   - Required tags for operations
   - Operation ID format validation
   - Response examples enforcement
   - API versioning standards
   - Semantic versioning format

## Demo Flow

### 1. Linting the Problematic Spec

Run the linting command on the problematic spec:

```bash
spectral lint openapi-spec/pet-store.yaml
```

### 2. Reviewing Rule Violations

Explain each rule violation:

- Path kebab-case issue (`/Pets` vs `/pets`)
- Missing operation description
- Missing operation tags
- Incorrect operationId format (`GetAllPets` vs `getAllPets`)
- Missing response examples
- Server URL missing version
- API version not in semantic versioning format

### 3. Fixing the Issues

Show how you've fixed each issue in the corrected spec. Run the linting command on the fixed spec:

```bash
spectral lint openapi-spec/pet-store-fixed.yaml
```

### 4. Integration with Spring Boot

The `spring-boot-example` folder contains a demo Spring Boot project with Spectral integration.

#### Features

- **Static OpenAPI File**: Located at `src/main/resources/openapi.yaml`
- **Swagger UI**: Accessible at `/swagger-ui.html` when the application is running
- **Build-time Validation**: Gradle task runs Spectral linting during the build process

#### How to Use

1. Navigate to the Spring Boot example:

```bash
cd spring-boot-example
```

2. Make the run script executable:

```bash
chmod +x run-gradle.sh
```

3. Run the linting task:

```bash
./run-gradle.sh lintOpenApi
```

4. Build the application with linting included:

```bash
./run-gradle.sh build
```

5. Run the application:

```bash
./run-gradle.sh bootRun
```

6. Access the Swagger UI at: `http://localhost:8080/swagger-ui.html`

#### How It Works

1. The Gradle task copies the Spectral ruleset to the resources directory
2. It then runs Spectral against the OpenAPI specification
3. The build fails if the OpenAPI spec doesn't meet your standards
4. SpringDoc serves the static YAML file through Swagger UI

## Working with Multiple MJS Files

### Understanding JavaScript Module Rulesets (.mjs)

MJS files are used to define API governance rules using JavaScript ES modules format. They offer advantages over traditional YAML rulesets:

- Native JavaScript features for complex validation logic
- ES Modules support with import/export syntax
- Better IDE integration and TypeScript support
- Dynamic rules with complex logic implementation

### Comparing Multiple MJS Files

To compare multiple MJS files for evaluation and feedback, you can use the following approach:

1. Create a comparison script:

```bash
# Install required dependencies
npm install @stoplight/spectral-core js-yaml lodash

# Create a comparison script
cat > spectral-compare.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');
const { difference, intersection, keys, union } = require('lodash');

// Get ruleset paths from arguments
const rulesetPath1 = process.argv[2];
const rulesetPath2 = process.argv[3];

if (!rulesetPath1 || !rulesetPath2) {
  console.error('Usage: node spectral-compare.js <ruleset1.mjs> <ruleset2.mjs>');
  process.exit(1);
}

// Load rulesets
function loadRuleset(path) {
  const content = fs.readFileSync(path, 'utf8');
  try {
    if (path.endsWith('.yaml') || path.endsWith('.yml')) {
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
console.log(`\n=== Ruleset Comparison: ${rulesetPath1} vs ${rulesetPath2} ===\n`);
console.log(`Total rules in ${rulesetPath1}: ${rules1.length}`);
console.log(`Total rules in ${rulesetPath2}: ${rules2.length}`);
console.log(`Common rules: ${commonRules.length}`);
console.log(`Rules unique to ${rulesetPath1}: ${uniqueToFirst.length}`);
console.log(`Rules unique to ${rulesetPath2}: ${uniqueToSecond.length}\n`);

// Detailed comparison
if (uniqueToFirst.length > 0) {
  console.log(`\n=== Rules only in ${rulesetPath1} ===\n`);
  uniqueToFirst.forEach(rule => {
    console.log(`- ${rule} (${ruleset1.rules[rule].severity}): ${ruleset1.rules[rule].description}`);
  });
}

if (uniqueToSecond.length > 0) {
  console.log(`\n=== Rules only in ${rulesetPath2} ===\n`);
  uniqueToSecond.forEach(rule => {
    console.log(`- ${rule} (${ruleset2.rules[rule].severity}): ${ruleset2.rules[rule].description}`);
  });
}

if (commonRules.length > 0) {
  console.log(`\n=== Common rules with different configurations ===\n`);
  commonRules.forEach(rule => {
    const rule1 = ruleset1.rules[rule];
    const rule2 = ruleset2.rules[rule];

    if (rule1.severity !== rule2.severity) {
      console.log(`- ${rule}: Severity differs (${rule1.severity} vs ${rule2.severity})`);
    }

    if (rule1.description !== rule2.description) {
      console.log(`- ${rule}: Description differs`);
    }

    // Could add more detailed comparison of other properties
  });
}
EOF

# Make it executable
chmod +x spectral-compare.js
```

2. Usage examples:

```bash
# Basic comparison
node spectral-compare.js ruleset1.mjs ruleset2.mjs

# Compare across directories
for file in teamA/*.mjs; do
  node spectral-compare.js reference.mjs "$file" > "comparison-$(basename "$file").txt"
done

# Create an HTML report (requires additional HTML template)
node spectral-compare.js ruleset1.mjs ruleset2.mjs | node format-as-html.js > comparison.html
```

### Analyzing Multiple MJS Files

When providing feedback on multiple MJS files, consider:

1. **Governance Context**:

   - Target API types (internal, partner, public)
   - Standards implementation (company, industry)

2. **Technical Evaluation**:

   - Configuration validity
   - Rule duplication
   - Severity appropriateness

3. **Coverage Analysis**:

   - Security aspects
   - Consistency requirements
   - Documentation standards
   - Performance considerations

4. **Testing**:

   - False positive identification
   - Issue detection verification

5. **Documentation**:
   - Per-ruleset recommendations
   - Consolidation opportunities
   - Gap analysis
   - Implementation suggestions

## Custom Rules Explanation

Explain the rationale behind each custom rule:

- **path-kebab-case**: Ensures consistent API URL structure
- **operation-description**: Makes API self-documenting
- **operation-tags**: Ensures proper API categorization
- **operation-operationId**: Enforces consistent naming for client code generation
- **response-examples**: Promotes better documentation and testing
- **servers-url-version**: Enforces proper API versioning
- **api-version-format**: Ensures semantic versioning for clearer release management
