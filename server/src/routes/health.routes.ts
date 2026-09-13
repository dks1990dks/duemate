import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

const router = Router();

router.get("/health", (_req, res) => {
  return sendSuccess(res, "DueMate API is running", {
    environment: env.nodeEnv,
  });
});

export default router;