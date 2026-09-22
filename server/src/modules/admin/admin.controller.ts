import type { Request, Response, NextFunction } from "express";

import {
  getDashboardStats,
  getUsers,
  getNotificationDeliveries,
} from "./admin.service.js";

export const getAdminDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const result = await getUsers(page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminNotificationDeliveries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pageValue = req.query.page;
    const limitValue = req.query.limit;

    const page =
      typeof pageValue === "string"
        ? Number(pageValue)
        : 1;

    const limit =
      typeof limitValue === "string"
        ? Number(limitValue)
        : 20;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Limit must be a positive integer between 1 and 100",
      });
    }

    const result = await getNotificationDeliveries(
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin notification deliveries retrieved successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};