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

### Enhanced Comparison Tool for MJS Files

The included `spectral-compare.js` script fully supports comparing JavaScript ES Module (.mjs) rulesets:

```javascript
// Example MJS ruleset structure
import { truthy, pattern } from "@stoplight/spectral-functions";

export default {
  extends: ["spectral:oas"],
  rules: {
    "path-kebab-case": {
      description: "Path segments must use kebab-case",
      severity: "error",
      given: "$.paths.*~",
      then: {
        function: pattern,
        functionOptions: {
          match: "^(\\/[a-z0-9-]+|\\/\\{[a-zA-Z0-9]+\\})+$",
        },
      },
    },
    // Custom JavaScript function for complex validation
    "no-excessive-nesting": {
      description: "Prevents excessive nesting in schemas",
      severity: "warn",
      given: "$.components.schemas.*",
      then: {
        function: checkNesting, // Reference to JavaScript function
      },
    },
  },
};

// Custom function implementation
function checkNesting(schema, _options, context) {
  // Complex validation logic here
}
```

#### Installation

```bash
# Install required dependencies
npm install @stoplight/spectral-core js-yaml lodash
```

#### Usage Examples

```bash
# Basic comparison
node spectral-compare.js ruleset1.mjs ruleset2.mjs

# Compare MJS with YAML or JSON rulesets
node spectral-compare.js company-ruleset.mjs standard-ruleset.yaml

# Compare across directories
for file in teamA/*.mjs; do
  node spectral-compare.js reference.mjs "$file" > "comparison-$(basename "$file").txt"
done
```

#### Key Features of the Enhanced Comparison Tool

- **Full MJS Support**: Dynamically loads and evaluates ES Modules
- **Custom Function Detection**: Identifies and reports JavaScript functions used for validation
- **Comprehensive Comparison**:
  - Rule presence/absence across rulesets
  - Severity differences
  - Target path differences (JSONPath expressions)
  - Implementation differences (function vs built-in validation)
- **Detailed Reporting**: Structured output of differences for easy analysis

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
