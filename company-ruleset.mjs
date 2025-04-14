import { truthy, pattern, schema } from "@stoplight/spectral-functions";

/**
 * Company-specific OpenAPI ruleset
 * Contains enhanced rules with custom validations
 */
export default {
  extends: ["spectral:oas"],
  rules: {
    // Rules that match the standard ruleset but with some differences
    "path-kebab-case": {
      description: "Path segments must use kebab-case",
      severity: "error", // Same severity
      given: "$.paths.*~",
      then: {
        function: pattern,
        functionOptions: {
          match: "^(\\/[a-z0-9-]+|\\/\\{[a-zA-Z0-9]+\\})+$",
        },
      },
    },
    "operation-description": {
      description:
        "Operation must include a detailed description with purpose and usage",
      severity: "error", // Same severity, different description
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "description",
        function: truthy,
      },
    },
    "operation-tags": {
      description: "Operation must have tags for categorization",
      severity: "warn", // Different severity (warn instead of error)
      given: "$.paths.*[?(@.get || @.put || @.post || @.delete)]",
      then: {
        field: "tags",
        function: truthy,
      },
    },
    "response-examples": {
      description: "Response objects must have examples",
      severity: "error", // Different severity (error instead of warn)
      given: "$.paths.*.*.responses.*.content.*",
      then: {
        field: "examples",
        function: truthy,
      },
    },

    // Additional company-specific rules not in the standard ruleset
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
    "x-company-owner": {
      description: "API must specify the business owner",
      severity: "error",
      given: "$.info",
      then: {
        field: "x-company-owner",
        function: truthy,
      },
    },
    "servers-url-version": {
      description: "Servers URL should include API version",
      severity: "error",
      given: "$.servers[*].url",
      then: {
        function: pattern,
        functionOptions: {
          match: "v[0-9]+",
        },
      },
    },

    // Custom JavaScript function for complex validation
    "no-excessive-nesting": {
      description: "Prevents excessive nesting in schemas (>3 levels)",
      severity: "warn",
      given: "$.components.schemas.*",
      then: {
        function: checkNesting,
      },
    },

    // Custom JavaScript function for required fields
    "mandatory-fields-validation": {
      description: "Ensures all mandatory company fields are present",
      severity: "error",
      given: "$.components.schemas.*",
      then: {
        function: checkMandatoryFields,
      },
    },
  },
};

/**
 * Custom function to check for excessive nesting in schemas
 */
function checkNesting(schema, _options, context) {
  const issues = [];
  const maxDepth = 3;

  function findNestedObjects(obj, currentPath = [], depth = 0) {
    if (depth > maxDepth && obj.type === "object" && obj.properties) {
      issues.push({
        message: `Schema has excessive nesting (>${maxDepth} levels)`,
        path: [...context.path, ...currentPath],
      });
    }

    if (obj.properties) {
      for (const [propName, propValue] of Object.entries(obj.properties)) {
        findNestedObjects(
          propValue,
          [...currentPath, "properties", propName],
          depth + 1
        );
      }
    }

    if (obj.items) {
      findNestedObjects(obj.items, [...currentPath, "items"], depth);
    }
  }

  findNestedObjects(schema);
  return issues;
}

/**
 * Custom function to check for mandatory company-specific fields
 */
function checkMandatoryFields(schema, _options, context) {
  const issues = [];
  const mandatoryFields = ["id", "createdAt", "modifiedAt", "companyId"];

  if (schema.type === "object" && schema.properties) {
    for (const field of mandatoryFields) {
      if (!schema.properties[field]) {
        issues.push({
          message: `Schema is missing mandatory field: ${field}`,
          path: [...context.path],
        });
      }
    }
  }

  return issues;
}
