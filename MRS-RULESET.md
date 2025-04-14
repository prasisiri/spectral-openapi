# JavaScript Module Rulesets (.mjs) for OpenAPI

This project uses JavaScript ES Modules (.mjs) format for enhanced OpenAPI validation.

## Benefits of the MJS Format

1. **Native JavaScript**: Full access to JavaScript features for complex validation logic
2. **ES Modules Support**: Modern import/export syntax for better organization
3. **IDE Support**: Better integration with editor extensions and TypeScript
4. **Dynamic Rules**: Complex logic can be implemented using JavaScript functions

## Using the MJS File

### In VS Code/Editor with Spectral Extension

1. Install the Stoplight Spectral extension
2. In settings, specify the ruleset file location as `spectral.mjs`
3. The extension will now use your custom rules for real-time validation

### Command Line

```bash
spectral lint openapi-spec/pet-store.yaml --ruleset spectral.mjs
```

### Spring Boot Integration

The Gradle build automatically:

1. Copies the MJS file to the resources directory
2. Uses it to validate your OpenAPI specifications during build
3. Fails the build if your API doesn't meet standards

## Customizing the Ruleset

To add or modify rules:

1. Edit the `spectral.mjs` file
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

For more information on the MJS format, see:

- [Spectral Documentation](https://meta.stoplight.io/docs/spectral)
- [JavaScript ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [JSON Schema for Rulesets](https://unpkg.com/@stoplight/spectral/dist/schemas/ruleset.schema.json)
