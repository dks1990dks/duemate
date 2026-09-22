import { useQuery } from "@tanstack/react-query";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminNotifications,
} from "./admin.api";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard,
  });
};

export const useAdminUsers = (
  page = 1,
  limit = 20,
) => {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: () => getAdminUsers(page, limit),
  });
};

export const useAdminNotifications = (
  page = 1,
  limit = 20,
) => {
  return useQuery({
    queryKey: ["admin", "notifications", page, limit],
    queryFn: () => getAdminNotifications(page, limit),
  });
};
