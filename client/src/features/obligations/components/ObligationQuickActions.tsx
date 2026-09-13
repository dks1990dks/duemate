import {
  useArchiveObligation,
  usePauseObligation,
  useResumeObligation,
} from "../obligation.hooks";

import type {
  ObligationStatus,
} from "../obligation.types";

import { getApiErrorMessage } from "@/lib/api-error.utils";

interface ObligationQuickActionsProps {
  obligationId: string;
  status: ObligationStatus;
}

const ObligationQuickActions = ({
  obligationId,
  status,
}: ObligationQuickActionsProps) => {
  const pauseMutation = usePauseObligation();
  const resumeMutation = useResumeObligation();
  const archiveMutation = useArchiveObligation();

  const isPending =
    pauseMutation.isPending ||
    resumeMutation.isPending ||
    archiveMutation.isPending;

  const handlePause = async () => {
    try {
      await pauseMutation.mutateAsync(
        obligationId,
      );
    } catch {
      // Error is displayed below.
    }
  };

  const handleResume = async () => {
    try {
      await resumeMutation.mutateAsync(
        obligationId,
      );
    } catch {
      // Error is displayed below.
    }
  };

  const handleArchive = async () => {
    const confirmed = window.confirm(
      "Archive this obligation?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await archiveMutation.mutateAsync(
        obligationId,
      );
    } catch {
      // Error is displayed below.
    }
  };

  const mutationError =
    pauseMutation.error ||
    resumeMutation.error ||
    archiveMutation.error;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {status === "ACTIVE" && (
          <button
            type="button"
            onClick={handlePause}
            disabled={isPending}
            className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pauseMutation.isPending
              ? "Pausing..."
              : "Pause"}
          </button>
        )}

        {status === "PAUSED" && (
          <button
            type="button"
            onClick={handleResume}
            disabled={isPending}
            className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resumeMutation.isPending
              ? "Resuming..."
              : "Resume"}
          </button>
        )}

        {status !== "ARCHIVED" && (
          <button
            type="button"
            onClick={handleArchive}
            disabled={isPending}
            className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {archiveMutation.isPending
              ? "Archiving..."
              : "Archive"}
          </button>
        )}
      </div>

      {mutationError && (
        <p
          role="alert"
          className="max-w-xs text-right text-xs text-red-600"
        >
          {getApiErrorMessage(
            mutationError,
            "Unable to update obligation.",
          )}
        </p>
      )}
    </div>
  );
};

export default ObligationQuickActions;