import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getDashboardSummary, getUpcomingObligations,getOverdueObligations,
} from "./dashboard.service.js";

export const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary =
      await getDashboardSummary(
        req.user!.id,
      );

    return res.status(200).json({
      success: true,
      message:
        "Dashboard summary retrieved successfully",
      data: {
        summary,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getUpcoming = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const obligations =
      await getUpcomingObligations(
        req.user!.id,
      );

    return res.status(200).json({
      success: true,
      message:
        "Upcoming obligations retrieved successfully",
      data: {
        obligations,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getOverdue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const obligations =
      await getOverdueObligations(
        req.user!.id,
      );

    return res.status(200).json({
      success: true,
      message:
        "Overdue obligations retrieved successfully",
      data: {
        obligations,
      },
    });
  } catch (error) {
    return next(error);
  }
};