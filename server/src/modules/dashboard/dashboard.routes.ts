import {
  Router,
} from "express";

import {
  getSummary,
  getUpcoming,
  getOverdue,
} from "./dashboard.controller.js";

import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/summary",
  requireAuth,
  getSummary,
);
router.get(
  "/upcoming",
  requireAuth,
  getUpcoming,
);
router.get(
  "/overdue",
  requireAuth,
  getOverdue,
);
export default router;