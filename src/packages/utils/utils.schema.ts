import type { ZodType, ZodError } from "zod";

// TYPES
interface ValidationSuccess<T> {
  success: true;

  data: T;
}

interface ValidationError {
  success: false;

  field: string;

  message: string;

  issues: ZodError["issues"];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

// VALIDATE SCHEMA
export const validateSchema = <TSchema extends ZodType>(
  schema: TSchema,

  data: unknown
): ValidationResult<ReturnType<TSchema["parse"]>> => {
  const validatedData = schema.safeParse(data);

  if (!validatedData.success) {
    const issue = validatedData.error.issues[0];

    return {
      success: false,

      field: issue?.path?.[0]?.toString() || "unknown",

      message: issue?.message || "Validation failed",

      issues: validatedData.error.issues,
    };
  }

  return {
    success: true,

    data: validatedData.data as ReturnType<TSchema["parse"]>,
  };
};
