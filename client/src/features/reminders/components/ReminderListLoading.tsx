const ReminderListLoading = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-lg border border-slate-200 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />

              <div className="h-3 w-48 rounded bg-slate-100" />
            </div>

            <div className="h-7 w-20 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderListLoading;