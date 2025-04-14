# Multi Ruleset Specification (MRS) for OpenAPI

This project uses Spectral's Multi Ruleset Specification format (.mrs) for enhanced OpenAPI validation.

## Benefits of the MRS Format

1. **JSON Schema Validation**: The ruleset itself is validated against Spectral's schema
2. **Format Targeting**: Specifically targets OpenAPI 3.x specifications
3. **IDE Support**: Better integration with editor extensions
4. **Structured Format**: JSON format with clear organization

## Using the MRS File

### In VS Code/Editor with Spectral Extension

1. Install the Stoplight Spectral extension
2. In settings, specify the ruleset file location as `spectral.mrs`
3. The extension will now use your custom rules for real-time validation

### Command Line

```bash
spectral lint openapi-spec/pet-store.yaml --ruleset spectral.mrs
```

### Spring Boot Integration

The Gradle build automatically:
1. Copies the MRS file to the resources directory
2. Uses it to validate your OpenAPI specifications during build
3. Fails the build if your API doesn't meet standards

## Customizing the Ruleset

To add or modify rules:

1. Edit the `spectral.mrs` file
2. Each rule follows this structure:
   ```json
   "rule-name": {
     "description": "Human-readable description",
     "severity": "error | warn | info | hint",
     "given": "JSONPath selector",
     "then": {
       "function": "validation function",
       "functionOptions": { /* options */ }
     }
   }
   ```

## Documentation

For more information on the MRS format, see:
- [Spectral Documentation](https://meta.stoplight.io/docs/spectral)
- [JSON Schema for Rulesets](https://unpkg.com/@stoplight/spectral/dist/schemas/ruleset.schema.json) 