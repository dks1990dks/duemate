import type {
  ObligationSummary,
} from "../obligation.summary";

import {
  formatObligationAmount,
} from "../obligation.utils";

interface ObligationSummaryCardsProps {
  summary: ObligationSummary;
}

const ObligationSummaryCards = ({
  summary,
}: ObligationSummaryCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        label="Active"
        value={summary.activeCount.toString()}
      />

      <SummaryCard
        label="Due Today"
        value={summary.dueTodayCount.toString()}
      />

      <SummaryCard
        label="Due This Week"
        value={summary.dueThisWeekCount.toString()}
      />

      <SummaryCard
        label="Overdue"
        value={summary.overdueCount.toString()}
      />

      <SummaryCard
        label="Upcoming Amount"
        value={formatObligationAmount(
          summary.upcomingAmount,
          "INR",
        )}
      />
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: string;
}

const SummaryCard = ({
  label,
  value,
}: SummaryCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default ObligationSummaryCards;