import { truthy, pattern } from "@stoplight/spectral-functions";

/**
 * Standard OpenAPI ruleset
 * Contains common validation rules for API specifications
 */
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
    "operation-description": {
      description: "Operation must have a description",
      severity: "error",
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "description",
        function: truthy,
      },
    },
    "operation-tags": {
      description: "Operation must have tags",
      severity: "error",
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "tags",
        function: truthy,
      },
    },
    "response-examples": {
      description: "Response objects should have examples",
      severity: "warn",
      given: "$.paths.*.*.responses.*.content.*",
      then: {
        field: "examples",
        function: truthy,
      },
    },
    "api-version-format": {
      description: "API version must be in semantic versioning format",
      severity: "error",
      given: "$.info.version",
      then: {
        function: pattern,
        functionOptions: {
          match: "^[0-9]+\\.[0-9]+\\.[0-9]+$",
        },
      },
    },
  },
};
