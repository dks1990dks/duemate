import type { Request, Response, NextFunction } from "express";

import logger from "../../utils/logger.js";

import { updateWhatsAppDeliveryFromWebhook } from "../notification/notification-delivery.service.js";

interface GupshupMessageEventPayload {
  id: string;
  gsId?: string;
  type: "enqueued" | "sent" | "delivered" | "read" | "failed";
  destination?: string;
  payload?: unknown;
}

interface GupshupWebhookPayload {
  app?: unknown;
  timestamp?: unknown;
  version?: unknown;
  type?: unknown;
  payload?: unknown;
}

const isMessageEventPayload = (
  value: unknown,
): value is GupshupMessageEventPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return typeof payload.id === "string" && typeof payload.type === "string";
};

const isGupshupWebhookPayload = (
  value: unknown,
): value is GupshupWebhookPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    payload.type === "message-event" && isMessageEventPayload(payload.payload)
  );
};

const getFailureDetails = (
  value: unknown,
): {
  code: number | undefined;
  reason: string;
} => {
  if (typeof value !== "object" || value === null) {
    return {
      code: undefined,
      reason: "WhatsApp delivery failed",
    };
  }

  const payload = value as Record<string, unknown>;

  const code = typeof payload.code === "number" ? payload.code : undefined;

  const reason =
    typeof payload.reason === "string" && payload.reason.trim().length > 0
      ? payload.reason
      : "WhatsApp delivery failed";

  return {
    code,
    reason,
  };
};

const isRetryableWhatsAppFailure = (
  code: number | undefined,
  reason: string,
): boolean => {
  const normalizedReason = reason.toLowerCase();

  if (
    normalizedReason.includes("low balance") ||
    normalizedReason.includes("not opted in") ||
    normalizedReason.includes("inactive") ||
    normalizedReason.includes("invalid phone") ||
    normalizedReason.includes("invalid number")
  ) {
    return false;
  }

  if (code === 1008 || code === 9999) {
    return false;
  }

  return true;
};

export const handleGupshupWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isGupshupWebhookPayload(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Gupshup webhook payload",
      });
    }

    const event = req.body.payload as GupshupMessageEventPayload;

    const eventType = event.type;

    if (
      eventType !== "enqueued" &&
      eventType !== "sent" &&
      eventType !== "delivered" &&
      eventType !== "read" &&
      eventType !== "failed"
    ) {
      return res.status(200).json({
        success: true,
        message: "Webhook event ignored",
      });
    }

    /*
     * Gupshup V2 uses:
     *
     * enqueued → event.id is the Gupshup message ID
     * failed   → gsId may contain the Gupshup message ID
     * sent/delivered/read → gsId is the Gupshup message ID
     *
     * NotificationDelivery stores the Gupshup message ID.
     */

    if (eventType === "failed") {
      const failure = getFailureDetails(event.payload);

      const retryable = isRetryableWhatsAppFailure(
        failure.code,
        failure.reason,
      );

      const messageId = event.gsId ?? event.id;

      const delivery = await updateWhatsAppDeliveryFromWebhook({
        messageId,
        eventType: "failed",
        error: `WhatsApp delivery failed: ${failure.reason}`,
        retryable,
      });

      logger.warn("[Gupshup Webhook] WhatsApp delivery failed", {
        messageId,
        code: failure.code,
        retryable,
        deliveryUpdated: Boolean(delivery),
      });

      return res.status(200).json({
        success: true,
      });
    }

    const messageId =
      eventType === "sent" ||
      eventType === "delivered" ||
      eventType === "read"
        ? event.gsId
        : event.id;

    if (!messageId) {
      logger.warn("[Gupshup Webhook] Missing Gupshup message ID", {
        eventType,
      });

      return res.status(200).json({
        success: true,
      });
    }

    const delivery = await updateWhatsAppDeliveryFromWebhook({
      messageId,
      eventType,
    });

    logger.info("[Gupshup Webhook] WhatsApp event processed", {
      messageId,
      eventType,
      deliveryUpdated: Boolean(delivery),
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
