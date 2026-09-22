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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string | null;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminNotificationDelivery {
  id: string;

  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };

  obligation: {
    id: string;
    title: string;
    type: string;
    providerName: string | null;
    amount: number;
    currency: string;
  };

  reminderId: string;

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

  deliveredAt: string | null;
  createdAt: string | null;
}

export interface AdminNotificationsResponse {
  deliveries: AdminNotificationDelivery[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}