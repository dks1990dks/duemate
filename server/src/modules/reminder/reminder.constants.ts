export const reminderChannels = [
  "IN_APP",
  "EMAIL",
  "SMS",
  "WHATSAPP",
] as const;

export type ReminderChannel =
  (typeof reminderChannels)[number];


export const reminderStatuses = [
  "PENDING",
  "PROCESSING",
  "SENT",
  "FAILED",
  "CANCELLED",
] as const;

export type ReminderStatus =
  (typeof reminderStatuses)[number];


export const reminderTriggerTypes = [
  "BEFORE_DUE",
  "ON_DUE_DATE",
  "AFTER_DUE",
] as const;

export type ReminderTriggerType =
  (typeof reminderTriggerTypes)[number];

export const REMINDER_MAX_RETRIES = 3;