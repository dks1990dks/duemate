const NotificationEmptyState = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <span
          className="text-xl"
          aria-hidden="true"
        >
          🔔
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">
        No notifications
      </p>

      <p className="mt-1 text-sm text-slate-500">
        You don't have any notifications yet.
      </p>
    </div>
  );
};

export default NotificationEmptyState;