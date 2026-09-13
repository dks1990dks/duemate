import { Request } from "express";
import { Types } from "mongoose";
import { AuditLog } from "../models/AuditLog.js";

export interface LogAuditOptions {
  userId?: string | Types.ObjectId;
  action: string;
  req?: Request;
  metadata?: Record<string, unknown>;
}

export const logAuditEvent = async ({
  userId,
  action,
  req,
  metadata,
}: LogAuditOptions) => {
  const payload: Record<string, unknown> = {
    action,
    ipAddress: req?.ip ?? "",
    userAgent: req?.get("user-agent") ?? "",
  };

  if (userId) payload.userId = userId;
  if (metadata) payload.metadata = metadata;

  await AuditLog.create(payload);
};