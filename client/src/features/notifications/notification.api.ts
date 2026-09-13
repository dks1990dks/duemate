import api from "@/lib/api";

import type {
  NotificationResponse,
  NotificationsResponse,
  UnreadNotificationCountResponse,
  NotificationDelivery,
} from "./notification.types";

export interface ReminderDeliveryResponse {
  success: boolean;
  message: string;
  data: {
    deliveries: NotificationDelivery[];
  };
}

// =========================
// Get Notifications
// =========================

export const getNotifications = async () => {
  const response =
    await api.get<NotificationsResponse>(
      "/notifications",
    );

  return response.data;
};

// =========================
// Get Unread Count
// =========================

export const getUnreadNotificationCount =
  async () => {
    const response =
      await api.get<UnreadNotificationCountResponse>(
        "/notifications/unread-count",
      );

    return response.data;
  };

// =========================
// Mark Notification as Read
// =========================

export const markNotificationAsRead = async (
  notificationId: string,
) => {
  const response =
    await api.patch<NotificationResponse>(
      `/notifications/${notificationId}/read`,
    );

  return response.data.data.notification;
};

// =========================
// Mark All Notifications as Read
// =========================

export const markAllNotificationsAsRead =
  async () => {
    const response =
      await api.patch(
        "/notifications/read-all",
      );

    return response.data;
  };

export const getReminderDeliveryHistory = async (
  reminderId: string,
) => {
  const response =
    await api.get<ReminderDeliveryResponse>(
      `/notifications/reminder/${reminderId}/delivery`,
    );

  return response.data;
};

export const getObligationDeliveryHistory = async (
  obligationId: string,
) => {
  const response =
    await api.get<ReminderDeliveryResponse>(
      `/notifications/obligation/${obligationId}/delivery`,
    );

  return response.data;
};