import { Link } from "react-router-dom";

import type { Obligation } from "../obligation.types";

import {
  formatObligationAmount,
  formatObligationDate,
  formatObligationType,
  formatRecurrence,
} from "../obligation.utils";

import ObligationStatusBadge from "./ObligationStatusBadge";
import ObligationQuickActions from "./ObligationQuickActions";

interface ObligationListProps {
  obligations: Obligation[];
}

const ObligationList = ({ obligations }: ObligationListProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold text-slate-900">My Obligations</h2>
      </div>

      <div className="divide-y divide-slate-200">
        {obligations.map((obligation) => (
          <div
            key={obligation._id}
            className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              to={`/obligations/${obligation._id}`}
              className="min-w-0 flex-1"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-900">
                  {obligation.title}
                </h3>

                <ObligationStatusBadge status={obligation.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {formatObligationType(obligation.type)}
                {" · "}
                {formatRecurrence(obligation.recurrence)}
              </p>

              {obligation.providerName && (
                <p className="mt-1 text-sm text-slate-400">
                  {obligation.providerName}
                </p>
              )}
            </Link>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <div className="text-left sm:text-right">
                <p className="font-semibold text-slate-900">
                  {formatObligationAmount(
                    obligation.amount,
                    obligation.currency,
                  )}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Next due: {formatObligationDate(obligation.nextDueDate)}
                </p>
              </div>

              <ObligationQuickActions
                obligationId={obligation._id}
                status={obligation.status}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObligationList;
