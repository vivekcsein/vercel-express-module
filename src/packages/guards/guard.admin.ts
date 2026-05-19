import type { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/utils.handler";

// ADMIN GUARD
export const adminGuard = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (req.user.role !== "ADMIN") {
    return next(new AppError("Forbidden", 403));
  }

  next();
};
