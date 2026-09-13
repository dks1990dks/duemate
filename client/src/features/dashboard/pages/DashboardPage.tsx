import { useEffect, useState } from "react";

import DashboardSummaryCards from "../components/DashboardSummaryCards";
import UpcomingObligationsWidget from "../components/UpcomingObligationsWidget";
import OverdueObligationsWidget from "../components/OverdueObligationsWidget";
import DashboardWidgetError from "../components/DashboardWidgetError";
import DashboardQuickActions from "../components/DashboardQuickActions";
import DashboardSummarySkeleton from "../components/DashboardSummarySkeleton";
import DashboardWidgetSkeleton from "../components/DashboardWidgetSkeleton";
import { useDashboardDateRefresh } from "../useDashboardDateRefresh";
import ReminderStatisticsWidget from "../components/ReminderStatisticsWidget";
import NotificationSummaryWidget from "../components/NotificationSummaryWidget";

import {
  useDashboardSummary,
  useUpcomingObligations,
  useOverdueObligations,
} from "../dashboard.hooks";

import { useReminders } from "@/features/reminders/reminder.hooks";
import { useNotifications } from "@/features/notifications/notification.hooks";

const DashboardPage = () => {
  useDashboardDateRefresh();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
    isFetching: isSummaryFetching,
  } = useDashboardSummary();

  const {
    data: upcomingObligations,
    isLoading: isUpcomingLoading,
    isError: isUpcomingError,
    error: upcomingError,
    refetch: refetchUpcoming,
    isFetching: isUpcomingFetching,
  } = useUpcomingObligations();

  const {
    data: overdueObligations,
    isLoading: isOverdueLoading,
    isError: isOverdueError,
    error: overdueError,
    refetch: refetchOverdue,
    isFetching: isOverdueFetching,
  } = useOverdueObligations();

  const {
    data: remindersData,
    isLoading: isRemindersLoading,
    isError: isRemindersError,
    error: remindersError,
    refetch: refetchReminders,
    isFetching: isRemindersFetching,
  } = useReminders();

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
    error: notificationsError,
    refetch: refetchNotifications,
    isFetching: isNotificationsFetching,
  } = useNotifications();

  useEffect(() => {
    if (summary && upcomingObligations && overdueObligations) {
      setLastUpdated(new Date());
    }
  }, [summary, upcomingObligations, overdueObligations]);

  const handleRefresh = async () => {
    await Promise.all([
      refetchSummary(),
      refetchUpcoming(),
      refetchOverdue(),
      refetchReminders(),
      refetchNotifications(),
    ]);
  };

  const isRefreshing =
    isSummaryFetching ||
    isUpcomingFetching ||
    isOverdueFetching ||
    isRemindersFetching ||
    isNotificationsFetching;

  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Updating...";
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your upcoming payments and obligations.
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Last updated: {formattedLastUpdated}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>

          <DashboardQuickActions />
        </div>
      </div>

      {/* Summary Cards */}
      {isSummaryLoading ? (
        <DashboardSummarySkeleton />
      ) : isSummaryError ? (
        <DashboardWidgetError
          message={
            summaryError instanceof Error
              ? summaryError.message
              : "Unable to load dashboard summary."
          }
          onRetry={() => {
            void refetchSummary();
          }}
          isRetrying={isSummaryFetching}
        />
      ) : summary ? (
        <DashboardSummaryCards summary={summary} />
      ) : (
        <DashboardWidgetError
          message="Dashboard summary data is unavailable."
          onRetry={() => {
            void refetchSummary();
          }}
          isRetrying={isSummaryFetching}
        />
      )}

      {/* Dashboard Widgets */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Upcoming Obligations */}
        {isUpcomingLoading ? (
          <DashboardWidgetSkeleton rows={3} />
        ) : isUpcomingError ? (
          <DashboardWidgetError
            message={
              upcomingError instanceof Error
                ? upcomingError.message
                : "Unable to load upcoming obligations."
            }
            onRetry={() => {
              void refetchUpcoming();
            }}
            isRetrying={isUpcomingFetching}
          />
        ) : (
          <UpcomingObligationsWidget obligations={upcomingObligations ?? []} />
        )}

        {/* Overdue Obligations */}
        {isOverdueLoading ? (
          <DashboardWidgetSkeleton rows={3} />
        ) : isOverdueError ? (
          <DashboardWidgetError
            message={
              overdueError instanceof Error
                ? overdueError.message
                : "Unable to load overdue obligations."
            }
            onRetry={() => {
              void refetchOverdue();
            }}
            isRetrying={isOverdueFetching}
          />
        ) : (
          <OverdueObligationsWidget obligations={overdueObligations ?? []} />
        )}

        <div>
          {isRemindersLoading ? (
            <DashboardWidgetSkeleton rows={2} />
          ) : isRemindersError ? (
            <DashboardWidgetError
              message={
                remindersError instanceof Error
                  ? remindersError.message
                  : "Unable to load reminder statistics."
              }
              onRetry={() => {
                void refetchReminders();
              }}
              isRetrying={isRemindersFetching}
            />
          ) : (
            <ReminderStatisticsWidget
              reminders={remindersData?.data.reminders ?? []}
            />
          )}
        </div>
        <div>
          {isNotificationsLoading ? (
            <DashboardWidgetSkeleton rows={2} />
          ) : isNotificationsError ? (
            <DashboardWidgetError
              message={
                notificationsError instanceof Error
                  ? notificationsError.message
                  : "Unable to load notification summary."
              }
              onRetry={() => {
                void refetchNotifications();
              }}
              isRetrying={isNotificationsFetching}
            />
          ) : (
            <NotificationSummaryWidget
              notifications={notificationsData?.data.notifications ?? []}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
