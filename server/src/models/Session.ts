import { Schema, model, type Model, Types } from "mongoose";

export interface ISession {
  userId: Types.ObjectId;
  refreshTokenHash: string;

  family?: string | undefined;

  userAgent?: string | undefined;
  ipAddress?: string | undefined;

  expiresAt: Date;

  revokedAt?: Date | undefined;

  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface ISessionMethods {
  isRevoked(): boolean;
  isExpired(): boolean;
  isActive(): boolean;
}

export type SessionModel = Model<ISession, {}, ISessionMethods>;

const sessionSchema = new Schema<ISession, SessionModel, ISessionMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      select: false, // Prevents hash leakage in standard database queries
    },
    family: {
      type: String,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL index for automatic cleanup
    },
    revokedAt: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
);

sessionSchema.methods.isRevoked = function (): boolean {
  return Boolean(this.revokedAt);
};

sessionSchema.methods.isExpired = function (): boolean {
  return this.expiresAt <= new Date();
};

sessionSchema.methods.isActive = function (): boolean {
  return !this.isRevoked() && !this.isExpired();
};

export const Session = model<ISession, SessionModel>("Session", sessionSchema);