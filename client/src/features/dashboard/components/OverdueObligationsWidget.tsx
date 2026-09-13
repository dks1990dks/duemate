import { Link } from "react-router-dom";

import type { OverdueObligation } from "../dashboard.types";

import DashboardWidgetEmpty from "./DashboardWidgetEmpty";

interface OverdueObligationsWidgetProps {
  obligations: OverdueObligation[];
}

const formatAmount = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency || "INR"} ${amount.toLocaleString("en-IN")}`;
  }
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getDaysOverdue = (nextDueDate: string) => {
  const dueDate = new Date(nextDueDate);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = today.getTime() - dueDate.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24));
};

const getRiskLabel = (daysOverdue: number) => {
  if (daysOverdue >= 30) {
    return "High risk";
  }

  if (daysOverdue >= 7) {
    return "Attention";
  }

  return "Recently overdue";
};

const getRiskClassName = (daysOverdue: number) => {
  if (daysOverdue >= 30) {
    return "bg-red-100 text-red-700";
  }

  if (daysOverdue >= 7) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
};

const getRiskSummary = (obligations: OverdueObligation[]) => {
  const maxDaysOverdue = Math.max(
    ...obligations.map((obligation) => getDaysOverdue(obligation.nextDueDate)),
  );

  if (maxDaysOverdue >= 30) {
    return "Some obligations have been overdue for more than 30 days.";
  }

  if (maxDaysOverdue >= 7) {
    return "Some overdue obligations need your attention.";
  }

  return "You have recently overdue obligations.";
};

const OverdueObligationsWidget = ({
  obligations,
}: OverdueObligationsWidgetProps) => {
  if (obligations.length === 0) {
    return (
      <DashboardWidgetEmpty
        title="No overdue obligations"
        description="Great! You are all caught up. None of your active obligations are overdue."
        actionLabel="View Obligations"
        actionTo="/obligations"
      />
    );
  }

  const visibleObligations = obligations.slice(0, 5);

  return (
    <div className="rounded-xl border border-red-200 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-red-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-red-700">Overdue Obligations</h2>

            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {obligations.length} overdue
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Payments and obligations that need attention.
          </p>

          <p className="mt-2 text-xs font-medium text-red-600">
            {getRiskSummary(obligations)}
          </p>
        </div>

        <Link
          to="/obligations"
          className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
        >
          View all
        </Link>
      </div>

      {/* Overdue Obligations */}
      <div className="divide-y divide-slate-100">
        {visibleObligations.map((obligation) => {
          const daysOverdue = getDaysOverdue(obligation.nextDueDate);

          const riskLabel = getRiskLabel(daysOverdue);

          const riskClassName = getRiskClassName(daysOverdue);

          return (
            <Link
              key={obligation._id}
              to={`/obligations/${obligation._id}`}
              className="block px-5 py-4 transition hover:bg-red-50"
            >
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Obligation Information */}
                <div className="flex min-w-0 gap-3">
                  <div
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-slate-900">
                      {obligation.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Due {formatDate(obligation.nextDueDate)}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-red-600">
                        {daysOverdue === 1
                          ? "1 day overdue"
                          : `${daysOverdue} days overdue`}
                      </span>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskClassName}`}
                      >
                        {riskLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="shrink-0 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 sm:text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatAmount(obligation.amount, obligation.currency)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">Outstanding</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All */}
      <div className="border-t border-red-100 px-5 py-3 text-center">
        <Link
          to="/obligations"
          className="block text-sm font-medium text-red-600 hover:text-red-700"
        >
          View all overdue obligations →
        </Link>
      </div>
    </div>
  );
};

export default OverdueObligationsWidget;
