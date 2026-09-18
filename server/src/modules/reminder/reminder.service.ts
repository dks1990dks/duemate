import { Types } from "mongoose";
import { Reminder } from "./reminder.model.js";
import { Obligation } from "../obligation/obligation.model.js";
import { generateDefaultReminderSchedules } from "./reminder.scheduler.js";

import type {
  CreateReminderData,
  UpdateReminderData,
} from "./reminder.types.js";

import { REMINDER_MAX_RETRIES } from "./reminder.constants.js";

const getNextRetryAt = (retryCount: number): Date | null => {
  const retryDelaysInMinutes = [5, 15];

  const delayMinutes = retryDelaysInMinutes[retryCount - 1];

  if (delayMinutes === undefined) {
    return null;
  }

  return new Date(Date.now() + delayMinutes * 60 * 1000);
};

export const createReminder = async (
  userId: string,
  data: CreateReminderData,
) => {
  const obligation = await Obligation.findOne({
    _id: data.obligationId,
    userId,
  }).select("_id");

  if (!obligation) {
    return null;
  }

  const reminder = await Reminder.create({
    userId,
    obligationId: obligation._id,
    triggerType: data.triggerType,
    daysOffset: data.daysOffset,
    channels: data.channels,
    scheduledFor: data.scheduledFor,
    status: "PENDING",
  });

  return reminder;
};

export const getUserReminders = async (userId: string) => {
  return Reminder.find({
    userId,
  })
    .sort({
      scheduledFor: 1,
    })
    .lean();
};

export const getObligationReminders = async (
  obligationId: string,
  userId: string,
) => {
  return Reminder.find({
    obligationId,
    userId,
  })
    .sort({
      scheduledFor: 1,
    })
    .lean();
};

export const getReminderById = async (reminderId: string, userId: string) => {
  return Reminder.findOne({
    _id: reminderId,
    userId,
  }).lean();
};

