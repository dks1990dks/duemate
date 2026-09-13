import type { NotificationChannel } from "./notification.constants.js";

export interface NotificationPayload {
  userId: string;
  reminderId: string;
  obligationId: string;
  title: string;
  message: string;
  channels: NotificationChannel[];

  obligation: {
    title: string;
    type: string;
    amount: number;
    currency: string;
    dueDate: Date;
    recurrence: string;
    providerName?: string | null | undefined;
    accountReference?: string | null | undefined;
  };
}

export type NotificationDeliveryStatus = "SENT" | "FAILED" | "NOT_CONFIGURED";

export interface NotificationDeliveryResult {
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  success: boolean;
  retryable: boolean;
  messageId?: string;
  error?: string;
}

export interface CreateInAppNotificationInput {
  userId: string;
  reminderId: string;
  obligationId: string;

  title: string;
  message: string;
}
