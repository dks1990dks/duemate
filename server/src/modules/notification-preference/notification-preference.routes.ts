import { z } from "zod";
import {
  Router,
} from "express";

import {
  getNotificationPreferences,updateNotificationPreferencesHandler,
} from "./notification-preference.controller.js";

import {
  updateNotificationPreferencesSchema,
} from "./notification-preference.validation.js";


import { requireAuth } from "../../middleware/authMiddleware.js";
import {validateRequest} from "../../middleware/validate.js"

const router = Router();

router.get(
  "/",
  requireAuth,
  getNotificationPreferences,
);

router.patch(
  "/",
  requireAuth,
  validateRequest(
    z.object({
      body: updateNotificationPreferencesSchema,
    }),
  ),
  updateNotificationPreferencesHandler,
);

export default router;