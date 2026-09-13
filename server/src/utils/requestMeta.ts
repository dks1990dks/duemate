import type { Request } from "express";

export const getRequestMetadata = (req: Request) => {
  const userAgent = req.get("user-agent") || undefined;
  const ipAddress = req.ip || undefined;

  return {
    userAgent,
    ipAddress,
  };
};