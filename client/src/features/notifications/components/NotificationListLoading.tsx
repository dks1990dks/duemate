const NotificationListLoading = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-200">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse p-5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-slate-200" />

              <div className="flex-1 space-y-3">
                <div className="h-4 w-40 rounded bg-slate-200" />

                <div className="h-3 w-full rounded bg-slate-100" />

                <div className="h-3 w-2/3 rounded bg-slate-100" />

                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationListLoading;