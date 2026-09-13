import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import { useLogout } from "../../features/auth/auth.hooks";
import {
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/features/notifications/notification.hooks";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  const { user, clearUser } = useAuth();
  const logoutMutation = useLogout();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: unreadCountData } = useUnreadNotificationCount();

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useNotifications();

  const markNotificationAsReadMutation = useMarkNotificationAsRead();

  const unreadCount = unreadCountData?.data.count ?? 0;
  const notifications = notificationsData?.data.notifications ?? [];

  const recentNotifications = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearUser();
      navigate("/login", { replace: true });
    }
  };

  const handleNotificationClick = async (
    notificationId?: string,
    obligationId?: string,
  ) => {
    setIsNotificationOpen(false);

    if (notificationId) {
      try {
        await markNotificationAsReadMutation.mutateAsync(notificationId);
      } catch {
        // Navigation should still happen even if marking as read fails.
      }
    }

    if (obligationId) {
      navigate(`/obligations/${obligationId}`);
      return;
    }

    navigate("/notifications");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Branding */}
      <div className="flex min-w-0 items-center gap-2">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          ☰
        </button>

        <div>
          <p className="text-sm font-medium text-slate-900">DueMate</p>

          <p className="hidden text-xs text-slate-500 sm:block">
            Never miss a due date.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification */}
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((previous) => !previous)}
            aria-label={
              unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "Notifications"
            }
            aria-expanded={isNotificationOpen}
            aria-haspopup="menu"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span aria-hidden="true" className="text-lg">
              🔔
            </span>

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div
              role="menu"
              className="fixed left-2 right-2 top-16 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-96">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Notifications
                  </p>

                  {unreadCount > 0 && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {unreadCount} unread
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleNotificationClick()}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  View all
                </button>
              </div>

              {/* Notifications */}
              <div className="max-h-96 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="space-y-3 p-4">
                    <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                ) : notificationsError ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Unable to load notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Please try again later.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/notifications")}
                      className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Open notifications
                    </button>
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      You're all caught up.
                    </p>
                  </div>
                ) : (
                  <div>
                    {recentNotifications.map((notification) => (
                      <button
                        key={notification._id}
                        type="button"
                        disabled={markNotificationAsReadMutation.isPending}
                        onClick={() =>
                          handleNotificationClick(
                            notification._id,
                            notification.obligationId,
                          )
                        }
                        className={[
                          "w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0",
                          "disabled:cursor-wait disabled:opacity-70",
                          notification.isRead
                            ? "bg-white hover:bg-slate-50"
                            : "bg-slate-50 hover:bg-slate-100",
                        ].join(" ")}
                      >
                        <div className="flex gap-3">
                          <span
                            className={[
                              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                              notification.isRead
                                ? "bg-transparent"
                                : "bg-red-500",
                            ].join(" ")}
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <p
                              className={[
                                "truncate text-sm text-slate-900",
                                notification.isRead
                                  ? "font-medium"
                                  : "font-semibold",
                              ].join(" ")}
                            >
                              {notification.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-1.5 text-[11px] text-slate-400">
                              {formatNotificationDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {recentNotifications.length > 0 && (
                <div className="border-t border-slate-200 p-2">
                  <button
                    type="button"
                    onClick={() => handleNotificationClick()}
                    className="w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
          title={user ? `${user.name} (${user.email})` : "User profile"}
        >
          {userInitial}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 sm:px-3"
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

const formatNotificationDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default Header;
