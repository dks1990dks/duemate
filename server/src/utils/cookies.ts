import type { Response } from "express";
import { authConfig } from "../config/auth.js";
import { env } from "../config/env.js";

const isProduction = env.nodeEnv === "production";

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: authConfig.accessTokenMaxAgeMs,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: authConfig.refreshTokenMaxAgeMs,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
};