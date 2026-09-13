import api from "@/lib/api";

import type {
  ReminderResponse,
  RemindersResponse,
} from "./reminder.types";

// =========================
// Get all reminders
// =========================

export const getReminders = async () => {
  const response = await api.get<RemindersResponse>(
    "/reminders",
  );

  return response.data;
};

// =========================
// Get reminders for one obligation
// =========================

export const getRemindersByObligationId = async (
  obligationId: string,
) => {
  const response = await api.get<RemindersResponse>(
    `/reminders/obligation/${obligationId}`,
  );

  return response.data.data.reminders;
};

// =========================
// Get one reminder
// =========================

export const getReminderById = async (
  reminderId: string,
) => {
  const response = await api.get<ReminderResponse>(
    `/reminders/${reminderId}`,
  );

  return response.data.data.reminder;
};

// =========================
// Cancel reminder
// =========================

export const cancelReminder = async (
  reminderId: string,
) => {
  const response = await api.delete<ReminderResponse>(
    `/reminders/${reminderId}`,
  );

  return response.data.data.reminder;
};