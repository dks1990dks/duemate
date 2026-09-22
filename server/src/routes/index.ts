import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import obligationRoutes from "../modules/obligation/obligation.routes.js";
import dashboardRoutes from
  "../modules/dashboard/dashboard.routes.js";
import reminderRoutes from "../modules/reminder/reminder.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import notificationPreferenceRoutes from
  "../modules/notification-preference/notification-preference.routes.js";

import gupshupWebhookRoutes from "../modules/webhook/gupshup-webhook.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";  

const router = Router();

router.use("/auth", authRoutes);

router.use(
  "/obligations",
  obligationRoutes,
);

router.use(
  "/dashboard",
  dashboardRoutes,
);

router.use(
  "/reminders",
  reminderRoutes,
);

router.use(
  "/notifications",
  notificationRoutes,
);

router.use(
  "/notification-preferences",
  notificationPreferenceRoutes,
);

router.use(
  "/admin",
  adminRoutes,
);

router.use(
  "/webhooks/gupshup",
  gupshupWebhookRoutes,
);

export default router;