export const updateReminder = async (
  reminderId: string,
  userId: string,
  data: UpdateReminderData,
) => {
  return Reminder.findOneAndUpdate(
    {
      _id: reminderId,
      userId,
    },
    {
      $set: data,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export const cancelReminder = async (reminderId: string, userId: string) => {
  return Reminder.findOneAndUpdate(
    {
      _id: reminderId,
      userId,
      status: "PENDING",
    },
    {
      $set: {
        status: "CANCELLED",
      },
    },
    {
      returnDocument: "after",
    },
  );
};

export const cancelPendingRemindersForObligation = async (
  obligationId: string,
  userId: string,
) => {
  const result = await Reminder.updateMany(
    {
      obligationId,
      userId,
      status: {
        $in: ["PENDING", "FAILED"],
      },
    },
    {
      $set: {
        status: "CANCELLED",
        nextRetryAt: null,
      },
    },
  );

  return {
    cancelledCount: result.modifiedCount,
  };
};

export const generateDefaultRemindersForObligation = async (
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

  const schedules = generateDefaultReminderSchedules(obligation.nextDueDate);

  const userObjectId = new Types.ObjectId(userId);

  const operations = schedules.map((schedule) => ({
    updateOne: {
      filter: {
        userId: userObjectId,
        obligationId: obligation._id,
        triggerType: schedule.triggerType,
        daysOffset: schedule.daysOffset,
        scheduledFor: schedule.scheduledFor,
      },

      update: {
        $set: {
          channels: schedule.channels,
        },

        $setOnInsert: {
          userId: userObjectId,
          obligationId: obligation._id,
          scheduledFor: schedule.scheduledFor,
          triggerType: schedule.triggerType,
          daysOffset: schedule.daysOffset,

          status: "PENDING" as const,
          processedAt: null,
          sentAt: null,
          failedAt: null,
          failureReason: null,
          retryCount: 0,
          nextRetryAt: null,
        },
      },

      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return {
      createdCount: 0,
      matchedCount: 0,
    };
  }

  const result = await Reminder.bulkWrite(operations);

  return {
    createdCount: result.upsertedCount,
    matchedCount: result.matchedCount,
  };
};

export const regenerateRemindersForObligation = async (
  obligationId: string,
  userId: string,
) => {
  // Cancel reminders belonging to the current/previous cycle.
  await cancelPendingRemindersForObligation(obligationId, userId);

  // Generate a completely fresh set of reminders
  // using the current obligation.nextDueDate.
  return generateDefaultRemindersForObligation(obligationId, userId);
};

export const claimReminderForProcessing = async (
  reminderId: string,
  userId: string,
) => {
  const now = new Date();

  const reminder = await Reminder.findOne({
    _id: reminderId,
    userId,
    $or: [
      {
        status: "PENDING",
        scheduledFor: {
          $lte: now,
        },
      },
      {
        status: "FAILED",
        nextRetryAt: {
          $ne: null,
          $lte: now,
        },
        retryCount: {
          $lt: REMINDER_MAX_RETRIES,
        },
      },
    ],
  });

  if (!reminder) {
    return null;
  }

  const isRetry = reminder.status === "FAILED";

  const claimedReminder = await Reminder.findOneAndUpdate(
    {
      _id: reminder._id,
      userId,
      status: reminder.status,
    },
    {
      $set: {
        status: "PROCESSING",
        processedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!claimedReminder) {
    return null;
  }

  return {
    reminder: claimedReminder,
    isRetry,
  };
};

export const markReminderAsSent = async (
  reminderId: string,
  userId: string,
) => {
  return Reminder.findOneAndUpdate(
    {
      _id: reminderId,
      userId,
      status: "PROCESSING",
    },
    {
      $set: {
        status: "SENT",
        sentAt: new Date(),
        processedAt: new Date(),
        failedAt: null,
        failureReason: null,
        nextRetryAt: null,
      },
    },
    {
      returnDocument: "after",
    },
  );
};

export const markReminderAsFailed = async (
  reminderId: string,
  userId: string,
  failureReason: string,
  shouldRetry: boolean,
) => {
  const reminder = await Reminder.findOne({
    _id: reminderId,
    userId,
    status: "PROCESSING",
  });

  if (!reminder) {
    return null;
  }

  const nextRetryCount = reminder.retryCount + 1;

  const canRetry =
  shouldRetry && nextRetryCount < REMINDER_MAX_RETRIES;

  const nextRetryAt = canRetry ? getNextRetryAt(nextRetryCount) : null;

  return Reminder.findOneAndUpdate(
    {
      _id: reminderId,
      userId,
      status: "PROCESSING",
    },
    {
      $set: {
        status: "FAILED",
        failedAt: new Date(),
        failureReason,
        nextRetryAt,
      },
      $inc: {
        retryCount: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );
};

export const retryReminder = async (reminderId: string, userId: string) => {
  return Reminder.findOneAndUpdate(
    {
      _id: reminderId,
      userId,
      status: "FAILED",
      retryCount: {
        $lt: REMINDER_MAX_RETRIES,
      },
    },
    {
      $set: {
        status: "PENDING",
        processedAt: null,
        failedAt: null,
        failureReason: null,
        nextRetryAt: null,
      },
    },
    {
      returnDocument: "after",
    },
  );
};

export const recoverStuckReminders = async (timeoutMinutes = 10) => {
  const timeoutDate = new Date(Date.now() - timeoutMinutes * 60 * 1000);

  const result = await Reminder.updateMany(
    {
      status: "PROCESSING",
      processedAt: {
        $lte: timeoutDate,
      },
    },
    {
      $set: {
        status: "PENDING",
        processedAt: null,
      },
    },
  );

  return {
    recoveredCount: result.modifiedCount,
  };
};

export const getDueRemindersForProcessing = async (limit = 50) => {
  const now = new Date();

  return Reminder.find({
    $or: [
      {
        status: "PENDING",
        scheduledFor: {
          $lte: now,
        },
      },
      {
        status: "FAILED",
        nextRetryAt: {
          $ne: null,
          $lte: now,
        },
        retryCount: {
          $lt: 3,
        },
      },
    ],
  })
    .sort({
      scheduledFor: 1,
    })
    .limit(limit);
};
