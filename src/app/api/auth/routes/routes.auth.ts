import { Router } from "express";

import { authGuard } from "../../../../packages/guards/guard.auth";
import { adminGuard } from "../../../../packages/guards/guard.admin";
// import { verifiedGuard } from "../../../../packages/guards/guard.verified";

import {
  healthCheck,
  signup,
  signin,
  logout,
  logoutAllSessions,
  refreshAccessToken,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  deleteAccount,
  getSessions,
  revokeSession,
} from "../controllers/controllers.auth";

const authRoutes: Router = Router();

//  HEALTH CHECK
authRoutes.get("/health", healthCheck);

// PUBLIC AUTH ROUTES

// Register new account
authRoutes.post("/signup", signup);

// Login
authRoutes.post("/signin", signin);

// // Refresh JWT access token
authRoutes.post("/refresh", refreshAccessToken);

// Logout current session
authRoutes.post("/logout", authGuard, logout);

// Logout from all devices/sessions
authRoutes.post("/logout-all", authGuard, logoutAllSessions);

// // EMAIL VERIFICATION FLOW

// // Verify email token
authRoutes.get("/verify-email/:token", verifyEmail);

// // Resend verification email
authRoutes.post("/resend-verification", authGuard, resendVerificationEmail);

// PASSWORD RECOVERY

// Request reset password email
authRoutes.post("/forgot-password", forgotPassword);

// Reset password using token
authRoutes.post("/reset-password/:token", resetPassword);

// PROTECTED USER ROUTES (require authentication)

// Get current logged-in user
authRoutes.get("/me", authGuard, getCurrentUser);

// Update own profile
authRoutes.patch("/profile", authGuard, updateProfile);

// Change password
authRoutes.patch("/change-password", authGuard, changePassword);

// Delete own account
authRoutes.delete("/delete-account", authGuard, deleteAccount);

// TWO FACTOR AUTH

// Enable 2FA
// authRoutes.post("/2fa/enable", authGuard, verifiedGuard, enableTwoFactor);

// // Verify 2FA setup/login
// authRoutes.post("/2fa/verify", authGuard, verifyTwoFactor);

// // Disable 2FA
// authRoutes.post("/2fa/disable", authGuard, verifiedGuard, disableTwoFactor);

// SESSION MANAGEMENT

// Get all active sessions/devices
authRoutes.get("/sessions", authGuard, getSessions);

// // Revoke a specific session/device
authRoutes.delete("/sessions/:sessionId", authGuard, revokeSession);

// OAUTH LOGIN

// // Google OAuth
// authRoutes.get("/oauth/google", oauthGoogle);

// // Google OAuth callback
// authRoutes.get("/oauth/google/callback", oauthGoogleCallback);

// ADMIN AUTH ROUTES (require admin role)
authRoutes.get("/admin/users", authGuard, adminGuard, (_req, res) => {
  res.json({
    success: true,
    message: "Admin route - WIP",
  });
});

export default authRoutes;
