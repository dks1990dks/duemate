import api from "@/lib/api";

import type {
  AdminDashboardStats,
  AdminUsersResponse,
  AdminNotificationsResponse,

} from "./admin.types";

export const getAdminDashboard =
  async (): Promise<AdminDashboardStats> => {
    const response = await api.get<{
      success: boolean;
      data: AdminDashboardStats;
    }>("/admin/dashboard");

    return response.data.data;
  };

export const getAdminUsers = async (
  page = 1,
  limit = 20,
): Promise<AdminUsersResponse> => {
  const response = await api.get<{
    success: boolean;
    data: AdminUsersResponse;
  }>("/admin/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
};

export const getAdminNotifications = async (
  page = 1,
  limit = 20,
): Promise<AdminNotificationsResponse> => {
  const response = await api.get<{
    success: boolean;
    data: AdminNotificationsResponse;
  }>("/admin/notifications", {
    params: { page, limit },
  });

  return response.data.data;
};