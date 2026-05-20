import type { Request, Response } from "express";
import { AppError, asyncHandler } from "../../../../packages/utils/utils.handler";
import { clearAuthCookies, setAuthCookies } from "../services/services.cookies";

import {
  registerUser,
  loginUser,
  logoutUser,
  logoutAllUserSessions,
  refreshUserAccessToken,
  verifyUserEmail,
  resendVerification,
  forgotUserPassword,
  resetUserPassword,
  updateUserProfile,
  updateUserCurrentPassword,
  deleteUserAccount,
  getUserSessions,
  revokeUserSession,
} from "../services/services.auth";

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

// LOGOUT ALL SESSIONS
export const logoutAllSessions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await logoutAllUserSessions(req.user.id);

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  }
);

// REFRESH ACCESS TOKEN
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const tokens = await refreshUserAccessToken(refreshToken);

    setAuthCookies({
      res,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  }
);

// GET CURRENT USER
export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// EMAIL VERIFICATION FLOW
export const verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.params.token;

  await verifyUserEmail(token as string);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await resendVerification(req.user.id);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  }
);

// PASSWORD RECOVERY
export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await forgotUserPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: "If account exists, password reset email sent",
  });
});

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.params.token;

  await resetUserPassword({
    token: token as string,
    password: req.body.password,
  });

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

// UPDATE PROFILE
export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await updateUserProfile({
    userId: req.user.id,
    data: req.body,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated",
    user,
  });
});

// CHANGE PASSWORD
export const changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await updateUserCurrentPassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// DELETE ACCOUNT
export const deleteAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await deleteUserAccount(req.user.id);

  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

// SESSION MANAGEMENT
export const getSessions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const sessions = await getUserSessions(req.user.id);

  res.status(200).json({
    success: true,
    sessions,
  });
});

export const revokeSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await revokeUserSession({
    userId: req.user.id,
    sessionId: req.params.session_id as string,
  });

  res.status(200).json({
    success: true,
    message: "Session revoked successfully",
  });
});
