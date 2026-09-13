const ReminderEmptyState = () => {
  return (
    <div className="py-6 text-center">
      <p className="text-sm font-medium text-slate-700">
        No reminders available
      </p>

      <p className="mt-1 text-sm text-slate-500">
        There are currently no reminders scheduled for this obligation.
      </p>
    </div>
  );
};

export default ReminderEmptyState;
