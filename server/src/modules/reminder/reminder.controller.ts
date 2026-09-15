import type { Request, Response, NextFunction } from "express";

import {
  createReminder,
  getUserReminders,
  getObligationReminders,
  getReminderById,
  updateReminder,
  cancelReminder,
} from "./reminder.service.js";

import { processDueReminders } from "./reminder.processor.js";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const reminder = await createReminder(userId, req.body);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Obligation not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      data: {
        reminder,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const reminders = await getUserReminders(
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Reminders retrieved successfully",
      data: {
        reminders,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getByObligation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const obligationId = String(req.params.obligationId);

    const userId = req.user!.id;

    const reminders = await getObligationReminders(obligationId, userId);

    return res.status(200).json({
      success: true,
      message: "Reminders retrieved successfully",
      data: {
        reminders,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reminderId = String(req.params.reminderId);

    const userId = req.user!.id;

    const reminder = await getReminderById(reminderId, userId);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder retrieved successfully",
      data: {
        reminder,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reminderId = String(req.params.reminderId);

    const userId = req.user!.id;

    const reminder = await updateReminder(reminderId, userId, req.body);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found or cannot be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      data: {
        reminder,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const cancel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reminderId = String(req.params.reminderId);

    const userId = req.user!.id;

    const reminder = await cancelReminder(reminderId, userId);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found or cannot be cancelled",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder cancelled successfully",
      data: {
        reminder,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const processDue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await processDueReminders();

    return res.status(200).json({
      success: true,
      message: "Due reminders processed successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const processDueInternal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await processDueReminders();

    return res.status(200).json({
      success: true,
      message: "Due reminders processed successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

