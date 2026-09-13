import { Types } from "mongoose";

import { Obligation } from "../obligation/obligation.model.js";

import type { DashboardSummary,UpcomingObligation,OverdueObligation, } from "./dashboard.types.js";

export const getDashboardSummary = async (
  userId: string,
): Promise<DashboardSummary> => {
  const now = new Date();
  const userObjectId = new Types.ObjectId(userId);
  const startOfToday = new Date(now);

  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);

  endOfToday.setHours(23, 59, 59, 999);

  const endOfWeek = new Date(startOfToday);

  endOfWeek.setDate(endOfWeek.getDate() + 7);

  endOfWeek.setHours(23, 59, 59, 999);

  const [
    activeCount,
    dueTodayCount,
    dueThisWeekCount,
    overdueCount,
    upcomingAmountResult,
  ] = await Promise.all([
    Obligation.countDocuments({
      userId,
      status: "ACTIVE",
    }),

    Obligation.countDocuments({
      userId,
      status: "ACTIVE",
      nextDueDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }),

    Obligation.countDocuments({
      userId,
      status: "ACTIVE",
      nextDueDate: {
        $gt: endOfToday,
        $lte: endOfWeek,
      },
    }),

    Obligation.countDocuments({
      userId,
      status: "ACTIVE",
      nextDueDate: {
        $lt: startOfToday,
      },
    }),

    Obligation.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: "ACTIVE",
          nextDueDate: {
            $gte: startOfToday,
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  const upcomingAmount = upcomingAmountResult[0]?.total ?? 0;

  return {
    activeCount,
    dueTodayCount,
    dueThisWeekCount,
    overdueCount,
    upcomingAmount,
  };
};

export const getUpcomingObligations = async (
  userId: string,
  limit = 5,
): Promise<UpcomingObligation[]> => {
  const startOfToday = new Date();

  startOfToday.setHours(
    0,
    0,
    0,
    0,
  );

  const obligations = await Obligation.find({
    userId,
    status: "ACTIVE",
    nextDueDate: {
      $gte: startOfToday,
    },
  })
    .select({
      title: 1,
      type: 1,
      amount: 1,
      currency: 1,
      nextDueDate: 1,
    })
    .sort({
      nextDueDate: 1,
    })
    .limit(limit)
    .lean();

  return obligations.map((obligation) => ({
    _id: obligation._id.toString(),
    title: obligation.title,
    type: obligation.type,
    amount: obligation.amount,
    currency: obligation.currency,
    nextDueDate: obligation.nextDueDate,
  }));
};

export const getOverdueObligations = async (
  userId: string,
  limit = 5,
): Promise<OverdueObligation[]> => {
  const startOfToday = new Date();

  startOfToday.setHours(
    0,
    0,
    0,
    0,
  );

  const obligations = await Obligation.find({
    userId,
    status: "ACTIVE",
    nextDueDate: {
      $lt: startOfToday,
    },
  })
    .select({
      title: 1,
      type: 1,
      amount: 1,
      currency: 1,
      nextDueDate: 1,
    })
    .sort({
      nextDueDate: 1,
    })
    .limit(limit)
    .lean();

  return obligations.map((obligation) => ({
    _id: obligation._id.toString(),
    title: obligation.title,
    type: obligation.type,
    amount: obligation.amount,
    currency: obligation.currency,
    nextDueDate: obligation.nextDueDate,
  }));
};