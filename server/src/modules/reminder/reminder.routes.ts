import { Router } from "express";

import * as reminderController from "./reminder.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { validateRequest } from "../../middleware/validate.js";
import { requireInternalCronSecret } from "../../middleware/internalCron.middleware.js";

import {
  createReminderSchema,
  updateReminderSchema,
  reminderParamsSchema,
} from "./reminder.validation.js";

const router = Router();

router.post(
  "/internal/process",
  requireInternalCronSecret,
  reminderController.processDueInternal,
);

router.use(requireAuth);

router.post(
  "/",
  validateRequest(createReminderSchema),
  reminderController.create,
);

router.post(
  "/process-due",
  reminderController.processDue,
);

router.get(
  "/",
  reminderController.getAll,
);

router.get(
  "/obligation/:obligationId",
  reminderController.getByObligation,
);

router.get(
  "/:reminderId",
  validateRequest(reminderParamsSchema),
  reminderController.getById,
);

router.patch(
  "/:reminderId",
  validateRequest(updateReminderSchema),
  reminderController.update,
);

router.delete(
  "/:reminderId",
  validateRequest(reminderParamsSchema),
  reminderController.cancel,
);



export default router;