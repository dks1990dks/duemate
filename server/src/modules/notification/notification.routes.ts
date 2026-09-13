import { Router } from "express";

import {
  getAll,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getReminderDelivery,
  getObligationDelivery,
} from "./notification.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";


const router = Router();


// GET /api/notifications
router.get(
  "/",
  requireAuth,
  getAll,
);


// GET /api/notifications/unread-count
router.get(
  "/unread-count",
  requireAuth,
  getUnreadCount,
);


// PATCH /api/notifications/read-all
router.patch(
  "/read-all",
  requireAuth,
  markAllAsRead,
);


// PATCH /api/notifications/:notificationId/read
router.patch(
  "/:notificationId/read",
  requireAuth,
  markAsRead,
);

router.get(
  "/reminder/:reminderId/delivery",
   requireAuth,
   getReminderDelivery,
);

router.get(
  "/obligation/:obligationId/delivery",
  requireAuth,
  getObligationDelivery,
);


export default router;