import type {
  NotificationChannel,
} from "../notification-preference.types";

interface NotificationChannelToggleProps {
  channel: NotificationChannel;
  enabled: boolean;
  onChange: (
    channel: NotificationChannel,
    enabled: boolean,
  ) => void;
  disabled?: boolean;
}

const NotificationChannelToggle = ({
  channel,
  enabled,
  onChange,
  disabled = false,
}: NotificationChannelToggleProps) => {
  const channelLabels: Record<
    NotificationChannel,
    string
  > = {
    IN_APP: "In-App Notifications",
    EMAIL: "Email Notifications",
    SMS: "SMS Notifications",
    WHATSAPP: "WhatsApp Notifications",
  };

  const label = channelLabels[channel];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      disabled={disabled}
      onClick={() =>
        onChange(channel, !enabled)
      }
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${
        enabled
          ? "bg-slate-900"
          : "bg-slate-300"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled
            ? "translate-x-5"
            : "translate-x-0.5"
        }`}
      />
    </button>
  );
};

export default NotificationChannelToggle;