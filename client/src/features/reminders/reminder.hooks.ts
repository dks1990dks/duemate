import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelReminder,
  getReminderById,
  getReminders,
  getRemindersByObligationId,
} from "./reminder.api";

// =========================
// Query Keys
// =========================

export const reminderKeys = {
  all: ["reminders"] as const,

  lists: () =>
    [...reminderKeys.all, "list"] as const,

  list: () =>
    [...reminderKeys.lists()] as const,

  details: () =>
    [...reminderKeys.all, "detail"] as const,

  detail: (reminderId: string) =>
    [
      ...reminderKeys.details(),
      reminderId,
    ] as const,

  byObligation: (obligationId: string) =>
    [
      ...reminderKeys.all,
      "obligation",
      obligationId,
    ] as const,
};

// =========================
// Queries
// =========================

export const useReminders = () => {
  return useQuery({
    queryKey: reminderKeys.list(),
    queryFn: getReminders,
  });
};

export const useReminder = (
  reminderId: string,
) => {
  return useQuery({
    queryKey: reminderKeys.detail(reminderId),

    queryFn: () =>
      getReminderById(reminderId),

    enabled: Boolean(reminderId),
  });
};

export const useObligationReminders = (
  obligationId: string,
) => {
  return useQuery({
    queryKey:
      reminderKeys.byObligation(obligationId),

    queryFn: () =>
      getRemindersByObligationId(
        obligationId,
      ),

    enabled: Boolean(obligationId),
  });
};

// =========================
// Cancel Reminder
// =========================

export const useCancelReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) =>
      cancelReminder(reminderId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reminderKeys.all,
      });
    },
  });
};