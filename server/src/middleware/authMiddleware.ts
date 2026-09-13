import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { authConfig } from "../config/auth.js";

interface JwtPayload {
  sub?: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  // 1. Extract from HTTP-only cookie
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Fallback to Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.slice(7).trim();
  }

  if (!token) {
    return next(
      new AppError("Authentication required", 401),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      authConfig.jwtAccessSecret,
    ) as JwtPayload;

    if (
      typeof decoded.sub !== "string" ||
      decoded.sub.trim().length === 0
    ) {
      return next(
        new AppError("Invalid authentication token", 401),
      );
    }

    req.user = {
      id: decoded.sub,
    };

    return next();
  } catch (_error) {
    return next(
      new AppError("Invalid authentication token", 401),
    );
  }
};