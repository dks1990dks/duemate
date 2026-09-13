interface DashboardWidgetSkeletonProps {
  rows?: number;
}

const DashboardWidgetSkeleton = ({
  rows = 3,
}: DashboardWidgetSkeletonProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="shrink-0">
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardWidgetSkeleton;