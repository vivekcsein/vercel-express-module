import type { Request, Response } from "express";
import { AppError, asyncHandler } from "../../../../packages/utils/utils.handler";
import { clearAuthCookies, setAuthCookies } from "../services/services.cookies";

import { registerUser, loginUser, logoutUser } from "../services/services.auth";

// HEALTH CHECK
export const healthCheck = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "Auth services are working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// SIGNUP
export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await registerUser(req.body);

  setAuthCookies({
    res,
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: result.user,
    session: result.session,
  });
});

// SIGNIN
export const signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body);

  setAuthCookies({
    res,
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: result.user,
    session: result.session,
  });
});

// LOGOUT
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await logoutUser({
    refreshToken: req.cookies.refreshToken,
  });

  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
