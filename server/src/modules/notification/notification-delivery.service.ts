import { NotificationDelivery } from "./notification-delivery.model.js";

import type { NotificationChannel } from "./notification.constants.js";

export const getRetryableChannels = async (
  reminderId: string,
  userId: string,
  channels: NotificationChannel[],
) => {
  const deliveries = await NotificationDelivery.find({
    reminderId,
    userId,
    channel: {
      $in: channels,
    },
  }).lean();

  const deliveryMap = new Map(
    deliveries.map((delivery) => [delivery.channel, delivery]),
  );

  return channels.filter((channel) => {
    const delivery = deliveryMap.get(channel);

    // No previous delivery record.
    if (!delivery) {
      return true;
    }

    // Already delivered successfully.
    if (delivery.status === "SENT") {
      return false;
    }

    // Do not retry permanent failures.
    if (delivery.status === "FAILED" && delivery.retryable === false) {
      return false;
    }

    // NOT_CONFIGURED should never be retried.
    if (delivery.status === "NOT_CONFIGURED") {
      return false;
    }

    // Retryable FAILED.
    return delivery.status === "FAILED" && delivery.retryable === true;
  });
};

export const getReminderDeliveryHistory = async (
  reminderId: string,
  userId: string,
) => {
  return NotificationDelivery.find({
    reminderId,
    userId,
  })
    .sort({ createdAt: 1 })
    .lean();
};

export const getObligationDeliveryHistory = async (
  obligationId: string,
  userId: string,
) => {
  return NotificationDelivery.find({
    obligationId,
    userId,
  })
    .sort({ createdAt: 1 })
    .lean();
};

export const updateWhatsAppDeliveryFromWebhook = async ({
  messageId,
  eventType,
  error,
  retryable,
}: {
  messageId: string;
  eventType: "enqueued" | "sent" | "delivered" | "read" | "failed";
  error?: string;
  retryable?: boolean;
}) => {
  const delivery = await NotificationDelivery.findOne({
    messageId,
    channel: "WHATSAPP",
  });

  if (!delivery) {
    return null;
  }

  if (eventType === "failed") {
    delivery.status = "FAILED";
    delivery.success = false;
    delivery.retryable = retryable ?? false;
    delivery.error = error ?? "WhatsApp delivery failed";
    delivery.deliveredAt = null;

    await delivery.save();

    return delivery;
  }

  if (eventType === "delivered") {
    delivery.status = "SENT";
    delivery.success = true;
    delivery.retryable = false;
    delivery.error = null;
    delivery.deliveredAt = new Date();

    await delivery.save();

    return delivery;
  }

  if (eventType === "sent" || eventType === "enqueued") {
    delivery.status = "SENT";
    delivery.success = true;
    delivery.retryable = false;

    await delivery.save();

    return delivery;
  }

  // "read"
  delivery.status = "SENT";
  delivery.success = true;
  delivery.retryable = false;

  await delivery.save();

  return delivery;
};