import { processDueReminders } from "./reminder.processor.js";

import { env } from "../../config/env.js";

let isProcessing = false;

const DEFAULT_INTERVAL_MS = 60 * 1000;
const MIN_INTERVAL_MS = 10 * 1000;

const getSchedulerInterval = (): number => {
  const configuredInterval =
    env.reminderSchedulerIntervalMs;

  if (configuredInterval < MIN_INTERVAL_MS) {
    console.warn(
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
    console.log(
      "[Reminder Scheduler] Previous processing cycle is still running. Skipping.",
    );

    return;
  }

  isProcessing = true;

  try {
    const result = await processDueReminders();

    if (result.foundCount > 0) {
      console.log(
        "[Reminder Scheduler] Processing completed:",
        result,
      );
    }
  } catch (error) {
    console.error(
      "[Reminder Scheduler] Processing failed:",
      error,
    );
  } finally {
    // Always release the processing lock.
    isProcessing = false;
  }
};

export const startReminderScheduler = (): void => {
  const interval = getSchedulerInterval();
  const runOnStart = shouldRunOnStart();

  console.log(
    `[Reminder Scheduler] Started. Checking due reminders every ${interval / 1000} seconds.`,
  );

  // Optional immediate processing on server startup.
  if (runOnStart) {
    void runReminderScheduler();
  }

  // Continue checking at the configured interval.
  setInterval(
    () => {
      void runReminderScheduler();
    },
    interval,
  );
};