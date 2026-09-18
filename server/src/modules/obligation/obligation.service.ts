import { Obligation } from "./obligation.model.js";
import { calculateNextDueDate } from "./obligation.recurrence.js";
import {
  cancelPendingRemindersForObligation,
  generateDefaultRemindersForObligation,
} from "../reminder/reminder.service.js";
import { regenerateRemindersForObligation } from "../reminder/reminder.service.js";
import type {
  ObligationType,
  RecurrenceType,
  ObligationStatus,
} from "./obligation.types.js";

import { AppError } from "../../utils/AppError.js";

type UpdateObligationData = {
  title?: string;
  type?: ObligationType;
  dueDate?: Date;
  amount?: number;
  currency?: string;
  recurrence?: RecurrenceType;
  description?: string;
  providerName?: string;
  accountReference?: string;
  status?: ObligationStatus;
};

export const createObligation = async (data: Record<string, unknown>) => {
  const dueDate = data.dueDate;
  const userId = data.userId;

  if (!(dueDate instanceof Date)) {
    throw new AppError("Invalid due date", 400);
  }

  if (typeof userId !== "string") {
    throw new AppError("Invalid user ID", 400);
  }

  const obligation = await Obligation.create({
    ...data,

    // Always use the authenticated user's ID.
    userId,

    // For a newly created obligation,
    // the first upcoming due date is the original due date.
    nextDueDate: dueDate,
  });

  await generateDefaultRemindersForObligation(
    obligation._id.toString(),
    userId,
  );

  return obligation;
};

export const getMyObligations = async (userId: string) => {
  const obligations = await Obligation.find({
    userId,
    status: {
      $ne: "ARCHIVED",
    },
  })
    .sort({
      nextDueDate: 1,
      createdAt: -1,
    })
    .lean();

  return obligations;
};

export const getObligationById = async (
  obligationId: string,
  userId: string,
) => {
  const obligation = await Obligation.findOne({
    _id: obligationId,
    userId,
  }).lean();

  return obligation;
};

export const updateObligation = async (
  obligationId: string,
  userId: string,
  data: UpdateObligationData,
) => {
  // Get existing obligation to detect actual changes.
  const existingObligation = await Obligation.findOne({
    _id: obligationId,
    userId,
    status: {
      $nin: ["COMPLETED", "ARCHIVED"],
    },
  });

  if (!existingObligation) {
    return null;
  }

  const dueDateChanged =
    data.dueDate !== undefined &&
    new Date(data.dueDate).getTime() !==
      new Date(existingObligation.dueDate).getTime();

  const recurrenceChanged =
    data.recurrence !== undefined &&
    data.recurrence !== existingObligation.recurrence;

  const updateData: UpdateObligationData & {
    nextDueDate?: Date;
  } = {
    ...data,
  };

  // Keep nextDueDate synchronized when dueDate changes.
  if (data.dueDate !== undefined) {
    updateData.nextDueDate = new Date(data.dueDate);
  }

  const obligation = await Obligation.findOneAndUpdate(
    {
      _id: obligationId,
      userId,
      status: {
        $nin: ["COMPLETED", "ARCHIVED"],
      },
    },
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!obligation) {
    return null;
  }

  // Regenerate reminders after the obligation is updated.
  if (dueDateChanged || recurrenceChanged) {
    await regenerateRemindersForObligation(obligation._id.toString(), userId);
  }

  return obligation;
};

export const archiveObligation = async (
  obligationId: string,
  userId: string,
) => {
  const obligation = await Obligation.findOneAndUpdate(
    {
      _id: obligationId,
      userId,
    },
    {
      $set: {
        status: "ARCHIVED",
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return obligation;
};

export const markObligationAsPaid = async (
  obligationId: string,
  userId: string,
  paymentDate: Date = new Date(),
) => {
  const obligation = await Obligation.findOne({
    _id: obligationId,
    userId,
  });

  if (!obligation) {
    return null;
  }

  if (obligation.status === "ARCHIVED") {
    return null;
  }

  // ONE_TIME obligation is permanently completed.
  if (obligation.recurrence === "ONE_TIME") {
    obligation.lastPaidDate = paymentDate;
    obligation.status = "COMPLETED";

    await obligation.save();

    // No future cycle exists, so cancel remaining reminders.
    await cancelPendingRemindersForObligation(
      obligation._id.toString(),
      userId,
    );

    return obligation;
  }

  // Recurring obligation:
  // Calculate from the existing scheduled next due date,
  // not from today's payment date.
  const nextDueDate = calculateNextDueDate(
    obligation.nextDueDate,
    obligation.recurrence,
  );

  if (!nextDueDate) {
    throw new AppError(
      "Unable to calculate next due date for recurring obligation.",
      400,
    );
  }

  obligation.lastPaidDate = paymentDate;
  obligation.nextDueDate = nextDueDate;
  obligation.status = "ACTIVE";

  await obligation.save();

  // Cancel reminders belonging to the previous cycle.
  await cancelPendingRemindersForObligation(obligation._id.toString(), userId);

  // Generate reminders for the newly advanced due cycle.
  await generateDefaultRemindersForObligation(
    obligation._id.toString(),
    userId,
  );

  return obligation;
};

export const pauseObligation = async (obligationId: string, userId: string) => {
  const obligation = await Obligation.findOne({
    _id: obligationId,
    userId,
  });

  if (!obligation) {
    return null;
  }

  // Archived obligations cannot be paused.
  if (obligation.status === "ARCHIVED") {
    return null;
  }

  // Completed one-time obligations cannot be paused.
  if (obligation.status === "COMPLETED") {
    return null;
  }

  // Already paused — return current state.
  if (obligation.status === "PAUSED") {
    return obligation;
  }

  obligation.status = "PAUSED";

  await obligation.save();

  return obligation;
};

export const resumeObligation = async (
  obligationId: string,
  userId: string,
) => {
  const obligation = await Obligation.findOne({
    _id: obligationId,
    userId,
  });

  if (!obligation) {
    return null;
  }

  // Only paused obligations can be resumed.
  if (obligation.status !== "PAUSED") {
    return null;
  }

  obligation.status = "ACTIVE";

  await obligation.save();

  return obligation;
};
