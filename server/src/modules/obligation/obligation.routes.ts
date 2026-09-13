import { Router } from "express";

import { requireAuth } from "../../middleware/authMiddleware.js";
import { validateRequest } from "../../middleware/validate.js";

import {
  create,
  getAll,
  getById,
  update,
  archive,
  markAsPaid,
  pause,
  resume,
} from "./obligation.controller.js";

import {
  createObligationSchema,
  obligationIdParamsSchema,
  updateObligationSchema,
  markObligationAsPaidSchema,
  pauseObligationSchema,
  resumeObligationSchema,
} from "./obligation.validation.js";

const router = Router();

// All obligation routes require authentication
router.use(requireAuth);

router.post("/", requireAuth, validateRequest(createObligationSchema), create);

router.get("/", requireAuth, getAll);

router.post(
  "/:id/mark-paid",
  requireAuth,
  validateRequest(markObligationAsPaidSchema),
  markAsPaid,
);

router.post(
  "/:id/pause",
  requireAuth,
  validateRequest(pauseObligationSchema),
  pause,
);

router.post(
  "/:id/resume",
  requireAuth,
  validateRequest(resumeObligationSchema),
  resume,
);

router.get(
  "/:id",
  requireAuth,
  validateRequest(obligationIdParamsSchema),
  getById,
);

router.patch(
  "/:id",
  requireAuth,
  validateRequest(updateObligationSchema),
  update,
);

router.delete(
  "/:id",
  requireAuth,
  validateRequest(obligationIdParamsSchema),
  archive,
);

export default router;
