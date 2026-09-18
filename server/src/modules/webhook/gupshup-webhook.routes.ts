import { Router } from "express";

import {
  handleGupshupWebhook,
} from "./gupshup-webhook.controller.js";

const router = Router();

router.post(
  "/",
  handleGupshupWebhook,
);

export default router;