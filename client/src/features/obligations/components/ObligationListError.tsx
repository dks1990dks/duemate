interface ObligationListErrorProps {
  message?: string;
  onRetry?: () => void;
}

const ObligationListError = ({
  message = "Something went wrong while loading your obligations.",
  onRetry,
}: ObligationListErrorProps) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="font-medium text-red-800">
        Unable to load obligations
      </h2>

      <p className="mt-1 text-sm text-red-700">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ObligationListError;