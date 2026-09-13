import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "./dashboard.hooks";

const getMillisecondsUntilNextDay = () => {
  const now = new Date();

  const nextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    5,
    0,
  );

  return nextDay.getTime() - now.getTime();
};

export const useDashboardDateRefresh = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let timeoutId: number;

    const scheduleNextRefresh = () => {
      timeoutId = window.setTimeout(() => {
        void queryClient.invalidateQueries({
          queryKey: dashboardKeys.all,
        });

        scheduleNextRefresh();
      }, getMillisecondsUntilNextDay());
    };

    scheduleNextRefresh();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [queryClient]);
};