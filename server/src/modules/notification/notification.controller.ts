import { Types } from "mongoose";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";

import {
  getReminderDeliveryHistory,
  getObligationDeliveryHistory,
} from "./notification-delivery.service.js";

import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.service.js";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pageValue = req.query.page;
    const limitValue = req.query.limit;

    const page = typeof pageValue === "string" ? Number(pageValue) : 1;

    const limit = typeof limitValue === "string" ? Number(limitValue) : 20;

    // Validate page number.
    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    // Validate limit and prevent excessive queries.
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive integer between 1 and 100",
      });
    }

    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const result = await getUserNotifications(req.user.id, page, limit);

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const count = await getUnreadNotificationCount(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Unread notification count retrieved successfully",
      data: {
        count,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notificationId = req.params.notificationId;

    if (
      !notificationId ||
      Array.isArray(notificationId) ||
      !Types.ObjectId.isValid(notificationId)
    ) {
      throw new AppError("Invalid notification ID", 400);
    }

    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const notification = await markNotificationAsRead(
      notificationId,
      req.user.id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or already read",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const result = await markAllNotificationsAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getReminderDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const userId = req.user.id;
    const { reminderId } = req.params;

    if (
      !reminderId ||
      Array.isArray(reminderId) ||
      !Types.ObjectId.isValid(reminderId)
    ) {
      throw new AppError("Invalid reminder ID", 400);
    }

    const deliveries = await getReminderDeliveryHistory(reminderId, userId);

    return res.status(200).json({
      success: true,
      message: "Reminder delivery history retrieved successfully",
      data: {
        deliveries,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getObligationDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const userId = req.user!.id;
    const { obligationId } = req.params;

    if (
      !obligationId ||
      Array.isArray(obligationId) ||
      !Types.ObjectId.isValid(obligationId)
    ) {
      throw new AppError("Invalid obligation ID", 400);
    }

    const deliveries = await getObligationDeliveryHistory(obligationId, userId);

    return res.status(200).json({
      success: true,
      message: "Obligation delivery history retrieved successfully",
      data: {
        deliveries,
      },
    });
  } catch (error) {
    return next(error);
  }
};
