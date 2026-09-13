interface ReminderListErrorProps {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const ReminderListError = ({
  message = "Unable to load reminders.",
  onRetry,
  isRetrying = false,
}: ReminderListErrorProps) => {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-red-700">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="shrink-0 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReminderListError;