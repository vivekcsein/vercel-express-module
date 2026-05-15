import type * as express from "express";

import type { ApiResponse, ErrorResponse, SuccessResponse } from "../../types/auth";

// SUCCESS RESPONSE
export const sendSuccessResponse = <T = unknown>(
  res: express.Response<SuccessResponse<T>>,

  statusCode: number,

  message: string,

  data?: T
): express.Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,

    message,

    data,
  });
};

// ERROR RESPONSE
export const sendErrorResponse = (
  res: express.Response<ErrorResponse>,

  statusCode: number,

  message: string,

  field?: string,

  issues?: unknown
): express.Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,

    message,

    field,

    issues,
  });
};

// GENERIC API RESPONSE
export const sendApiResponse = <T = unknown>(
  res: express.Response<ApiResponse<T>>,

  response: ApiResponse<T>,

  statusCode = 200
): express.Response<ApiResponse<T>> => {
  return res.status(statusCode).json(response);
};
