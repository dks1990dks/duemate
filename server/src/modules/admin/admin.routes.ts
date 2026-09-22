import { Router } from "express";

import { requireAuth } from "@/middleware/authMiddleware.js";
import { requireAdmin } from "@/middleware/admin.middleware.js";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminNotificationDeliveries,
} from "./admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAdminUsers);

router.get(
  "/notifications",
  getAdminNotificationDeliveries,
);

export default router;