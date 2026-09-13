export type NotificationChannel =
  | "IN_APP"
  | "EMAIL"
  | "SMS"
  | "WHATSAPP";

export interface NotificationChannels {
  IN_APP: boolean;
  EMAIL: boolean;
  SMS: boolean;
  WHATSAPP: boolean;
}

export interface NotificationPreferences {
  _id: string;

  userId: string;

  channels: NotificationChannels;

  createdAt: string;

  updatedAt: string;
}

export interface NotificationPreferencesResponse {
  success: boolean;

  message: string;

  data: {
    preferences: NotificationPreferences;
  };
}

export interface UpdateNotificationPreferencesData {
  channels: Partial<NotificationChannels>;
}