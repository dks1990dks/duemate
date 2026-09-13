interface DashboardWidgetErrorProps {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const DashboardWidgetError = ({
  message = "Unable to load dashboard data.",
  onRetry,
  isRetrying = false,
}: DashboardWidgetErrorProps) => {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6"
    >
      <p className="text-sm text-red-700">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </button>
      )}
    </div>
  );
};

export default DashboardWidgetError;