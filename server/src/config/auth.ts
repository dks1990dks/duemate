import { env } from "./env.js";

export const authConfig = {
  jwtAccessSecret: env.jwtAccessSecret,

  jwtRefreshSecret: env.jwtRefreshSecret,

  // Access token lifetime
  accessTokenExpiresIn: "250m" as const,

  // Refresh token lifetime
  refreshTokenExpiresIn: "30d" as const,

  // Cookie lifetime
  accessTokenMaxAgeMs: 15 * 60 * 1000,

  refreshTokenMaxAgeMs: 30 * 24 * 60 * 60 * 1000,

  sessionMaxAgeDays: 30,

  emailVerificationHours: 24,

  passwordResetMinutes: 15,

  maxLoginAttempts: 5,

  loginLockMinutes: 15,
};