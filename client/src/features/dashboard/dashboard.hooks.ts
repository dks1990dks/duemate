import {
  useQuery,
} from "@tanstack/react-query";

import {
  getDashboardSummary,
  getUpcomingObligations,
  getOverdueObligations,
} from "./dashboard.api";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  summary: () =>
    [...dashboardKeys.all, "summary"] as const,

  upcoming: () =>
    [...dashboardKeys.all, "upcoming"] as const,

  overdue: () =>
    [...dashboardKeys.all, "overdue"] as const,
};

const dashboardQueryConfig = {
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
    ...dashboardQueryConfig,
  });
};

export const useUpcomingObligations = () => {
  return useQuery({
    queryKey: dashboardKeys.upcoming(),
    queryFn: getUpcomingObligations,
    ...dashboardQueryConfig,
  });
};

export const useOverdueObligations = () => {
  return useQuery({
    queryKey: dashboardKeys.overdue(),
    queryFn: getOverdueObligations,
    ...dashboardQueryConfig,
  });
};