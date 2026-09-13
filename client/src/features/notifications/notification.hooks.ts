import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getReminderDeliveryHistory,
  getObligationDeliveryHistory,
} from "./notification.api";

// =========================
// Query Keys
// =========================

export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () =>
    [...notificationKeys.all, "list"] as const,

  list: () =>
    [...notificationKeys.lists()] as const,

  unreadCount: () =>
    [...notificationKeys.all, "unread-count"] as const,
};

// =========================
// Queries
// =========================

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: getNotifications,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey:
      notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
};

// =========================
// Mark One as Read
// =========================

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

// =========================
// Mark All as Read
// =========================

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useReminderDeliveryHistory = (
  reminderId: string | undefined,
) => {
  return useQuery({
    queryKey: ["notification-delivery", reminderId],
    queryFn: () =>
      getReminderDeliveryHistory(reminderId as string),
    enabled: Boolean(reminderId),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
  });
};

export const useObligationDeliveryHistory = (
  obligationId: string | undefined,
) => {
  return useQuery({
    queryKey: ["notification-delivery-obligation", obligationId],
    queryFn: () =>
      getObligationDeliveryHistory(obligationId as string),
    enabled: Boolean(obligationId),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
  });
};