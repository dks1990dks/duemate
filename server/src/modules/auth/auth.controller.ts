import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { logAuditEvent } from "../../utils/auditLogger.js";
import { generateRandomToken, hashToken } from "../../utils/crypto.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../utils/emailService.js";
import { authConfig } from "../../config/auth.js";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookies.js";
import { getRequestMetadata } from "../../utils/requestMeta.js";
import {
  createSession,
  setSessionRefreshToken,
  getSessionById,
  isSessionRefreshTokenValid,
  rotateSessionRefreshToken,
  revokeSession,
  revokeAllUserSessions,
} from "../../services/sessionService.js";

// Registration
export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email is already registered", 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const rawToken = generateRandomToken();
  const emailVerificationTokenHash = hashToken(rawToken);
  const emailVerificationExpiresAt = new Date(
    Date.now() + authConfig.emailVerificationHours * 60 * 60 * 1000,
  );
  const digits = phone.replace(/\D/g, "");

  let normalizedPhone: string;

  if (digits.length === 10) {
    normalizedPhone = `+91${digits}`;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    normalizedPhone = `+${digits}`;
  } else {
    throw new AppError("Invalid phone number", 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone: normalizedPhone,
    passwordHash,
    emailVerificationTokenHash,
    emailVerificationExpiresAt,
  });

  await sendVerificationEmail(user.email, rawToken);

  await logAuditEvent({ userId: user._id, action: "REGISTER", req });

  return res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+passwordHash");

  // 1. User not found check
  if (!user) {
    await logAuditEvent({
      action: "LOGIN_FAILED",
      req,
      metadata: {
        email: email.toLowerCase(),
        reason: "USER_NOT_FOUND",
      },
    });

    throw new AppError("Invalid email or password", 401);
  }

  // 2. Account active check
  if (!user.isActive) {
    await logAuditEvent({
      userId: user._id,
      action: "LOGIN_FAILED",
      req,
      metadata: {
        reason: "ACCOUNT_INACTIVE",
      },
    });

    throw new AppError("Invalid email or password", 401);
  }

  // 3. Lockout check
  if (user.isLocked()) {
    await logAuditEvent({
      userId: user._id,
      action: "LOGIN_FAILED",
      req,
      metadata: {
        reason: "ACCOUNT_LOCKED",
      },
    });

    throw new AppError(
      "Too many failed login attempts. Please try again later.",
      429,
    );
  }

  // 4. Password validation
  const passwordValid = await user.comparePassword(password);

  if (!passwordValid) {
    user.registerFailedLoginAttempt();
    await user.save();

    await logAuditEvent({
      userId: user._id,
      action: "LOGIN_FAILED",
      req,
      metadata: {
        reason: "INVALID_PASSWORD",
        failedLoginAttempts: user.failedLoginAttempts,
      },
    });

    throw new AppError("Invalid email or password", 401);
  }

  // 5. Email verification check
  if (!user.isEmailVerified) {
    await logAuditEvent({
      userId: user._id,
      action: "LOGIN_FAILED",
      req,
      metadata: {
        reason: "EMAIL_NOT_VERIFIED",
      },
    });

    return res.status(403).json({
      success: false,
      message: "Please verify your email address before signing in.",
      data: {
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      },
    });
  }

  // 6. Successful login
  user.resetLoginAttempts();
  user.lastLoginAt = new Date();
  await user.save();

  await logAuditEvent({
    userId: user._id,
    action: "LOGIN_SUCCESS",
    req,
  });

  const metadata = getRequestMetadata(req);

  const session = await createSession({
    userId: String(user._id),
    ...metadata,
  });

  const accessToken = createAccessToken(String(user._id));

  const refreshToken = createRefreshToken(
    String(user._id),
    String(session._id),
  );

  await setSessionRefreshToken(String(session._id), refreshToken);

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
};

// Logout
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);

      if (payload.type === "refresh" && payload.sid) {
        await revokeSession(payload.sid);
      }
    } catch {
      // Clear cookies even if token verification fails or is expired
    }
  }

  if (req.user?.id) {
    await logAuditEvent({
      userId: req.user.id,
      action: "LOGOUT",
      req,
    });
  }

  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};

// Refresh
export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    clearAuthCookies(res);

    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (payload.type !== "refresh" || !payload.sub || !payload.sid) {
    clearAuthCookies(res);

    throw new AppError("Invalid refresh token", 401);
  }

  const session = await getSessionById(payload.sid);

  if (!session) {
    clearAuthCookies(res);

    throw new AppError("Session not found", 401);
  }

  if (String(session.userId) !== String(payload.sub)) {
    await revokeSession(String(session._id));

    clearAuthCookies(res);

    throw new AppError("Invalid session", 401);
  }

  if (!session.isActive()) {
    clearAuthCookies(res);

    throw new AppError("Session expired or revoked", 401);
  }

  const tokenIsValid = isSessionRefreshTokenValid(
    refreshToken,
    session.refreshTokenHash,
  );

  if (!tokenIsValid) {
    // Possible refresh-token reuse.
    await revokeSession(String(session._id));

    clearAuthCookies(res);

    throw new AppError("Invalid refresh session", 401);
  }

  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    await revokeSession(String(session._id));

    clearAuthCookies(res);

    throw new AppError("User account unavailable", 401);
  }

  const newAccessToken = createAccessToken(String(user._id));

  const newRefreshToken = createRefreshToken(
    String(user._id),
    String(session._id),
  );

  const rotatedSession = await rotateSessionRefreshToken(
    String(session._id),
    newRefreshToken,
  );

  if (!rotatedSession) {
    clearAuthCookies(res);

    throw new AppError("Session could not be refreshed", 401);
  }

  setAuthCookies(res, newAccessToken, newRefreshToken);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: null,
  });
};

