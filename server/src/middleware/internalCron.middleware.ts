import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export const requireInternalCronSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const providedSecret = req.header("x-internal-cron-secret");

  if (!providedSecret || providedSecret !== env.internalCronSecret) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  next();
};