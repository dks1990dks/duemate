import { AppError } from "../../utils/AppError.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { createAccessToken, createRefreshToken } from "../../utils/jwt.js";
import { User } from "../../models/User.js";
import {
  createSession,
  setSessionRefreshToken,
} from "../../services/sessionService.js";
import type { AuthUser, LoginInput, RegisterInput, } from "./auth.types.js";

const sanitizeUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  isEmailVerified: boolean;
}): AuthUser => {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};

const normalizePhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (phone.startsWith("+")) {
    return phone;
  }

  throw new AppError("Invalid phone number", 400);
};

export const registerUser = async (
  input: RegisterInput,
  metadata?: { userAgent?: string; ipAddress?: string },
) => {
  const existingUser = await User.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const phone = normalizePhoneNumber(input.phone);

  const user = await User.create({
    name: input.name,
    email: input.email,
    phone,
    passwordHash,
  });

  const session = await createSession({
    userId: String(user._id),
    userAgent: metadata?.userAgent,
    ipAddress: metadata?.ipAddress,
  });

  const accessToken = createAccessToken(String(user._id));
  const refreshToken = createRefreshToken(
    String(user._id),
    String(session._id),
  );

  await setSessionRefreshToken(String(session._id), refreshToken);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (
  input: LoginInput,
  metadata?: { userAgent?: string; ipAddress?: string },
) => {
  const user = await User.findOne({
    email: input.email,
  }).select("+passwordHash");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("This account is inactive", 403);
  }

  const passwordValid = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const session = await createSession({
    userId: String(user._id),
    userAgent: metadata?.userAgent,
    ipAddress: metadata?.ipAddress,
  });

  const accessToken = createAccessToken(String(user._id));
  const refreshToken = createRefreshToken(
    String(user._id),
    String(session._id),
  );

  await setSessionRefreshToken(String(session._id), refreshToken);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

