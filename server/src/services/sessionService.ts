import { Types } from "mongoose";
import { authConfig } from "../config/auth.js";
import { Session } from "../models/Session.js";
import { hashToken } from "../utils/crypto.js";

interface CreateSessionInput {
  userId: string;
  userAgent?: string | undefined;
  ipAddress?: string | undefined;
}

export const createSession = async (input: CreateSessionInput) => {
  const expiresAt = new Date(
    Date.now() + authConfig.sessionMaxAgeDays * 24 * 60 * 60 * 1000
  );

  const session = await Session.create({
    userId: new Types.ObjectId(input.userId),
    refreshTokenHash: "PENDING",
    ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
    expiresAt,
  });

  return session;
};

export const setSessionRefreshToken = async (
  sessionId: string,
  refreshToken: string
) => {
  const refreshTokenHash = hashToken(refreshToken);

  await Session.findByIdAndUpdate(sessionId, {
    refreshTokenHash,
  });
};

export const getSessionById = async (sessionId: string) => {
  return Session.findById(sessionId).select("+refreshTokenHash");
};

export const isSessionRefreshTokenValid = (
  refreshToken: string,
  sessionRefreshTokenHash: string
): boolean => {
  return hashToken(refreshToken) === sessionRefreshTokenHash;
};

export const rotateSessionRefreshToken = async (
  sessionId: string,
  newRefreshToken: string
) => {
  const refreshTokenHash = hashToken(newRefreshToken);

  return Session.findOneAndUpdate(
    {
      _id: sessionId,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    },
    {
      refreshTokenHash,
    },
    {
      returnDocument: "after",
    }
  );
};

export const revokeSession = async (sessionId: string) => {
  await Session.findOneAndUpdate(
    {
      _id: sessionId,
      revokedAt: { $exists: false },
    },
    {
      revokedAt: new Date(),
    }
  );
};

export const revokeAllUserSessions = async (
  userId: string
) => {
  return Session.updateMany(
    {
      userId,
      revokedAt: { $exists: false },
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );
};