import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/utils.handler";

// VERIFIED GUARD
export const verifiedGuard = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (!req.user.is_verified) {
    return next(new AppError("Email not verified", 403));
  }

  next();
};
