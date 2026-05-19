import { RequestUser } from "../../types/auth";
import { envAuthConfig } from "../env/env.auth";
import { verifyToken } from "../utils/utils.jwt";
import { AppError } from "../utils/utils.handler";
import { ACCESS_TOKEN_CONFIG } from "../utils/utils.constant";
import type { Request, Response, NextFunction } from "express";

// AUTH GUARD
export const authGuard = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.[ACCESS_TOKEN_CONFIG.ACCESS_TOKEN_COOKIE];

    if (process.env.NODE_ENV === "development") {
      console.log("authGuard token is ", token);
    }

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    const decoded = verifyToken<RequestUser>({
      token,
      secret: envAuthConfig.JWT_ACCESS_SECRET,
    });

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
