# Creating Custom Spectral Rules for OpenAPI

This guide explains how to create custom linting rules with Spectral for OpenAPI specifications.

## Basic Rule Structure

Each rule in Spectral has this basic structure:

```yaml
rule-name:
  description: Human-readable description of the rule
  severity: error | warning | info | hint
  given: JSONPath expression that selects what to validate
  then:
    function: Function name to use for validation
    functionOptions:
      # Options specific to the function
```

## Common Validation Functions

1. **`truthy`**: Ensures a value exists and is not falsy
2. **`pattern`**: Validates against a regex pattern
3. **`enumeration`**: Ensures value is one of a set of allowed values
4. **`schema`**: Validates against a JSON Schema
5. **`casing`**: Checks string casing (camel, pascal, kebab, etc.)

## Example Rules

### 1. Enforcing Kebab-Case for Paths

```yaml
path-kebab-case:
  description: Path segments must use kebab-case
  severity: error
  given: $.paths.*~
  then:
    function: pattern
    functionOptions:
      match: ^(/[a-z0-9-]+)+$
```

### 2. Requiring Description for Operations

```yaml
operation-description:
  description: Operation must have a description
  severity: error
  given: $.paths.*[?(@.get || @.put || @.post || @.delete)]
  then:
    field: description
    function: truthy
```

## Creating Function Rules

For more complex validations, you can create custom JavaScript functions:

1. Create a `.spectral.js` file:

```javascript
const { ruleset } = require('@stoplight/spectral-core');
const { oas } = require('@stoplight/spectral-rulesets');

module.exports = ruleset({
  extends: [[oas, 'recommended']],
  rules: {
    'custom-rule': {
      description: 'My custom validation',
      severity: 'error',
      given: '$.paths.*',
      then: {
        function: myCustomFunction
      }
    }
  },
  functions: {
    myCustomFunction(targetVal, options, context) {
      // Custom validation logic here
      if (someCondition) {
        return [
          {
            message: 'Error message',
            path: [...context.path]
          }
        ];
      }
      return []; // No errors
    }
  }
});
```

## Targeting Elements with JSONPath

- `$.paths.*~`: Selects all path keys
- `$.paths.*`: Selects all path objects
- `$.paths.*[?(@.get)]`: Selects path objects that have a GET operation
- `$.components.schemas.*`: Selects all schema objects

## Best Practices

1. **Write clear error messages**: Make it obvious what the issue is and how to fix it
2. **Use appropriate severity levels**:
   - `error`: Must be fixed
   - `warning`: Should be fixed
   - `info`: Suggestion
   - `hint`: Best practice
3. **Target precisely**: Use specific JSONPath expressions
4. **Document rules**: Explain the rationale behind each rule

## Testing Rules

Create test files that should pass and fail:

```bash
# Test your rules
spectral lint --ruleset .spectral.yaml test-pass.yaml
spectral lint --ruleset .spectral.yaml test-fail.yaml
```

## Additional Resources

- [Spectral Documentation](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-welcome)
- [JSONPath Reference](https://goessner.net/articles/JsonPath/)
- [OpenAPI Specification](https://swagger.io/specification/) 