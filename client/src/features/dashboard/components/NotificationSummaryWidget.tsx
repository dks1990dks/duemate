import { Link } from "react-router-dom";

import type { Notification } from "@/features/notifications/notification.types";

interface NotificationSummaryWidgetProps {
  notifications: Notification[];
}

interface NotificationStatProps {
  label: string;
  value: number;
  description: string;
  valueClassName?: string;
}

const NotificationStat = ({
  label,
  value,
  description,
  valueClassName = "text-slate-900",
}: NotificationStatProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className={`mt-2 text-2xl font-semibold ${valueClassName}`}>{value}</p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
};

const NotificationSummaryWidget = ({
  notifications,
}: NotificationSummaryWidgetProps) => {
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.isRead,
  ).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">Notifications</h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your notification activity.
          </p>
        </div>

        <Link
          to="/notifications"
          className="self-start text-sm font-medium text-slate-700 hover:text-slate-900 sm:shrink-0"
        >
          View all
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        <NotificationStat
          label="Total"
          value={notifications.length}
          description="Notifications available"
        />

        <NotificationStat
          label="Unread"
          value={unreadCount}
          description="Need your attention"
          valueClassName="text-blue-600"
        />

        <NotificationStat
          label="Read"
          value={readCount}
          description="Already reviewed"
          valueClassName="text-emerald-600"
        />
      </div>

      {/* Unread Action */}
      <div className="border-t border-slate-200 px-5 py-3 text-center">
        {unreadCount > 0 ? (
          <Link
            to="/notifications"
            className="block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Review unread notifications →
          </Link>
        ) : notifications.length > 0 ? (
          <Link
            to="/notifications"
            className="block text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View all notifications →
          </Link>
        ) : (
          <p className="text-sm text-slate-400">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationSummaryWidget;
