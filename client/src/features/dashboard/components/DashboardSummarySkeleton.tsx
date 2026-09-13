const DashboardSummarySkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-7 w-16 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-3 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
};

export default DashboardSummarySkeleton;