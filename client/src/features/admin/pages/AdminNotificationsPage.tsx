import { useState } from "react";
import AdminNavigation from "../components/AdminNavigation";
import { useAdminNotifications } from "../admin.hooks";

const AdminNotificationsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } =
    useAdminNotifications(page, 20);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminNavigation />

        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <AdminNavigation />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to load notifications
          </h2>

          <button
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatAmount = (
    amount: number,
    currency: string,
  ) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  return (
    <div className="space-y-6">
      <AdminNavigation />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Notification Monitor
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Live delivery activity across all users and notification channels.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-300">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Obligation
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Channel
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Delivered
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Error
                </th>
              </tr>
            </thead>

            <tbody>
              {data.deliveries.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  {/* User */}
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">
                      {item.user.name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {item.user.email}
                    </div>

                    {item.user.phone && (
                      <div className="mt-1 text-xs text-slate-400">
                        {item.user.phone}
                      </div>
                    )}
                  </td>

                  {/* Obligation */}
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">
                      {item.obligation.title}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {item.obligation.type}
                    </div>

                    {item.obligation.providerName && (
                      <div className="mt-1 text-xs text-slate-400">
                        {item.obligation.providerName}
                      </div>
                    )}

                    <div className="mt-1 text-xs font-medium text-slate-600">
                      {formatAmount(
                        item.obligation.amount,
                        item.obligation.currency,
                      )}
                    </div>
                  </td>

                  {/* Channel */}
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {item.channel}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>

                    <div className="mt-1 text-xs text-slate-400">
                      {item.success
                        ? "Successful"
                        : "Unsuccessful"}
                    </div>
                  </td>

                  {/* Delivered */}
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatDate(item.deliveredAt)}
                  </td>

                  {/* Error */}
                  <td className="max-w-65 px-4 py-4">
                    {item.error ? (
                      <div
                        className="truncate text-sm text-red-600"
                        title={item.error}
                      >
                        {item.error}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="space-y-3 lg:hidden">
        {data.deliveries.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {/* User */}
            <div>
              <div className="font-semibold text-slate-900">
                {item.user.name}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {item.user.email}
              </div>

              {item.user.phone && (
                <div className="mt-1 text-xs text-slate-400">
                  {item.user.phone}
                </div>
              )}
            </div>

            {/* Obligation */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="text-sm font-medium text-slate-900">
                {item.obligation.title}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {item.obligation.type}
              </div>

              {item.obligation.providerName && (
                <div className="mt-1 text-xs text-slate-400">
                  {item.obligation.providerName}
                </div>
              )}

              <div className="mt-1 text-sm font-medium text-slate-700">
                {formatAmount(
                  item.obligation.amount,
                  item.obligation.currency,
                )}
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {item.channel}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                  item.status,
                )}`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Delivered: {formatDate(item.deliveredAt)}
            </div>

            {item.error && (
              <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-600">
                {item.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-slate-500">
            Page {page} of {data.totalPages}
          </span>

          <button
            disabled={page === data.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;