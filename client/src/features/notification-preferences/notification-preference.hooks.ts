import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "./notification-preference.api";

import type {
  UpdateNotificationPreferencesData,
} from "./notification-preference.types";

// =========================
// Query Keys
// =========================

export const notificationPreferenceKeys = {
  all: ["notification-preferences"] as const,

  detail: () =>
    [
      ...notificationPreferenceKeys.all,
      "detail",
    ] as const,
};

// =========================
// Get Preferences
// =========================

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey:
      notificationPreferenceKeys.detail(),

    queryFn: getNotificationPreferences,
  });
};

// =========================
// Update Preferences
// =========================

export const useUpdateNotificationPreferences =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        data: UpdateNotificationPreferencesData,
      ) =>
        updateNotificationPreferences(data),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey:
            notificationPreferenceKeys.all,
        });
      },
    });
  };