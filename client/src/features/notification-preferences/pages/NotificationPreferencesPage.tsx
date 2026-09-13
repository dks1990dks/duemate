import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../notification-preference.hooks";

import type { NotificationChannel } from "../notification-preference.types";

import NotificationChannelToggle from "../components/NotificationChannelToggle";

const NotificationPreferencesPage = () => {
  const { data, isLoading, isError } = useNotificationPreferences();

  const updatePreferencesMutation = useUpdateNotificationPreferences();

  const preferences = data?.data.preferences;

  const handleChannelChange = async (
    channel: NotificationChannel,
    enabled: boolean,
  ) => {
    try {
      await updatePreferencesMutation.mutateAsync({
        channels: {
          [channel]: enabled,
        },
      });
    } catch {
      // Error is displayed through mutation state.
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-slate-500">
          Loading notification preferences...
        </p>
      </div>
    );
  }

  if (isError || !preferences) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <p className="text-sm text-red-700">
            Unable to load notification preferences.
          </p>
        </div>
      </div>
    );
  }

  const channels = [
    {
      key: "IN_APP" as const,
      title: "In-App Notifications",
      description: "Show reminders inside DueMate.",
    },
    {
      key: "EMAIL" as const,
      title: "Email Notifications",
      description: "Receive reminders by email.",
    },
    {
      key: "SMS" as const,
      title: "SMS Notifications",
      description: "Receive reminders by SMS.",
    },
    {
      key: "WHATSAPP" as const,
      title: "WhatsApp Notifications",
      description: "Receive reminders through WhatsApp.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Notification Preferences
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Choose how you want to receive your reminders.
        </p>
      </div>
      {updatePreferencesMutation.isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm text-red-700">
            Unable to update notification preferences. Please try again.
          </p>
        </div>
      )}

      {/* Preferences */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {channels.map((channel, index) => (
          <div
            key={channel.key}
            className={`flex items-center justify-between gap-6 p-5 ${
              index !== channels.length - 1 ? "border-b border-slate-200" : ""
            }`}
          >
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">
                {channel.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {channel.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs font-medium text-slate-500">
                {updatePreferencesMutation.isPending
                  ? "Saving..."
                  : preferences.channels[channel.key]
                    ? "Enabled"
                    : "Disabled"}
              </span>

              <NotificationChannelToggle
                channel={channel.key}
                enabled={preferences.channels[channel.key]}
                onChange={handleChannelChange}
                disabled={updatePreferencesMutation.isPending}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
