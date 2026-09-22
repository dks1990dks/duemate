import { User } from "@/models/User.js";
import { Obligation } from "@/modules/obligation/obligation.model.js";
import { Reminder } from "@/modules/reminder/reminder.model.js";
import { NotificationDelivery } from "@/modules/notification/notification-delivery.model.js";

import type {
  AdminDashboardStats,
  AdminUserListResponse,
} from "./admin.types.js";

export const getDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const now = new Date();

    const [
      totalUsers,
      activeUsers,
      totalObligations,
      upcomingReminders,
      sentNotifications,
      failedNotifications,
      notConfiguredNotifications,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        isActive: true,
      }),

      Obligation.countDocuments(),

      Reminder.countDocuments({
        status: "PENDING",
        scheduledFor: {
          $gte: now,
        },
      }),

      NotificationDelivery.countDocuments({
        status: "SENT",
      }),

      NotificationDelivery.countDocuments({
        status: "FAILED",
      }),

      NotificationDelivery.countDocuments({
        status: "NOT_CONFIGURED",
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalObligations,
      upcomingReminders,

      notificationDelivery: {
        sent: sentNotifications,
        failed: failedNotifications,
        notConfigured: notConfiguredNotifications,
      },
    };
  };

export const getUsers = async (
  page = 1,
  limit = 20,
): Promise<AdminUserListResponse> => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(
    Math.max(1, limit),
    100,
  );

  const skip = (safePage - 1) * safeLimit;

  const [users, total] = await Promise.all([
    User.find({})
      .select(
        "_id name email phone role isEmailVerified isActive lastLoginAt createdAt",
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    User.countDocuments(),
  ]);

  const totalPages = Math.ceil(
    total / safeLimit,
  );

  return {
    users: users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt ?? null,
      createdAt: user.createdAt ?? null,
    })),

    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
};

export const getNotificationDeliveries = async (
  page = 1,
  limit = 20,
) => {
  const safePage = Math.max(1, page);

  const safeLimit = Math.min(
    Math.max(1, limit),
    100,
  );

  const skip = (safePage - 1) * safeLimit;

  const [deliveries, total] = await Promise.all([
    NotificationDelivery.find({})
      .select(
        "_id userId reminderId obligationId channel status success retryable messageId error deliveredAt createdAt",
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    NotificationDelivery.countDocuments(),
  ]);

  const userIds = [
    ...new Set(
      deliveries.map((delivery) =>
        delivery.userId.toString(),
      ),
    ),
  ];

  const obligationIds = [
    ...new Set(
      deliveries.map((delivery) =>
        delivery.obligationId.toString(),
      ),
    ),
  ];

  const [users, obligations] = await Promise.all([
    User.find({
      _id: { $in: userIds },
    })
      .select("_id name email phone")
      .lean(),

    Obligation.find({
      _id: { $in: obligationIds },
    })
      .select(
        "_id title type providerName amount currency",
      )
      .lean(),
  ]);

  const userMap = new Map(
    users.map((user) => [
      user._id.toString(),
      user,
    ]),
  );

  const obligationMap = new Map(
    obligations.map((obligation) => [
      obligation._id.toString(),
      obligation,
    ]),
  );

  const totalPages = Math.ceil(
    total / safeLimit,
  );

  return {
    deliveries: deliveries.map((delivery) => {
      const user = userMap.get(
        delivery.userId.toString(),
      );

      const obligation = obligationMap.get(
        delivery.obligationId.toString(),
      );

      return {
        id: delivery._id.toString(),

        user: {
          id: delivery.userId.toString(),
          name: user?.name ?? "Unknown User",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
        },

        obligation: {
          id: delivery.obligationId.toString(),
          title:
            obligation?.title ??
            "Unknown Obligation",
          type:
            obligation?.type ??
            "UNKNOWN",
          providerName:
            obligation?.providerName ??
            null,
          amount:
            obligation?.amount ??
            0,
          currency:
            obligation?.currency ??
            "INR",
        },

        reminderId:
          delivery.reminderId.toString(),

        channel: delivery.channel,
        status: delivery.status,

        success: delivery.success,
        retryable: delivery.retryable,

        messageId:
          delivery.messageId ?? null,

        error:
          delivery.error ?? null,

        deliveredAt:
          delivery.deliveredAt ?? null,

        createdAt:
          delivery.createdAt ?? null,
      };
    }),

    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
};