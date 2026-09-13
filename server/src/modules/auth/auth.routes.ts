import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateRequest } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  loginRateLimiter,
  passwordResetRateLimiter,
  refreshRateLimiter,
  registerRateLimiter,
  verificationRateLimiter,
} from "../../middleware/rateLimiter.js";
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.validator.js";

const router = Router();

router.post(
  "/register",
  registerRateLimiter,
  validateRequest(authSchema.registerSchema),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  loginRateLimiter,
  validateRequest(authSchema.loginSchema),
  asyncHandler(authController.login)
);

router.post("/logout", asyncHandler(authController.logout));

router.post(
  "/refresh",
  refreshRateLimiter,
  asyncHandler(authController.refresh)
);

router.get("/me", requireAuth, asyncHandler(authController.getMe));

router.get(
  "/verify-email",
  verificationRateLimiter,
  validateRequest(authSchema.verifyEmailSchema),
  asyncHandler(authController.verifyEmail)
);

router.post(
  "/resend-verification",
  verificationRateLimiter,
  validateRequest(authSchema.resendVerificationSchema),
  asyncHandler(authController.resendVerificationEmail)
);

router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  validateRequest(authSchema.forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);

router.post(
  "/reset-password",
  passwordResetRateLimiter,
  validateRequest(authSchema.resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);

export default router;