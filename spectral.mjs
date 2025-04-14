// Import Spectral functions
import { truthy, pattern } from "@stoplight/spectral-functions";

/**
 * Custom function to safely check version format
 * Handles undefined values and non-string types
 */
function safeVersionCheck(input, options, context) {
  // First check if version exists and is a string
  if (!input || typeof input !== "string") {
    return [
      {
        message:
          "API version must be a string in semantic versioning format (x.y.z)",
      },
    ];
  }

  // Then check if it matches the pattern
  const semverPattern = /^[0-9]+\.[0-9]+\.[0-9]+$/;
  if (!semverPattern.test(input)) {
    return [
      {
        message: "API version must follow semantic versioning format (x.y.z)",
      },
    ];
  }

  return [];
}

/**
 * Custom function to safely check URL version
 * Handles undefined values and non-string types
 */
function safeUrlVersionCheck(input, options, context) {
  // First check if URL exists and is a string
  if (!input || typeof input !== "string") {
    return [
      {
        message:
          "Server URL must be a string that includes API version (v1, v2, etc.)",
      },
    ];
  }

  // Then check if it includes a version
  const versionPattern = /v[0-9]+/;
  if (!versionPattern.test(input)) {
    return [
      {
        message: "Server URL must include API version (e.g., v1, v2)",
      },
    ];
  }

  return [];
}

/**
 * Spectral ruleset for OpenAPI validation
 * Using ES Module format for better extensibility
 */
export default {
  extends: "spectral:oas",
  rules: {
    // Enforce consistent naming for paths
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

    // Enforce description for all operations
    "operation-description": {
      description: "Operation must have a description",
      severity: "error",
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "description",
        function: truthy,
      },
    },

    // Enforce tags for all operations
    "operation-tags": {
      description: "Operation must have tags",
      severity: "error",
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "tags",
        function: truthy,
      },
    },

    // Ensure operation IDs are unique and properly formatted
    "operation-operationId": {
      description: "Operation must have a properly formatted operationId",
      severity: "error",
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "operationId",
        function: pattern,
        functionOptions: {
          match: "^[a-z][a-zA-Z0-9]+$",
        },
      },
    },

    // Enforce response examples
    "response-examples": {
      description: "Response objects must have examples",
      severity: "warn",
      given: "$.paths.*.*.responses.*.content.*",
      then: {
        field: "examples",
        function: truthy,
      },
    },

    // Enforce proper versioning in the servers URL with safer checking
    "servers-url-version": {
      description: "Servers URL should include API version",
      severity: "error",
      given: "$.servers[*].url",
      then: {
        function: safeUrlVersionCheck,
      },
    },

    // Enforce version format in info object with safer checking
    "api-version-format": {
      description: "API version must be in semantic versioning format",
      severity: "error",
      given: "$.info.version",
      then: {
        function: safeVersionCheck,
      },
    },
  },
};
