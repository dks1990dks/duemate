import { Schema, model, type Model } from "mongoose";
import bcrypt from "bcryptjs";

import { authConfig } from "@/config/auth.js";

export type UserRole = "USER" | "ADMIN";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role:UserRole;

  isEmailVerified: boolean;
  isActive: boolean;

  failedLoginAttempts: number;

  lockUntil?: Date | undefined;

  lastLoginAt?: Date | undefined;

  emailVerificationTokenHash?: string | undefined;
  emailVerificationExpiresAt?: Date | undefined;

  passwordResetTokenHash?: string | undefined;
  passwordResetExpiresAt?: Date | undefined;

  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;

  isLocked(): boolean;

  registerFailedLoginAttempt(): void;

  resetLoginAttempts(): void;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[1-9]\d{7,14}$/,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      required: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },

    lastLoginAt: {
      type: Date,
    },

    emailVerificationTokenHash: {
      type: String,
      select: false,
    },

    emailVerificationExpiresAt: {
      type: Date,
      select: false,
    },

    passwordResetTokenHash: {
      type: String,
      select: false,
    },

    passwordResetExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.isLocked = function (): boolean {
  return Boolean(this.lockUntil && this.lockUntil > new Date());
};

userSchema.methods.registerFailedLoginAttempt = function (): void {
  const now = new Date();

  // Previous lock period has expired.
  if (this.lockUntil && this.lockUntil <= now) {
    this.failedLoginAttempts = 0;
    this.lockUntil = undefined;
  }

  this.failedLoginAttempts += 1;

  if (this.failedLoginAttempts >= authConfig.maxLoginAttempts) {
    this.lockUntil = new Date(
      Date.now() + authConfig.loginLockMinutes * 60 * 1000,
    );
  }
};

userSchema.methods.resetLoginAttempts = function (): void {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
};

export const User = model<IUser, UserModel>("User", userSchema);
