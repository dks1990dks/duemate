import type { NotificationChannel } from "./notification.constants.js";

import type {
  NotificationDeliveryResult,
  NotificationPayload,
} from "./notification.types.js";

import {
  sendEmailNotification,
  sendInAppNotification,
  sendSmsNotification,
  sendWhatsAppNotification,
} from "./notification.service.js";

import { getEnabledNotificationChannels } from "../notification-preference/notification-preference.service.js";

const isRetryableNotificationError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return true;
  }

  const message = error.message.toLowerCase();

  // Configuration / account / recipient problems
  // should not be automatically retried.
  const permanentErrorPatterns = [
    "provider is not configured",
    "invalid template",
    "trial accounts can only use predefined",
    "user mobile number not available",
    "user not found",
    "invalid phone number",
  ];

  if (permanentErrorPatterns.some((pattern) => message.includes(pattern))) {
    return false;
  }

  // Other provider/network failures are treated
  // as potentially temporary.
  return true;
};

const sendByChannel = async (
  channel: NotificationChannel,
  payload: NotificationPayload,
): Promise<{ messageId?: string }> => {
  switch (channel) {
    case "IN_APP":
      await sendInAppNotification(payload);
      return {};

    case "EMAIL":
      return await sendEmailNotification(payload);

    case "SMS":
      return await sendSmsNotification(payload);

    case "WHATSAPP":
      return await sendWhatsAppNotification(payload);

    default: {
      const exhaustiveCheck: never = channel;

      throw new Error(`Unsupported notification channel: ${exhaustiveCheck}`);
    }
  }
};

const isProviderNotConfiguredError = (error: unknown) => {
  return (
    error instanceof Error &&
    error.message.endsWith("provider is not configured yet.")
  );
};

const getSafeNotificationError = (channel: NotificationChannel): string => {
  switch (channel) {
    case "SMS":
      return "SMS delivery is currently unavailable";

    case "WHATSAPP":
      return "WhatsApp delivery is currently unavailable";

    case "EMAIL":
      return "Email delivery could not be completed";

    case "IN_APP":
      return "In-app delivery could not be completed";

    default: {
      const exhaustiveCheck: never = channel;
      return `Notification delivery failed: ${exhaustiveCheck}`;
    }
  }
};

export const dispatchNotification = async (
  payload: NotificationPayload,
): Promise<NotificationDeliveryResult[]> => {
  // Filter reminder-requested channels according
  // to the user's notification preferences.
  const enabledChannels = await getEnabledNotificationChannels(
    payload.userId,
    payload.channels,
  );

  // No enabled channels is not a delivery failure.
  // The user has intentionally disabled them.
  if (enabledChannels.length === 0) {
    return [];
  }

  const results = await Promise.all(
    enabledChannels.map(async (channel) => {
      try {
        const providerResult = await sendByChannel(channel, payload);

        return {
          channel,
          status: "SENT" as const,
          success: true,
          retryable: false,
          ...(providerResult.messageId
            ? { messageId: providerResult.messageId }
            : {}),
        };
      } catch (error) {
        const isNotConfigured = isProviderNotConfiguredError(error);

        return {
          channel,
          status: isNotConfigured
            ? ("NOT_CONFIGURED" as const)
            : ("FAILED" as const),
          success: false,
          retryable: isNotConfigured
            ? false
            : isRetryableNotificationError(error),
          error: getSafeNotificationError(channel),
        };
      }
    }),
  );
  return results;
};
