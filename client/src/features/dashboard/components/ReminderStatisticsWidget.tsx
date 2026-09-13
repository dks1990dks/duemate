import type { Reminder } from "@/features/reminders/reminder.types";

interface ReminderStatisticsWidgetProps {
  reminders: Reminder[];
}

interface ReminderStatProps {
  label: string;
  value: number;
  description: string;
  valueClassName?: string;
}

const ReminderStat = ({
  label,
  value,
  description,
  valueClassName = "text-slate-900",
}: ReminderStatProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-semibold ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
};

const ReminderStatisticsWidget = ({
  reminders,
}: ReminderStatisticsWidgetProps) => {
  const pendingCount = reminders.filter(
    (reminder) => reminder.status === "PENDING",
  ).length;

  const sentCount = reminders.filter(
    (reminder) => reminder.status === "SENT",
  ).length;

  const failedCount = reminders.filter(
    (reminder) => reminder.status === "FAILED",
  ).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold text-slate-900">
          Reminder Statistics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your configured reminder activity.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        <ReminderStat
          label="Pending"
          value={pendingCount}
          description="Scheduled for processing"
        />

        <ReminderStat
          label="Sent"
          value={sentCount}
          description="Successfully processed"
          valueClassName="text-emerald-600"
        />

        <ReminderStat
          label="Failed"
          value={failedCount}
          description="Need attention"
          valueClassName="text-red-600"
        />
      </div>
    </div>
  );
};

export default ReminderStatisticsWidget;