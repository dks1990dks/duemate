import { cleanupOldNotifications } from "./notification.cleanup.js";
import logger from "../../utils/logger.js";

let isCleanupRunning = false;
let notificationCleanupInterval: ReturnType<typeof setInterval> | null = null;

export const runNotificationCleanup = async () => {
  // Prevent overlapping cleanup jobs
  // inside the same Node.js process.
  if (isCleanupRunning) {
    logger.info(
      "[Notification Cleanup] Previous cleanup is still running. Skipping.",
    );

    return;
  }

  isCleanupRunning = true;

  try {
    const result = await cleanupOldNotifications();

    logger.info("[Notification Cleanup] Completed:", {
      deletedCount: result.deletedCount,
      cutoffDate: result.cutoffDate,
    });
  } catch (error) {
    logger.error("[Notification Cleanup] Failed:", error);
  } finally {
    isCleanupRunning = false;
  }
};

export const startNotificationCleanupScheduler = () => {
  logger.info(
    "[Notification Cleanup] Started. Running cleanup every 24 hours.",
  );

  // Run once when the server starts.
  void runNotificationCleanup();

  // Then run every 24 hours.
  notificationCleanupInterval = setInterval(
    () => {
      void runNotificationCleanup();
    },
    24 * 60 * 60 * 1000,
  );
};

export const stopNotificationCleanupScheduler = (): void => {
  if (!notificationCleanupInterval) {
    return;
  }

  clearInterval(notificationCleanupInterval);
  notificationCleanupInterval = null;

  logger.info("[Notification Cleanup] Stopped.");
};
