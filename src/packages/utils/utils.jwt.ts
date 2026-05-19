import { AppError } from "./utils.handler";
import { envAuthConfig } from "../env/env.auth";
import type { RequestUser } from "../../types/auth";
import { AUTH_MAILER_CONFIG } from "./utils.constant";

import jwt, {
  type Secret,
  type SignOptions,
  type JwtPayload as DefaultJwtPayload,
} from "jsonwebtoken";

// JWT PAYLOAD
export interface JwtPayload extends RequestUser, DefaultJwtPayload {}

// GENERATE TOKEN
export const generateToken = <T extends object>({
  payload,
  secret,
  options,
}: {
  payload: T;

  secret: Secret;

  options?: SignOptions;
}): string => {
  return jwt.sign(payload, secret, options);
};

// VERIFY TOKEN
export const verifyToken = <T = JwtPayload>({
  token,
  secret,
}: {
  token: string;

  secret: Secret;
}): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error: unknown) {
    throw new AppError("Invalid or expired token", 401, error as boolean);
  }
};

// DECODE TOKEN
export const decodeToken = <T = JwtPayload>(token: string): T | null => {
  return jwt.decode(token) as T | null;
};

// TOKEN EXPIRED
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken<DefaultJwtPayload>(token);

  if (!decoded?.exp) {
    return true;
  }

  return decoded.exp * 1000 < Date.now();
};

// GET TOKEN EXPIRY
export const getTokenExpiry = (token: string): number | null => {
  const decoded = decodeToken<DefaultJwtPayload>(token);

  if (!decoded?.exp) {
    return null;
  }

  return decoded.exp * 1000;
};

// GET SESSION TIMER
export const getSessionTimer = (
  token: string
): {
  expires_at: number | null;

  expires_in: number;
} => {
  const expiresAt = getTokenExpiry(token);

  if (!expiresAt) {
    return {
      expires_at: null,

      expires_in: 0,
    };
  }

  return {
    expires_at: expiresAt,

    expires_in: Math.max(0, expiresAt - Date.now()),
  };
};

// GENERATE ACCESS TOKEN
export const generateAccessToken = (payload: RequestUser): string => {
  return generateToken({
    payload,

    secret: envAuthConfig.JWT_ACCESS_SECRET as string,

    options: {
      expiresIn: envAuthConfig.ACCESS_TOKEN_EXPIRES_IN,
    },
  });
};

// GENERATE REFRESH TOKEN
export const generateRefreshToken = (payload: RequestUser): string => {
  return generateToken({
    payload,

    secret: envAuthConfig.JWT_REFRESH_SECRET as string,

    options: {
      expiresIn: envAuthConfig.REFRESH_TOKEN_EXPIRES_IN,
    },
  });
};

// GENERATE EMAIL VERIFICATION TOKEN
export const generateEmailVerificationToken = (payload: RequestUser): string => {
  return generateToken({
    payload,

    secret: envAuthConfig.JWT_EMAIL_VERIFICATION_SECRET,

    options: {
      expiresIn: AUTH_MAILER_CONFIG.EMAIL_VERIFICATION_EXPIRES_IN,
    },
  });
};

// GENERATE PASSWORD RESET TOKEN
export const generatePasswordResetToken = (payload: RequestUser): string => {
  return generateToken({
    payload,

    secret: envAuthConfig.JWT_PASSWORD_RESET_SECRET,

    options: {
      expiresIn: AUTH_MAILER_CONFIG.PASSWORD_RESET_EXPIRES_IN,
    },
  });
};

// VERIFY ACCESS TOKEN
export const verifyAccessToken = (token: string): RequestUser => {
  return verifyToken<RequestUser>({
    token,

    secret: envAuthConfig.JWT_ACCESS_SECRET,
  });
};

// VERIFY REFRESH TOKEN
export const verifyRefreshToken = (token: string): RequestUser => {
  return verifyToken<RequestUser>({
    token,

    secret: envAuthConfig.JWT_REFRESH_SECRET,
  });
};

// VERIFY EMAIL VERIFICATION TOKEN
export const verifyEmailVerificationToken = (token: string): RequestUser => {
  return verifyToken<RequestUser>({
    token,

    secret: envAuthConfig.JWT_EMAIL_VERIFICATION_SECRET,
  });
};

// VERIFY PASSWORD RESET TOKEN
export const verifyPasswordResetToken = (token: string): RequestUser => {
  return verifyToken<RequestUser>({
    token,

    secret: envAuthConfig.JWT_PASSWORD_RESET_SECRET,
  });
};
