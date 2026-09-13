export type ReminderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SENT"
  | "FAILED"
  | "CANCELLED";

export type ReminderTriggerType =
  | "BEFORE_DUE"
  | "ON_DUE_DATE"
  | "AFTER_DUE";

export type ReminderChannel =
  | "IN_APP"
  | "EMAIL"
  | "SMS"
  | "WHATSAPP";

export interface Reminder {
  _id: string;

  obligationId: string;

  userId: string;

  triggerType: ReminderTriggerType;

  daysOffset: number;

  scheduledFor: string;

  channels: ReminderChannel[];

  status: ReminderStatus;

  sentAt: string | null;

  processedAt: string | null;

  failedAt: string | null;

  failureReason: string | null;

  retryCount: number;

  createdAt: string;

  updatedAt: string;
}

export interface RemindersResponse {
  success: boolean;

  message: string;

  data: {
    reminders: Reminder[];
  };
}

export interface ReminderResponse {
  success: boolean;

  message: string;

  data: {
    reminder: Reminder;
  };
}