// Get Current User
export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(
      "Unauthorized: User identifier missing from request",
      401,
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Authenticated user retrieved",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
};

// Update Current User
export const updateMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(
      "Unauthorized: User identifier missing from request",
      401,
    );
  }

  const { name, phone } = req.body;

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const rawPhone = typeof phone === "string" ? phone.trim() : "";

  if (trimmedName.length < 2) {
    throw new AppError("Name must be at least 2 characters", 400);
  }

  if (trimmedName.length > 100) {
    throw new AppError("Name cannot exceed 100 characters", 400);
  }

  const digits = rawPhone.replace(/\D/g, "");

  let normalizedPhone: string;

  if (digits.length === 10) {
    normalizedPhone = `+91${digits}`;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    normalizedPhone = `+${digits}`;
  } else if (
    rawPhone.startsWith("+") &&
    digits.length >= 8 &&
    digits.length <= 15
  ) {
    normalizedPhone = rawPhone;
  } else {
    throw new AppError("Invalid phone number", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("This account is inactive", 403);
  }

  user.name = trimmedName;
  user.phone = normalizedPhone;

  await user.save();

  await logAuditEvent({
    userId: user._id,
    action: "PROFILE_UPDATED",
    req,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationTokenHash: hashedToken,
    emailVerificationExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: "Email is already verified",
      data: null,
    });
  }

  user.isEmailVerified = true;
  user.set("emailVerificationTokenHash", undefined);
  user.set("emailVerificationExpiresAt", undefined);

  await user.save();

  await logAuditEvent({ userId: user._id, action: "EMAIL_VERIFIED", req });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: null,
  });
};

// Resend Verification Email
export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  const genericMessage =
    "If an account exists with that email, a verification link has been sent.";

  if (!user || user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: genericMessage,
      data: null,
    });
  }

  const rawToken = generateRandomToken();
  user.emailVerificationTokenHash = hashToken(rawToken);
  user.emailVerificationExpiresAt = new Date(
    Date.now() + authConfig.emailVerificationHours * 60 * 60 * 1000,
  );

  await user.save();
  await sendVerificationEmail(user.email, rawToken);

  await logAuditEvent({
    userId: user._id,
    action: "EMAIL_VERIFICATION_SENT",
    req,
  });

  return res.status(200).json({
    success: true,
    message: genericMessage,
    data: null,
  });
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const genericMessage =
    "If an account exists with that email, a password reset link has been sent.";

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: genericMessage,
      data: null,
    });
  }

  const rawToken = generateRandomToken();

  user.passwordResetTokenHash = hashToken(rawToken);
  user.passwordResetExpiresAt = new Date(
    Date.now() + authConfig.passwordResetMinutes * 60 * 1000,
  );

  await user.save();

  await sendPasswordResetEmail(user.email, rawToken);

  await logAuditEvent({
    userId: user._id,
    action: "PASSWORD_RESET_REQUEST",
    req,
  });

  return res.status(200).json({
    success: true,
    message: genericMessage,
    data: null,
  });
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: hashedToken,
    passwordResetExpiresAt: {
      $gt: new Date(),
    },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired password reset token.",
      data: null,
    });
  }

  user.passwordHash = await bcrypt.hash(password, 12);

  // Invalidate reset token (single-use)
  user.set("passwordResetTokenHash", undefined);
  user.set("passwordResetExpiresAt", undefined);

  // Reset login protection counters
  user.failedLoginAttempts = 0;
  user.set("lockUntil", undefined);

  await user.save();

  // Security: revoke all active sessions.
  // Every previously logged-in device must authenticate again.
  await revokeAllUserSessions(String(user._id));

  await logAuditEvent({
    userId: user._id,
    action: "PASSWORD_RESET_SUCCESS",
    req,
  });

  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message:
      "Password reset successful. Please log in again with your new password.",
    data: null,
  });
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(
      "Unauthorized: User identifier missing from request",
      401,
    );
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("This account is inactive", 403);
  }

  const currentPasswordValid = await user.comparePassword(currentPassword);

  if (!currentPasswordValid) {
    await logAuditEvent({
      userId: user._id,
      action: "PASSWORD_CHANGE_FAILED",
      req,
      metadata: {
        reason: "INVALID_CURRENT_PASSWORD",
      },
    });

    throw new AppError("Current password is incorrect", 400);
  }

  const samePassword = await bcrypt.compare(
    newPassword,
    user.passwordHash,
  );

  if (samePassword) {
    throw new AppError(
      "New password must be different from your current password",
      400,
    );
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);

  user.failedLoginAttempts = 0;
  user.set("lockUntil", undefined);

  await user.save();

  // Security: revoke all active sessions.
  // The user must log in again on every device.
  await revokeAllUserSessions(String(user._id));

  await logAuditEvent({
    userId: user._id,
    action: "PASSWORD_CHANGE_SUCCESS",
    req,
  });

  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message:
      "Password changed successfully. Please log in again with your new password.",
    data: null,
  });
};