import { Link } from "react-router-dom";

import type { UpcomingObligation } from "../dashboard.types";

import DashboardWidgetEmpty from "./DashboardWidgetEmpty";

interface UpcomingObligationsWidgetProps {
  obligations: UpcomingObligation[];
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

const formatType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const getDaysUntilDue = (date: string) => {
  const today = new Date();

  const dueDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const difference = dueDate.getTime() - today.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const getDueLabel = (daysUntilDue: number) => {
  if (daysUntilDue === 0) {
    return "Due today";
  }

  if (daysUntilDue === 1) {
    return "Due tomorrow";
  }

  if (daysUntilDue > 1) {
    return `Due in ${daysUntilDue} days`;
  }

  return "Due soon";
};

const getDueLabelClassName = (daysUntilDue: number) => {
  if (daysUntilDue === 0) {
    return "text-red-600";
  }

  if (daysUntilDue <= 3) {
    return "text-amber-600";
  }

  return "text-emerald-600";
};

const UpcomingObligationsWidget = ({
  obligations,
}: UpcomingObligationsWidgetProps) => {
  if (obligations.length === 0) {
    return (
      <DashboardWidgetEmpty
        title="No upcoming obligations"
        description="You do not have any upcoming payments or due dates at the moment."
        actionLabel="Add Obligation"
        actionTo="/obligations/new"
      />
    );
  }

  const visibleObligations = obligations.slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-slate-900">
              Upcoming Obligations
            </h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              Next {Math.min(obligations.length, 5)}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Your next scheduled payments and due dates.
          </p>
        </div>

        <Link
          to="/obligations"
          className="shrink-0 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          View all
        </Link>
      </div>

      {/* Obligations */}
      <div className="divide-y divide-slate-200">
        {visibleObligations.map((obligation) => {
          const daysUntilDue = getDaysUntilDue(obligation.nextDueDate);

          const dueLabel = getDueLabel(daysUntilDue);

          const dueLabelClassName = getDueLabelClassName(daysUntilDue);

          return (
            <Link
              key={obligation._id}
              to={`/obligations/${obligation._id}`}
              className="block px-5 py-4 transition hover:bg-slate-50"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Obligation Information */}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-slate-900">
                    {obligation.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatType(obligation.type)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(obligation.nextDueDate)}
                  </p>
                </div>

                {/* Amount + Due Status */}
                <div className="shrink-0 sm:text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatAmount(obligation.amount, obligation.currency)}
                  </p>

                  <p
                    className={`mt-1 text-xs font-medium ${dueLabelClassName}`}
                  >
                    {dueLabel}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {/* View all upcoming obligations */}
        <div className="border-t border-slate-200 px-5 py-3 text-center">
          <Link
            to="/obligations"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View all upcoming obligations →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingObligationsWidget;
