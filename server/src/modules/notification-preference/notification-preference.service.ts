import { Types } from "mongoose";

import {
  NotificationPreference,
} from "./notification-preference.model.js";

import type {
  NotificationChannel,
} from "../notification/notification.constants.js";

import { AppError } from "../../utils/AppError.js";

const toUserObjectId = (userId: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  return new Types.ObjectId(userId);
};

export const getOrCreateNotificationPreferences = async (
  userId: string,
) => {
  const userObjectId = toUserObjectId(userId);

  const existingPreferences =
    await NotificationPreference.findOne({
      userId: userObjectId,
    });

  if (existingPreferences) {
    return existingPreferences;
  }

  try {
    return await NotificationPreference.create({
      userId: userObjectId,
    });
  } catch (error) {
    // Another request may have created preferences
    // between findOne() and create().
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      const preferences =
        await NotificationPreference.findOne({
          userId: userObjectId,
        });

      if (preferences) {
        return preferences;
      }
    }

    throw error;
  }
};

export interface UpdateNotificationPreferencesData {
  channels?: {
    IN_APP?: boolean;
    EMAIL?: boolean;
    SMS?: boolean;
    WHATSAPP?: boolean;
  };
}

export const updateNotificationPreferences = async (
  userId: string,
  data: UpdateNotificationPreferencesData,
) => {
  const userObjectId = new Types.ObjectId(userId);

  // Ensure preferences exist before updating.
  await getOrCreateNotificationPreferences(userId);

  const preferences =
    await NotificationPreference.findOneAndUpdate(
      {
        userId: userObjectId,
      },
      {
        $set: {
          ...Object.entries(
            data.channels ?? {},
          ).reduce<Record<string, boolean>>(
            (updates, [channel, enabled]) => {
              updates[`channels.${channel}`] =
                enabled;

              return updates;
            },
            {},
          ),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

  return preferences;
};

export const getEnabledNotificationChannels = async (
  userId: string,
  requestedChannels: NotificationChannel[],
): Promise<NotificationChannel[]> => {
  const preferences =
    await getOrCreateNotificationPreferences(userId);

  const channels = preferences.channels;

  if (!channels) {
    return [];
  }

  return requestedChannels.filter(
    (channel) =>
      channels[channel] === true,
  );
};