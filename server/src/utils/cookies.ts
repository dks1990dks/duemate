import type { Response } from "express";

import { authConfig } from "../config/auth.js";
import { env } from "../config/env.js";

const isProduction = env.nodeEnv === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: authConfig.accessTokenMaxAgeMs,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: authConfig.refreshTokenMaxAgeMs,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};