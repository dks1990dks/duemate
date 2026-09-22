export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalObligations: number;
  upcomingReminders: number;

  notificationDelivery: {
    sent: number;
    failed: number;
    notConfigured: number;
  };
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date | null;
}

export interface AdminUserListResponse {
  users: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminNotificationDeliveryItem {
  id: string;
  userId: string;
  reminderId: string;
  obligationId: string;

  channel:
    | "IN_APP"
    | "EMAIL"
    | "SMS"
    | "WHATSAPP";

  status:
    | "SENT"
    | "FAILED"
    | "NOT_CONFIGURED";

  success: boolean;
  retryable: boolean;

  messageId: string | null;
  error: string | null;

  deliveredAt: Date | null;
  createdAt: Date | null;
}

export interface AdminNotificationDeliveryResponse {
  deliveries: AdminNotificationDeliveryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}