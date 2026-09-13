import { useNavigate, useParams } from "react-router-dom";

import {
  useArchiveObligation,
  useMarkObligationAsPaid,
  useObligation,
  usePauseObligation,
  useResumeObligation,
} from "../obligation.hooks";
import {
  formatObligationAmount,
  formatObligationDate,
  formatObligationType,
  formatRecurrence,
  formatObligationStatus,
} from "../obligation.utils";

import ObligationStatusBadge from "../components/ObligationStatusBadge";

import { useObligationReminders } from "../../reminders/reminder.hooks";
import ReminderList from "../../reminders/components/ReminderList";

import ReminderListLoading from "../../reminders/components/ReminderListLoading";

import ReminderEmptyState from "../../reminders/components/ReminderEmptyState";

import ReminderListError from "../../reminders/components/ReminderListError";

import { useObligationDeliveryHistory } from "../../notifications/notification.hooks";

import { getApiErrorMessage } from "@/lib/api-error.utils";

const ObligationDetailPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const markPaidMutation = useMarkObligationAsPaid();

  const archiveMutation = useArchiveObligation();

  const pauseMutation = usePauseObligation();

  const resumeMutation = useResumeObligation();

  const handleMarkPaid = async () => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm("Mark this obligation as paid?");

    if (!confirmed) {
      return;
    }

    try {
      await markPaidMutation.mutateAsync(id);
    } catch {
      // Error is displayed in the page UI.
    }
  };

  const handleArchive = async () => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Archive this obligation? It will no longer appear as an active obligation. You cannot perform normal lifecycle actions after archiving.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await archiveMutation.mutateAsync(id);

      navigate("/obligations");
    } catch {
      // Error is displayed in the page UI.
    }
  };

  const handlePause = async () => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Pause this obligation? No active reminders should be sent while it is paused.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await pauseMutation.mutateAsync(id);
    } catch {
      // Error is displayed in the page UI.
    }
  };

  const handleResume = async () => {
    if (!id) {
      return;
    }

    try {
      await resumeMutation.mutateAsync(id);
    } catch {
      // Error is displayed in the page UI.
    }
  };

  const isActionPending =
    markPaidMutation.isPending ||
    archiveMutation.isPending ||
    pauseMutation.isPending ||
    resumeMutation.isPending;

  const {
    data: obligation,
    isLoading,
    isError,
    error,
  } = useObligation(id ?? "");

  const {
    data: reminders,
    isLoading: isRemindersLoading,
    isError: isRemindersError,
    error: remindersError,
    refetch: refetchReminders,
    isFetching: isRemindersFetching,
  } = useObligationReminders(id ?? "");

  const {
    data: deliveryData,
    isLoading: isDeliveryLoading,
    isError: isDeliveryError,
  } = useObligationDeliveryHistory(id);

  if (isLoading) {
    return (
      <div className="py-10 text-sm text-slate-500">Loading obligation...</div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/obligations")}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Obligations
        </button>

        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Unable to load obligation."}
          </p>
        </div>
      </div>
    );
  }

  if (!obligation) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/obligations")}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Obligations
        </button>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Obligation not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/obligations")}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Obligations
          </button>

          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            {obligation.title}
          </h1>

          <div className="mt-2">
            <ObligationStatusBadge status={obligation.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Edit */}
          {obligation.status !== "ARCHIVED" && (
            <button
              type="button"
              onClick={() => navigate(`/obligations/${id}/edit`)}
              disabled={isActionPending}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Edit
            </button>
          )}

          {/* Mark Paid */}
          {obligation.status === "ACTIVE" && (
            <button
              type="button"
              onClick={handleMarkPaid}
              disabled={isActionPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markPaidMutation.isPending ? "Marking..." : "Mark Paid"}
            </button>
          )}

          {/* Pause */}
          {obligation.status === "ACTIVE" && (
            <button
              type="button"
              onClick={handlePause}
              disabled={isActionPending}
              className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pauseMutation.isPending ? "Pausing..." : "Pause"}
            </button>
          )}

          {/* Resume */}
          {obligation.status === "PAUSED" && (
            <button
              type="button"
              onClick={handleResume}
              disabled={isActionPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resumeMutation.isPending ? "Resuming..." : "Resume"}
            </button>
          )}

          {/* Archive */}
          {obligation.status !== "ARCHIVED" && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={isActionPending}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {archiveMutation.isPending ? "Archiving..." : "Archive"}
            </button>
          )}
        </div>
      </div>
      {markPaidMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              markPaidMutation.error,
              "Unable to mark obligation as paid.",
            )}
          </p>
        </div>
      )}

      {archiveMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              archiveMutation.error,
              "Unable to archive obligation.",
            )}
          </p>
        </div>
      )}
      {pauseMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              pauseMutation.error,
              "Unable to pause obligation.",
            )}
          </p>
        </div>
      )}

      {resumeMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              resumeMutation.error,
              "Unable to resume obligation.",
            )}
          </p>
        </div>
      )}
      {/* Main Details */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Obligation Details
          </h2>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <DetailItem
            label="Type"
            value={formatObligationType(obligation.type)}
          />

          <DetailItem label="Provider" value={obligation.providerName || "—"} />

          <DetailItem
            label="Account / Reference"
            value={obligation.accountReference || "—"}
          />

          <DetailItem
            label="Amount"
            value={formatObligationAmount(
              obligation.amount,
              obligation.currency,
            )}
          />

          <DetailItem label="Currency" value={obligation.currency} />

          <DetailItem
            label="Recurrence"
            value={formatRecurrence(obligation.recurrence)}
          />
          <DetailItem
            label="Original Due Date"
            value={formatObligationDate(obligation.dueDate)}
          />

          <DetailItem
            label="Next Due Date"
            value={formatObligationDate(obligation.nextDueDate)}
          />

          <DetailItem
            label="Last Paid Date"
            value={
              obligation.lastPaidDate
                ? formatObligationDate(obligation.lastPaidDate)
                : "Not paid yet"
            }
          />

          <DetailItem
            label="Status"
            value={formatObligationStatus(obligation.status)}
          />
        </div>
      </div>

      {/* Description */}
      {obligation.description && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Description
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {obligation.description}
          </p>
        </div>
      )}

      {/* Reminders */}
      <div className="p-6">
        {isRemindersLoading ? (
          <ReminderListLoading />
        ) : isRemindersError ? (
          <ReminderListError
            message={
              remindersError instanceof Error
                ? remindersError.message
                : undefined
            }
            onRetry={() => {
              void refetchReminders();
            }}
            isRetrying={isRemindersFetching}
          />
        ) : reminders && reminders.length > 0 ? (
          <ReminderList
            reminders={reminders}
            deliveries={deliveryData?.data.deliveries ?? []}
            isDeliveryLoading={isDeliveryLoading}
            isDeliveryError={isDeliveryError}
          />
        ) : (
          <ReminderEmptyState />
        )}
      </div>
      {/* Metadata */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Record Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <DetailItem
            label="Created"
            value={formatObligationDate(obligation.createdAt)}
          />

          <DetailItem
            label="Last Updated"
            value={formatObligationDate(obligation.updatedAt)}
          />
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
};

export default ObligationDetailPage;
