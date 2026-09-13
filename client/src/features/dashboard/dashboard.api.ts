import api from "@/lib/api";

import type {
  DashboardSummaryResponse,
  UpcomingObligationsResponse,
  OverdueObligationsResponse,
} from "./dashboard.types";

export const getDashboardSummary =
  async () => {
    const response =
      await api.get<DashboardSummaryResponse>(
        "/dashboard/summary",
      );

    return response.data.data.summary;
  };

  export const getUpcomingObligations =
  async () => {
    const response =
      await api.get<UpcomingObligationsResponse>(
        "/dashboard/upcoming",
      );

    return response.data.data.obligations;
  };

  export const getOverdueObligations =
  async () => {
    const response =
      await api.get<OverdueObligationsResponse>(
        "/dashboard/overdue",
      );

    return response.data.data.obligations;
  };