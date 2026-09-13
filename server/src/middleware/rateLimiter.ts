import rateLimit from "express-rate-limit";

const createRateLimitMessage = (message: string) => ({
  success: false,
  message,
  data: null,
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: createRateLimitMessage(
    "Too many login attempts. Please try again later."
  ),
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: createRateLimitMessage(
    "Too many account creation attempts. Please try again later."
  ),
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: createRateLimitMessage(
    "Too many password reset requests. Please try again later."
  ),
});

export const verificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: createRateLimitMessage(
    "Too many verification requests. Please try again later."
  ),
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: createRateLimitMessage(
    "Too many authentication refresh requests. Please try again later."
  ),
});