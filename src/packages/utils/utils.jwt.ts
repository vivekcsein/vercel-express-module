import { RequestUser } from "../../types/auth";
import { AppError } from "./utils.handler";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

// TYPES
export type JwtPayload = RequestUser;

interface GenerateTokenParams<T> {
  payload: T;
  secret: Secret;
  options?: SignOptions;
}

interface VerifyTokenParams {
  token: string;
  secret: Secret;
}

// GENERATE TOKEN
export const generateToken = <T extends object>({
  payload,
  secret,
  options,
}: GenerateTokenParams<T>): string => {
  return jwt.sign(payload, secret, options);
};

// VERIFY TOKEN
export const verifyToken = <T = JwtPayload>({ token, secret }: VerifyTokenParams): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};

// DECODE TOKEN
export const decodeToken = <T = JwtPayload>(token: string): T | null => {
  return jwt.decode(token) as T | null;
};

// TOKEN EXPIRED
export const isTokenExpired = (token: string): boolean => {
  const decoded = jwt.decode(token) as {
    exp?: number;
  } | null;

  if (!decoded?.exp) {
    return true;
  }

  return decoded.exp * 1000 < Date.now();
};
