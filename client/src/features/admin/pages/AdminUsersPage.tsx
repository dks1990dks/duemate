import { useState } from "react";

import { useAdminUsers } from "../admin.hooks";

import AdminNavigation from "../components/AdminNavigation";

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);

  const limit = 20;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAdminUsers(page, limit);

  const formatDate = (value: string | null) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Unable to load users
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasPreviousPage = data.page > 1;
  const hasNextPage = data.page < data.totalPages;

  return (
    <div className="space-y-6">
        <AdminNavigation />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View DueMate user accounts and account status.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Total Users
        </p>

        <p className="mt-1 text-3xl font-bold text-slate-900">
          {data.total}
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Verification
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Last Login
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">
                      {user.name}
                    </div>

                    <div className="mt-0.5 text-sm text-slate-500">
                      {user.email}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.phone}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        user.role === "ADMIN"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        user.isEmailVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700",
                      ].join(" ")}
                    >
                      {user.isEmailVerified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      ].join(" ")}
                    >
                      {user.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(user.lastLoginAt)}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 lg:hidden">
        {data.users.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900">
                  {user.name}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {user.email}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {user.phone}
                </p>
              </div>

              <span
                className={[
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                  user.role === "ADMIN"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700",
                ].join(" ")}
              >
                {user.role}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-500">
                  Verification
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {user.isEmailVerified
                    ? "Verified"
                    : "Not Verified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {user.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Last Login
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formatDate(user.lastLoginAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Joined
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data.users.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-medium text-slate-900">
            No users found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            There are no user accounts on this page.
          </p>
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Page {data.page} of {data.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!hasPreviousPage}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={!hasNextPage}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;