import { Request, Response, NextFunction } from "express";

import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const requireAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(
      new AppError("Authentication required", 401),
    );
  }

  try {
    const user = await User.findById(userId).select("role isActive");

    if (!user) {
      return next(
        new AppError("User not found", 404),
      );
    }

    if (!user.isActive) {
      return next(
        new AppError("This account is inactive", 403),
      );
    }

    if (user.role !== "ADMIN") {
      return next(
        new AppError("Admin access required", 403),
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
};