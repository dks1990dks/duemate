import {
  getDueRemindersForProcessing,
  claimReminderForProcessing,
  markReminderAsSent,
  markReminderAsFailed,
  recoverStuckReminders,
} from "./reminder.service.js";

import { Obligation } from "../obligation/obligation.model.js";

import { dispatchNotification } from "../notification/notification.dispatcher.js";

import type { NotificationPayload } from "../notification/notification.types.js";
import { NotificationDelivery } from "../notification/notification-delivery.model.js";
import { getRetryableChannels } from "../notification/notification-delivery.service.js";
import logger from "../../utils/logger.js";

export const processDueReminders = async () => {
  await recoverStuckReminders();
  const reminders = await getDueRemindersForProcessing();

  let processedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const reminder of reminders) {
    const reminderId = reminder._id.toString();
    const userId = reminder.userId.toString();

    let shouldRetry = false;

    try {
      // Atomically claim the reminder before processing.
      const claimResult = await claimReminderForProcessing(reminderId, userId);

      if (!claimResult) {
        skippedCount++;
        continue;
      }

      const { reminder: claimedReminder, isRetry } = claimResult;

      // Load the related obligation after successfully
      // claiming the reminder.
      const obligation = await Obligation.findOne({
        _id: reminder.obligationId,
        userId: reminder.userId,
      });

      if (!obligation) {
        throw new Error("Related obligation not found.");
      }

      const channelsToDispatch = isRetry
        ? await getRetryableChannels(
            claimedReminder._id.toString(),
            claimedReminder.userId.toString(),
            claimedReminder.channels,
          )
        : claimedReminder.channels;

      if (channelsToDispatch.length === 0) {
        await markReminderAsSent(reminderId, userId);

        processedCount++;
        continue;
      }

      // Build notification payload.
      const notificationPayload: NotificationPayload = {
        userId: claimedReminder.userId.toString(),
        reminderId: claimedReminder._id.toString(),
        obligationId: claimedReminder.obligationId.toString(),
        title: obligation.title,
        message: `Reminder: ${obligation.title} is due on ${obligation.nextDueDate.toLocaleDateString("en-IN")}.`,
        channels: channelsToDispatch,

        obligation: {
          title: obligation.title,
          type: obligation.type,
          amount: obligation.amount,
          currency: obligation.currency,
          dueDate: obligation.nextDueDate,
          recurrence: obligation.recurrence,
          providerName: obligation.providerName,
          accountReference: obligation.accountReference,
        },
      };
      // Dispatch through all configured channels.
      const deliveryResults = await dispatchNotification(notificationPayload);

      logger.info("[Reminder] Notification delivery results:", {
        reminderId,
        results: deliveryResults,
      });

      await NotificationDelivery.bulkWrite(
        deliveryResults.map((result) => ({
          updateOne: {
            filter: {
              reminderId: claimedReminder._id,
              userId: claimedReminder.userId,
              channel: result.channel,
            },
            update: {
              $set: {
                userId: claimedReminder.userId,
                obligationId: claimedReminder.obligationId,
                status: result.status,
                success: result.success,
                retryable: result.retryable,
                messageId: result.messageId ?? null,
                error: result.error ?? null,
                deliveredAt: result.status === "SENT" ? new Date() : null,
              },
            },
            upsert: true,
          },
        })),
      );

      const failedResults = deliveryResults.filter(
        (result) => result.status === "FAILED",
      );

      const sentResults = deliveryResults.filter(
        (result) => result.status === "SENT",
      );

      const notConfiguredResults = deliveryResults.filter(
        (result) => result.status === "NOT_CONFIGURED",
      );

      logger.info("[Reminder] Notification delivery summary:", {
        reminderId,
        sent: sentResults.map((result) => result.channel),
        failed: failedResults.map((result) => result.channel),
        notConfigured: notConfiguredResults.map((result) => result.channel),
      });

      if (failedResults.length > 0) {
        const failedChannels = failedResults
          .map((result) => result.channel)
          .join(", ");

        shouldRetry = failedResults.some((result) => result.retryable);

        throw new Error(`Notification delivery failed for: ${failedChannels}`);
      }

      if (sentResults.length === 0) {
        throw new Error(
          "No notification channels were successfully delivered.",
        );
      }

      // Mark successfully processed only after
      // notification dispatch succeeds.
      const sentReminder = await markReminderAsSent(reminderId, userId);

      if (sentReminder) {
        processedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      failedCount++;

      const failureReason =
        error instanceof Error
          ? error.message
          : "Unknown reminder processing error";

      try {
        await markReminderAsFailed(
          reminderId,
          userId,
          failureReason,
          shouldRetry,
        );
      } catch (markFailedError) {
        logger.error(
          `[Reminder] Failed to update reminder ${reminderId} to FAILED`,
          markFailedError,
        );
      }

      logger.error(`[Reminder] Processing failed for ${reminderId}`, error);
    }
  }

  return {
    foundCount: reminders.length,
    processedCount,
    skippedCount,
    failedCount,
  };
};
