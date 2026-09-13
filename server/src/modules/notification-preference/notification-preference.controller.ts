import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getOrCreateNotificationPreferences,updateNotificationPreferences,
} from "./notification-preference.service.js";

export const getNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const preferences =
      await getOrCreateNotificationPreferences(userId);

    return res.status(200).json({
      success: true,
      message:
        "Notification preferences retrieved successfully",
      data: {
        preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotificationPreferencesHandler =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;

      const preferences =
        await updateNotificationPreferences(
          userId,
          req.body,
        );

      if (!preferences) {
        return res.status(404).json({
          success: false,
          message:
            "Notification preferences not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Notification preferences updated successfully",
        data: {
          preferences,
        },
      });
    } catch (error) {
      next(error);
    }
  };