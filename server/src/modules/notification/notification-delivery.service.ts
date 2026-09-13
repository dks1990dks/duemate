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
    return true;
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
