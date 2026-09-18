import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import {
  startReminderScheduler,
  stopReminderScheduler,
} from "./modules/reminder/reminder.worker.js";

import {
  startNotificationCleanupScheduler,
  stopNotificationCleanupScheduler,
} from "./modules/notification/notification.cleanup.scheduler.js";

import { env } from "./config/env.js";
import logger from "./utils/logger.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    logger.info(`DueMate API running on port ${env.port}`);
    startReminderScheduler();
    startNotificationCleanupScheduler();
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down...`);

    stopReminderScheduler();
    stopNotificationCleanupScheduler();

    server.close(async () => {
      await disconnectDatabase();

      logger.info("DueMate server stopped");

      process.exit(0);
    });
  };

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
