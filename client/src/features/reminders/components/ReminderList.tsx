import type { Reminder } from "../reminder.types";
import type { NotificationDelivery } from "@/features/notifications/notification.types";

import ReminderStatusBadge from "./ReminderStatusBadge";
import { useCancelReminder } from "../reminder.hooks";
import { getApiErrorMessage } from "@/lib/api-error.utils";

import NotificationDeliveryStatus from "@/features/notifications/components/NotificationDeliveryStatus";

interface ReminderListProps {
  reminders: Reminder[];
  deliveries: NotificationDelivery[];
  isDeliveryLoading: boolean;
  isDeliveryError: boolean;
}

const formatChannel = (channel: Reminder["channels"][number]) => {
  switch (channel) {
    case "IN_APP":
      return "In-App";

    case "EMAIL":
      return "Email";

    case "SMS":
      return "SMS";

    case "WHATSAPP":
      return "WhatsApp";

    default:
      return channel;
  }
};

const ReminderList = ({
  reminders,
  deliveries,
  isDeliveryLoading,
  isDeliveryError,
}: ReminderListProps) => {
  const cancelReminderMutation = useCancelReminder();

  const handleCancel = async (reminderId: string) => {
    const confirmed = window.confirm("Cancel this reminder?");

    if (!confirmed) {
      return;
    }

    try {
      await cancelReminderMutation.mutateAsync(reminderId);
    } catch {
      // Error is displayed below.
    }
  };

  return (
    <div className="space-y-3">
      {cancelReminderMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              cancelReminderMutation.error,
              "Unable to cancel reminder.",
            )}
          </p>
        </div>
      )}

      {reminders.map((reminder) => (
        <ReminderRow
          key={reminder._id}
          reminder={reminder}
          deliveries={deliveries.filter(
            (delivery) => delivery.reminderId === reminder._id,
          )}
          isDeliveryLoading={isDeliveryLoading}
          isDeliveryError={isDeliveryError}
          onCancel={handleCancel}
          isCancelling={cancelReminderMutation.isPending}
        />
      ))}
    </div>
  );
};

interface ReminderRowProps {
  reminder: Reminder;
  deliveries: NotificationDelivery[];
  isDeliveryLoading: boolean;
  isDeliveryError: boolean;
  onCancel: (reminderId: string) => void;
  isCancelling: boolean;
}

const ReminderRow = ({
  reminder,
  deliveries,
  isDeliveryLoading,
  isDeliveryError,
  onCancel,
  isCancelling,
}: ReminderRowProps) => {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {formatTriggerType(reminder.triggerType)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Scheduled for {formatReminderDate(reminder.scheduledFor)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <ReminderStatusBadge status={reminder.status} />

          <span className="text-sm text-slate-500">
            Channels: {reminder.channels.map(formatChannel).join(", ")}
          </span>

          {reminder.status === "PENDING" && (
            <button
              type="button"
              onClick={() => onCancel(reminder._id)}
              disabled={isCancelling}
              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancelling ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {/* Delivery Status */}
      {(reminder.status === "SENT" || reminder.status === "FAILED") && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          {isDeliveryLoading ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Loading delivery status...
              </p>
            </div>
          ) : isDeliveryError ? (
            <div
              role="alert"
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs text-slate-500">
                Delivery status is currently unavailable.
              </p>
            </div>
          ) : (
            <NotificationDeliveryStatus deliveries={deliveries} />
          )}
        </div>
      )}
    </div>
  );
};

const formatTriggerType = (triggerType: Reminder["triggerType"]) => {
  switch (triggerType) {
    case "BEFORE_DUE":
      return "Before Due Date";

    case "ON_DUE_DATE":
      return "On Due Date";

    case "AFTER_DUE":
      return "After Due Date";

    default:
      return triggerType;
  }
};

const formatReminderDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default ReminderList;
