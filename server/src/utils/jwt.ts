import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.js";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  sub: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
  type: "refresh";
}

export const createAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, env.jwtAccessSecret, {
    expiresIn: authConfig.accessTokenExpiresIn,
  });
};

export const createRefreshToken = (
  userId: string,
  sessionId: string
): string => {
  return jwt.sign(
    {
      sub: userId,
      sid: sessionId,
      type: "refresh",
    },
    env.jwtRefreshSecret,
    {
      expiresIn: authConfig.refreshTokenExpiresIn,
    }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
};