import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  // 1. Handle Known Operational Application Errors (4xx)
  if (error instanceof AppError) {
    // Log server-side operational errors (5xx) if any exist, but skip logger.error for 4xx client errors
    if (error.statusCode >= 500) {
      logger.error("Operational server error", {
        method: req.method,
        url: req.originalUrl,
        requestId: res.getHeader("X-Request-ID"),
        error,
      });
    }

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // 2. Handle Zod Input Validation Failures (400)
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // 3. Log Unknown / Unexpected 500 Server Errors
  logger.error("Unhandled request error", {
    method: req.method,
    url: req.originalUrl,
    requestId: res.getHeader("X-Request-ID"),
    error,
  });

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};