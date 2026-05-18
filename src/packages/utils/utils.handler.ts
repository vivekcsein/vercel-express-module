import type * as express from "express";
import { sendErrorResponse } from "./utils.response";

// APP ERROR CLASS
export class AppError extends Error {
  public readonly statusCode: number;

  public readonly isOperational: boolean;

  public readonly details?: unknown;

  constructor(
    message: string,

    statusCode = 500,

    isOperational = true,

    details?: unknown
  ) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;

    this.isOperational = isOperational;

    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// NOT FOUND HANDLER
export const notFoundHandler = (req: express.Request, res: express.Response): express.Response => {
  return sendErrorResponse(res, 404, `Route ${req.originalUrl} not found`);
};

// ERROR HANDLER
export const errorHandler = (
  error: unknown,

  req: express.Request,

  res: express.Response,

  _next: express.NextFunction
): express.Response => {
  // ENVIRONMENT CHECK
  const isDevelopment = process.env.NODE_ENV === "development";

  // DEFAULT VALUES
  let statusCode = 500;

  let message = "Internal server error";

  let details: unknown;

  // APP ERROR INSTANCE
  if (error instanceof AppError) {
    statusCode = error.statusCode;

    message = error.message;

    details = error.details;
  }

  // STANDARD ERROR
  else if (error instanceof Error) {
    message = error.message;
  }

  //  KNOWN ERROR OVERRIDES
  if (error instanceof Error) {
    switch (error.name) {
      case "JsonWebTokenError":
        statusCode = 401;

        message = "Invalid token";

        break;

      case "TokenExpiredError":
        statusCode = 401;

        message = "Token expired";

        break;

      case "ZodError":
        statusCode = 400;

        message = "Validation failed";

        break;

      case "SequelizeValidationError":
        statusCode = 400;

        message = "Validation error";

        break;

      case "SequelizeUniqueConstraintError":
        statusCode = 409;

        message = "Resource already exists";

        break;
    }
  }

  // LOGGING OF ERROR DETAILS
  console.error({
    success: false,

    statusCode,

    message,

    method: req.method,

    path: req.originalUrl,

    timestamp: new Date().toISOString(),

    stack: isDevelopment && error instanceof Error ? error.stack : undefined,
  });

  // RESPONSE SENT TO CLIENT
  return res.status(statusCode).json({
    success: false,

    message,

    ...(typeof details !== "undefined" ? { details } : {}),

    ...(isDevelopment && error instanceof Error
      ? {
          stack: error.stack,

          error: error.name,
        }
      : {}),
  });
};

// ASYNC HANDLER WRAPPER
type AsyncHandlerFunction = (
  req: express.Request,

  res: express.Response,

  next: express.NextFunction
) => Promise<unknown>;

export const asyncHandler = (fn: AsyncHandlerFunction) => {
  return (
    req: express.Request,

    res: express.Response,

    next: express.NextFunction
  ): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// PROVIDER ASYNC HANDLER
export const asyncProvider = async <T>(
  callback: () => Promise<T>,
  errorMessage = "Internal provider error",
  statusCode = 500
): Promise<T> => {
  try {
    return await callback();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorMessage, statusCode, error as boolean);
  }
};
