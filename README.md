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

## Custom Rules Explanation

Explain the rationale behind each custom rule:

- **path-kebab-case**: Ensures consistent API URL structure
- **operation-description**: Makes API self-documenting
- **operation-tags**: Ensures proper API categorization
- **operation-operationId**: Enforces consistent naming for client code generation
- **response-examples**: Promotes better documentation and testing
- **servers-url-version**: Enforces proper API versioning
- **api-version-format**: Ensures semantic versioning for clearer release management 