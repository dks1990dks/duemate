export interface Notification {
  _id: string;

  reminderId: string;

  userId: string;

  obligationId: string;

  title: string;

  message: string;

  isRead: boolean;

  readAt: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;

  message: string;

  data: {
    notifications: Notification[];
  };
}

export interface NotificationResponse {
  success: boolean;

  message: string;

  data: {
    notification: Notification;
  };
}

export interface UnreadNotificationCountResponse {
  success: boolean;

  message: string;

  data: {
    count: number;
  };
}

export type NotificationDeliveryChannel =
  | "IN_APP"
  | "EMAIL"
  | "SMS"
  | "WHATSAPP";

export type NotificationDeliveryStatus =
  | "SENT"
  | "FAILED"
  | "NOT_CONFIGURED";

export interface NotificationDelivery {
  _id: string;
  userId: string;
  reminderId: string;
  obligationId: string;
  channel: NotificationDeliveryChannel;
  status: NotificationDeliveryStatus;
  success: boolean;
  messageId: string | null;
  error: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}