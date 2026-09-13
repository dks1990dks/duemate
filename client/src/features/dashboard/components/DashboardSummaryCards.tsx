import type {
  DashboardSummary,
} from "../dashboard.types";

interface DashboardSummaryCardsProps {
  summary: DashboardSummary;
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  description: string;
  valueClassName?: string;
}

const SummaryCard = ({
  label,
  value,
  description,
  valueClassName = "text-slate-900",
}: SummaryCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-semibold ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
};

const DashboardSummaryCards = ({
  summary,
}: DashboardSummaryCardsProps) => {
  const upcomingAmount = new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    },
  ).format(summary.upcomingAmount);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        label="Active Obligations"
        value={summary.activeCount}
        description="Currently active"
      />

      <SummaryCard
        label="Due Today"
        value={summary.dueTodayCount}
        description="Requires attention today"
      />

      <SummaryCard
        label="Due This Week"
        value={summary.dueThisWeekCount}
        description="Upcoming in 7 days"
      />

      <SummaryCard
        label="Overdue"
        value={summary.overdueCount}
        description="Past due date"
        valueClassName="text-red-600"
      />

      <SummaryCard
        label="Upcoming Amount"
        value={upcomingAmount}
        description="Today and future dues"
      />
    </div>
  );
};

export default DashboardSummaryCards;