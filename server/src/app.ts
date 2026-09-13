import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import apiRoutes from "./routes/index.js";
import { sendSuccess } from "./utils/apiResponse.js";
import { getHealthStatus } from "./utils/health.js";

const app = express();

// Trust first proxy (Render, Railway, Nginx, Cloudflare) for rate limiting & client IP detection
app.set("trust proxy", 1);

app.disable("x-powered-by");

app.use(requestIdMiddleware);
app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  const health = getHealthStatus();

  return sendSuccess(
    res,
    "DueMate API is running",
    health,
    health.status === "healthy" ? 200 : 503,
  );
});

// Single entry point for all /api/v1 routes
app.use("/api/v1", apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;