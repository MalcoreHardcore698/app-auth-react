import { z } from "zod";

import type { TFieldError, TFieldValues, TValidationRules } from "../types";

/**
 * Converts validation rules to Zod schema
 */
const createZodSchema = (rules: TValidationRules): z.ZodType<unknown> => {
  let schema: z.ZodType<unknown> = z.unknown();

  if (
    rules.minLength !== undefined ||
    rules.maxLength !== undefined ||
    rules.pattern !== undefined
  ) {
    schema = z.string();
  } else if (rules.min !== undefined || rules.max !== undefined) {
    schema = z.number();
  } else {
    schema = z.unknown();
  }

  if (rules.required) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(
        1,
        typeof rules.required === "string"
          ? rules.required
          : "This field is required"
      );
    } else if (schema instanceof z.ZodNumber) {
      schema = schema.refine((val) => val !== undefined && val !== null, {
        message:
          typeof rules.required === "string"
            ? rules.required
            : "This field is required",
      });
    } else {
      schema = schema.refine(
        (val) => {
          const isEmpty =
            val === undefined ||
            val === null ||
            val === "" ||
            (Array.isArray(val) && val.length === 0);

          return !isEmpty;
        },
        {
          message:
            typeof rules.required === "string"
              ? rules.required
              : "This field is required",
        }
      );
    }
  } else if (schema instanceof z.ZodString) {
    schema = schema.optional().or(z.literal(""));
  } else {
    schema = schema.optional();
  }

  // Min/Max validation for numbers
  if (rules.min !== undefined && schema instanceof z.ZodNumber) {
    const minRule =
      typeof rules.min === "number"
        ? { value: rules.min, message: `Minimum value is ${rules.min}` }
        : rules.min;

    schema = schema.min(minRule.value, minRule.message);
  }

  if (rules.max !== undefined && schema instanceof z.ZodNumber) {
    const maxRule =
      typeof rules.max === "number"
        ? { value: rules.max, message: `Maximum value is ${rules.max}` }
        : rules.max;

    schema = schema.max(maxRule.value, maxRule.message);
  }

  if (rules.minLength !== undefined && schema instanceof z.ZodString) {
    const minLengthRule =
      typeof rules.minLength === "number"
        ? {
            value: rules.minLength,
            message: `Minimum length is ${rules.minLength}`,
          }
        : rules.minLength;

    schema = schema.min(minLengthRule.value, minLengthRule.message);
  }

  if (rules.maxLength !== undefined && schema instanceof z.ZodString) {
    const maxLengthRule =
      typeof rules.maxLength === "number"
        ? {
            value: rules.maxLength,
            message: `Maximum length is ${rules.maxLength}`,
          }
        : rules.maxLength;

    schema = schema.max(maxLengthRule.value, maxLengthRule.message);
  }

  if (rules.pattern !== undefined && schema instanceof z.ZodString) {
    const patternRule =
      rules.pattern instanceof RegExp
        ? { value: rules.pattern, message: "Invalid format" }
        : rules.pattern;

    schema = schema.regex(patternRule.value, patternRule.message);
  }

  return schema;
};

/**
 * Validates a single field value against validation rules using Zod
 */
export const validateField = async (
  value: unknown,
  rules: TValidationRules,
  allValues: TFieldValues
): Promise<TFieldError | null> => {
  try {
    const zodSchema = createZodSchema(rules);

    await zodSchema.parseAsync(value);

    if (rules.validate) {
      const result = await rules.validate(value);

      if (typeof result === "string") {
        return { type: "validate", message: result };
      }

      if (result === false) {
        return { type: "validate", message: "Validation failed" };
      }
    }

    if (rules.custom) {
      const result = rules.custom(value, allValues);

      if (typeof result === "string") {
        return { type: "custom", message: result };
      }

      if (result === false) {
        return { type: "custom", message: "Validation failed" };
      }
    }

    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        type: firstError.code,
        message: firstError.message,
      };
    }

    return {
      type: "unknown",
      message: error instanceof Error ? error.message : "Validation failed",
    };
  }
};

/**
 * Validates all fields in the form using Zod
 */
export const validateForm = async (
  values: TFieldValues,
  validationRules: Record<string, TValidationRules>
): Promise<Record<string, TFieldError>> => {
  const errors: Record<string, TFieldError> = {};

  const validationPromises = Object.entries(validationRules).map(
    async ([fieldName, rules]) => {
      const error = await validateField(values[fieldName], rules, values);
      if (error) {
        errors[fieldName] = error;
      }
    }
  );

  await Promise.all(validationPromises);

  return errors;
};

/**
 * Creates a complete Zod schema for the entire form
 */
export const createFormSchema = (
  validationRules: Record<string, TValidationRules>
): z.ZodObject<Record<string, z.ZodType<unknown>>> => {
  const schemaFields: Record<string, z.ZodType<unknown>> = {};

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    schemaFields[fieldName] = createZodSchema(rules);
  }

  return z.object(schemaFields);
};

/**
 * Validates entire form using single Zod schema (more efficient for complex forms)
 */
export const validateFormWithSchema = async (
  values: TFieldValues,
  validationRules: Record<string, TValidationRules>
): Promise<Record<string, TFieldError>> => {
  try {
    const schema = createFormSchema(validationRules);
    await schema.parseAsync(values);

    const errors: Record<string, TFieldError> = {};

    for (const [fieldName, rules] of Object.entries(validationRules)) {
      if (rules.validate || rules.custom) {
        const error = await validateField(values[fieldName], rules, values);
        if (error && (error.type === "validate" || error.type === "custom")) {
          errors[fieldName] = error;
        }
      }
    }

    return errors;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, TFieldError> = {};

      for (const zodError of error.issues) {
        const fieldPath = zodError.path.join(".");
        if (!errors[fieldPath]) {
          errors[fieldPath] = {
            type: zodError.code,
            message: zodError.message,
          };
        }
      }

      return errors;
    }

    return {
      form: {
        type: "unknown",
        message: error instanceof Error ? error.message : "Validation failed",
      },
    };
  }
};

/**
 * Checks if form values are dirty (changed from initial values)
 */
export const getDirtyFields = <T extends TFieldValues>(
  currentValues: T,
  initialValues: T
): Record<keyof T, boolean> => {
  const dirtyFields = {} as Record<keyof T, boolean>;

  for (const key in currentValues) {
    dirtyFields[key as keyof T] = !isEqual(
      currentValues[key],
      initialValues[key]
    );
  }

  return dirtyFields;
};

/**
 * Deep equality check for values
 */
const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
};
