import {
  useNotifications,
  useMarkAllNotificationsAsRead,
} from "../notification.hooks";

import NotificationItem from "../components/NotificationItem";
import NotificationEmptyState from "../components/NotificationEmptyState";
import NotificationListError from "../components/NotificationListError";
import NotificationListLoading from "../components/NotificationListLoading";

const NotificationsPage = () => {
  const { data, isLoading, isError } = useNotifications();

  const notifications = data?.data.notifications ?? [];

  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch {
      // Error is handled through mutation state.
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your reminders and important events.
          </p>
        </div>

        <NotificationListLoading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your reminders and important events.
          </p>
        </div>

        <NotificationListError />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your reminders and important events.
          </p>
        </div>

        {notifications.some((notification) => !notification.isRead) && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markAllAsReadMutation.isPending
              ? "Marking..."
              : "Mark all as read"}
          </button>
        )}
      </div>
      {markAllAsReadMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm text-red-700">
            Unable to mark all notifications as read.
          </p>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
