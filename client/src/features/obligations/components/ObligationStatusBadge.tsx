import type {
  ObligationStatus,
} from "../obligation.types";

import {
  formatObligationStatus,
} from "../obligation.utils";

interface ObligationStatusBadgeProps {
  status: ObligationStatus;
}

const statusClasses: Record<
  ObligationStatus,
  string
> = {
  ACTIVE:
    "border-green-200 bg-green-50 text-green-700",

  PAUSED:
    "border-amber-200 bg-amber-50 text-amber-700",

  COMPLETED:
    "border-blue-200 bg-blue-50 text-blue-700",

  ARCHIVED:
    "border-slate-200 bg-slate-100 text-slate-600",
};

const ObligationStatusBadge = ({
  status,
}: ObligationStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {formatObligationStatus(status)}
    </span>
  );
};

export default ObligationStatusBadge;