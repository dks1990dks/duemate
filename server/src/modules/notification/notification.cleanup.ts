import { Notification } from "./notification.model.js";

const NOTIFICATION_RETENTION_DAYS = 90;

export const cleanupOldNotifications = async () => {
  const cutoffDate = new Date();

  cutoffDate.setDate(
    cutoffDate.getDate() - NOTIFICATION_RETENTION_DAYS,
  );

  const result = await Notification.deleteMany({
    isRead: true,

    createdAt: {
      $lt: cutoffDate,
    },
  });

  return {
    deletedCount: result.deletedCount,
    cutoffDate,
  };
};