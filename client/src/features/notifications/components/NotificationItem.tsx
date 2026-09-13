import { useMarkNotificationAsRead } from "../notification.hooks";

import type { Notification } from "../notification.types";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const NotificationItem = ({
  notification,
  onClick,
}: NotificationItemProps) => {
  const markAsReadMutation =
    useMarkNotificationAsRead();

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync(
          notification._id,
        );
      } catch {
        // The notification remains unread if
        // the API request fails.
      }
    }

    onClick?.();
  };

  const content = (
    <div
      className={`p-5 transition ${
        notification.isRead
          ? "bg-white"
          : "bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {!notification.isRead && (
          <span
            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-900"
            aria-label="Unread"
          />
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-slate-900">
            {notification.title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {notification.message}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {new Date(
              notification.createdAt,
            ).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={markAsReadMutation.isPending}
      className="block w-full text-left hover:bg-slate-100 disabled:cursor-wait"
    >
      {content}
    </button>
  );
};

export default NotificationItem;