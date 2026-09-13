export const notificationChannels = [
  "IN_APP",
  "EMAIL",
  "SMS",
  "WHATSAPP",
] as const;

export type NotificationChannel =
  (typeof notificationChannels)[number];