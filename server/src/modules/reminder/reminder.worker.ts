import { processDueReminders } from "./reminder.processor.js";

import { env } from "../../config/env.js";

import logger from "../../utils/logger.js";

let isProcessing = false;
let reminderSchedulerInterval: ReturnType<typeof setInterval> | null = null;

const DEFAULT_INTERVAL_MS = 60 * 1000;
const MIN_INTERVAL_MS = 10 * 1000;

const getSchedulerInterval = (): number => {
  const configuredInterval = env.reminderSchedulerIntervalMs;

  if (configuredInterval < MIN_INTERVAL_MS) {
    logger.warn(
  `[Reminder Scheduler] Invalid interval. Using default ${DEFAULT_INTERVAL_MS}ms.`,
);

    return DEFAULT_INTERVAL_MS;
  }

  return configuredInterval;
};

const shouldRunOnStart = (): boolean => {
  return env.reminderSchedulerRunOnStart;
};

export const runReminderScheduler = async (): Promise<void> => {
  // Prevent overlapping scheduler executions
  // inside the same Node.js process.
  if (isProcessing) {
    logger.info(
      "[Reminder Scheduler] Previous processing cycle is still running. Skipping.",
    );

    return;
  }

  isProcessing = true;

  try {
    const result = await processDueReminders();

    if (result.foundCount > 0) {
      logger.info("[Reminder Scheduler] Processing completed:", result);
    }
  } catch (error) {
    logger.error("[Reminder Scheduler] Processing failed:", error);
  } finally {
    // Always release the processing lock.
    isProcessing = false;
  }
};

export const startReminderScheduler = (): void => {
  const interval = getSchedulerInterval();
  const runOnStart = shouldRunOnStart();

  logger.info(
    `[Reminder Scheduler] Started. Checking due reminders every ${interval / 1000} seconds.`,
  );

  // Optional immediate processing on server startup.
  if (runOnStart) {
    void runReminderScheduler();
  }

  // Continue checking at the configured interval.
  reminderSchedulerInterval = setInterval(() => {
    void runReminderScheduler();
  }, interval);
};

export const stopReminderScheduler = (): void => {
  if (!reminderSchedulerInterval) {
    return;
  }

  clearInterval(reminderSchedulerInterval);
  reminderSchedulerInterval = null;

  logger.info("[Reminder Scheduler] Stopped.");
};
