import { useAdminDashboard } from "../admin.hooks";
import AdminNavigation from "../components/AdminNavigation";

const AdminDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg">⚠️</span>

          <div>
            <h2 className="font-semibold text-red-900">
              Unable to load admin dashboard
            </h2>

            <p className="mt-1 text-sm text-red-700">Please try again.</p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: "👥",
    },
    {
      label: "Active Users",
      value: data.activeUsers,
      icon: "✓",
    },
    {
      label: "Total Obligations",
      value: data.totalObligations,
      icon: "📋",
    },
    {
      label: "Upcoming Reminders",
      value: data.upcomingReminders,
      icon: "⏰",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminNavigation />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor DueMate users, obligations, reminders and notification
          delivery.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <span className="text-lg">
  {card.icon}
</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">{card.label}</p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Notification Delivery */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <span className="text-lg">🔔</span>
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Notification Delivery
            </h2>

            <p className="text-sm text-slate-500">
              Current delivery status across notification channels.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Sent</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {data.notificationDelivery.sent}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Failed</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {data.notificationDelivery.failed}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Not Configured</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {data.notificationDelivery.notConfigured}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
