import type {
  ReminderStatus,
} from "../reminder.types";

interface ReminderStatusBadgeProps {
  status: ReminderStatus;
}

const ReminderStatusBadge = ({
  status,
}: ReminderStatusBadgeProps) => {
  const statusStyles: Record<
    ReminderStatus,
    string
  > = {
    PENDING:
      "bg-amber-50 text-amber-700 border-amber-200",

    PROCESSING:
      "bg-blue-50 text-blue-700 border-blue-200",

    SENT:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    FAILED:
      "bg-red-50 text-red-700 border-red-200",

    CANCELLED:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const statusLabels: Record<
    ReminderStatus,
    string
  > = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SENT: "Sent",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

export default ReminderStatusBadge;