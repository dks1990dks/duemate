import type { NotificationDelivery } from "../notification.types";

interface NotificationDeliveryStatusProps {
  deliveries: NotificationDelivery[];
}

const channelLabels: Record<NotificationDelivery["channel"], string> = {
  IN_APP: "In-App",
  EMAIL: "Email",
  SMS: "SMS",
  WHATSAPP: "WhatsApp",
};

const statusLabels: Record<NotificationDelivery["status"], string> = {
  SENT: "Sent",
  FAILED: "Failed",
  NOT_CONFIGURED: "Not configured",
};

const getDeliveryStatusMessage = (
  delivery: NotificationDelivery,
) => {
  if (delivery.status === "SENT") {
    return null;
  }

  if (delivery.status === "NOT_CONFIGURED") {
    return "This notification channel is not configured";
  }

  switch (delivery.channel) {
    case "SMS":
      return "SMS delivery is currently unavailable";

    case "WHATSAPP":
      return "WhatsApp delivery is currently unavailable";

    case "EMAIL":
      return "Email delivery could not be completed";

    case "IN_APP":
      return "In-app delivery could not be completed";

    default:
      return "Notification delivery could not be completed";
  }
};

const NotificationDeliveryStatus = ({
  deliveries,
}: NotificationDeliveryStatusProps) => {
  if (deliveries.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          No delivery information available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Delivery Status
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {deliveries.map((delivery) => {
          const isSent = delivery.status === "SENT";
          const isFailed = delivery.status === "FAILED";

          return (
            <div
              key={delivery._id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {channelLabels[delivery.channel]}
                </p>

                {getDeliveryStatusMessage(delivery) ? (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {getDeliveryStatusMessage(delivery)}
                  </p>
                ) : delivery.deliveredAt ? (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {new Date(delivery.deliveredAt).toLocaleString("en-IN")}
                  </p>
                ) : null}
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isSent
                    ? "bg-emerald-50 text-emerald-700"
                    : isFailed
                      ? "bg-red-50 text-red-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {isSent ? "✓ " : ""}
                {statusLabels[delivery.status]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDeliveryStatus;
