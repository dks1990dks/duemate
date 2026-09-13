import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";

export const requestIdMiddleware: RequestHandler = (
  req,
  res,
  next,
) => {
  const requestId =
    req.header("X-Request-ID") ?? randomUUID();

  res.setHeader("X-Request-ID", requestId);

  next();
};