import {
  cleanupOldNotifications,
} from "./notification.cleanup.js";

let isCleanupRunning = false;

export const runNotificationCleanup = async () => {
  // Prevent overlapping cleanup jobs
  // inside the same Node.js process.
  if (isCleanupRunning) {
    console.log(
      "[Notification Cleanup] Previous cleanup is still running. Skipping.",
    );

    return;
  }

  isCleanupRunning = true;

  try {
    const result = await cleanupOldNotifications();

    console.log(
      "[Notification Cleanup] Completed:",
      {
        deletedCount: result.deletedCount,
        cutoffDate: result.cutoffDate,
      },
    );
  } catch (error) {
    console.error(
      "[Notification Cleanup] Failed:",
      error,
    );
  } finally {
    isCleanupRunning = false;
  }
};

export const startNotificationCleanupScheduler = () => {
  console.log(
    "[Notification Cleanup] Started. Running cleanup every 24 hours.",
  );

  // Run once when the server starts.
  void runNotificationCleanup();

  // Then run every 24 hours.
  setInterval(
    () => {
      void runNotificationCleanup();
    },
    24 * 60 * 60 * 1000,
  );
};