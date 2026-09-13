const ObligationListLoading = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="divide-y divide-slate-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

              <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="space-y-2 sm:text-right">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 sm:ml-auto" />

              <div className="h-3 w-36 animate-pulse rounded bg-slate-100 sm:ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObligationListLoading;