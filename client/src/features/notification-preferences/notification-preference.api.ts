import api from "@/lib/api";

import type {
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesData,
} from "./notification-preference.types";

// =========================
// Get Notification Preferences
// =========================

export const getNotificationPreferences =
  async () => {
    const response =
      await api.get<NotificationPreferencesResponse>(
        "/notification-preferences",
      );

    return response.data;
  };

// =========================
// Update Notification Preferences
// =========================

export const updateNotificationPreferences =
  async (
    data: UpdateNotificationPreferencesData,
  ) => {
    const response =
      await api.patch<NotificationPreferencesResponse>(
        "/notification-preferences",
        data,
      );

    return response.data;
  };