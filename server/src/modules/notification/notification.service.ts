import { env } from "../../config/env.js";
import { Notification } from "./notification.model.js";
import { User } from "../../models/User.js";
import { notificationProviders } from "./providers/provider.registry.js";
import { NotificationDelivery } from "./notification-delivery.model.js";
import type {
  CreateInAppNotificationInput,
  NotificationPayload,
} from "./notification.types.js";

import logger from "../../utils/logger.js";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const sendInAppNotification = async (payload: NotificationPayload) => {
  const data: CreateInAppNotificationInput = {
    userId: payload.userId,
    reminderId: payload.reminderId,
    obligationId: payload.obligationId,
    title: payload.title,
    message: payload.message,
  };

  const notification = await Notification.findOneAndUpdate(
    {
      userId: data.userId,
      reminderId: data.reminderId,
    },
    {
      $setOnInsert: {
        ...data,
        isRead: false,
        readAt: null,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
    },
  );

  return notification;
};

export const sendEmailNotification = async (
  payload: NotificationPayload,
): Promise<{ messageId?: string }> => {
  const user = await User.findById(payload.userId).select("name email");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.email) {
    throw new Error("User email not available");
  }

  const { obligation } = payload;

  const dueDate = obligation.dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: obligation.currency,
    maximumFractionDigits: 2,
  }).format(obligation.amount);

  const emailUserName = escapeHtml(user.name);
  const emailTitle = escapeHtml(obligation.title);
  const emailType = escapeHtml(obligation.type);
  const emailCurrency = escapeHtml(obligation.currency);
  const emailRecurrence = escapeHtml(obligation.recurrence);
  const emailDueDate = escapeHtml(dueDate);
  const emailAmount = escapeHtml(amount);
  const emailMessage = escapeHtml(payload.message);
  const emailProviderName = obligation.providerName
    ? escapeHtml(obligation.providerName)
    : "";
  const emailAccountReference = obligation.accountReference
    ? escapeHtml(obligation.accountReference)
    : "";

  const subject = `DueMate Reminder: ${obligation.title}`;

  const text = `
DueMate Reminder

Hello ${user.name},

Your upcoming obligation is due soon.

Obligation: ${obligation.title}
Type: ${obligation.type}
Due Date: ${dueDate}
Amount: ${amount}
Recurrence: ${obligation.recurrence}
${obligation.providerName ? `Provider: ${obligation.providerName}` : ""}
${obligation.accountReference ? `Account Reference: ${obligation.accountReference}` : ""}

${payload.message}

Please log in to DueMate to view the complete obligation details.

${env.clientUrl}

This is an automated reminder from DueMate.
`;

  const obligationUrl = `${env.clientUrl}/obligations/${payload.obligationId}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>DueMate Reminder</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div style="padding:32px 16px;">

    <div
      style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border-radius:12px;
        overflow:hidden;
        border:1px solid #e2e8f0;
      "
    >

      <!-- Header -->
      <div
        style="
          padding:24px;
          background:#0f172a;
        "
      >
        <div
          style="
            font-size:24px;
            font-weight:700;
            color:#ffffff;
          "
        >
          DueMate
        </div>

        <div
          style="
            margin-top:4px;
            font-size:13px;
            color:#cbd5e1;
          "
        >
          Never miss a due date.
        </div>
      </div>

      <!-- Content -->
      <div style="padding:32px 24px;">

        <h1
          style="
            margin:0;
            color:#0f172a;
            font-size:22px;
            line-height:1.4;
          "
        >
          ${emailTitle}
        </h1>

        <p
          style="
            margin:20px 0 0;
            color:#334155;
            font-size:15px;
            line-height:1.7;
          "
        >
          Hello <strong>${emailUserName}</strong>,
        </p>

        <p
          style="
            margin:16px 0 0;
            color:#475569;
            font-size:15px;
            line-height:1.7;
          "
        >
          ${emailMessage}
        </p>

        <!-- Due Date Highlight -->
        <div
          style="
            margin-top:24px;
            padding:20px;
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:10px;
            text-align:center;
          "
        >
          <div
            style="
              font-size:12px;
              color:#64748b;
              text-transform:uppercase;
              letter-spacing:0.5px;
            "
          >
            Due Date
          </div>

          <div
            style="
              margin-top:8px;
              font-size:22px;
              font-weight:700;
              color:#0f172a;
            "
          >
            ${emailDueDate}
          </div>
        </div>

        <!-- Obligation Details -->
        <div
          style="
            margin-top:20px;
            border:1px solid #e2e8f0;
            border-radius:10px;
            overflow:hidden;
          "
        >

          <div
            style="
              padding:16px 20px;
              background:#f8fafc;
              font-size:15px;
              font-weight:600;
              color:#0f172a;
              border-bottom:1px solid #e2e8f0;
            "
          >
            Obligation Details
          </div>

          <div style="padding:8px 20px 16px;">

            <div
              style="
                padding:10px 0;
                border-bottom:1px solid #f1f5f9;
              "
            >
              <span style="color:#64748b;font-size:13px;">
                Type
              </span>
              <div
                style="
                  margin-top:4px;
                  color:#0f172a;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${emailType}
              </div>
            </div>

            <div
              style="
                padding:10px 0;
                border-bottom:1px solid #f1f5f9;
              "
            >
              <span style="color:#64748b;font-size:13px;">
                Amount
              </span>
              <div
                style="
                  margin-top:4px;
                  color:#0f172a;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${emailAmount}
              </div>
            </div>

            <div
              style="
                padding:10px 0;
                border-bottom:1px solid #f1f5f9;
              "
            >
              <span style="color:#64748b;font-size:13px;">
                Recurrence
              </span>
              <div
                style="
                  margin-top:4px;
                  color:#0f172a;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${emailRecurrence}
              </div>
            </div>

            ${
              obligation.providerName
                ? `
            <div
              style="
                padding:10px 0;
                border-bottom:1px solid #f1f5f9;
              "
            >
              <span style="color:#64748b;font-size:13px;">
                Provider
              </span>
              <div
                style="
                  margin-top:4px;
                  color:#0f172a;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${emailProviderName}
              </div>
            </div>
            `
                : ""
            }

            ${
              obligation.accountReference
                ? `
            <div style="padding:10px 0 4px;">
              <span style="color:#64748b;font-size:13px;">
                Account Reference
              </span>
              <div
                style="
                  margin-top:4px;
                  color:#0f172a;
                  font-size:14px;
                  font-weight:600;
                "
              >
                ${emailAccountReference}
              </div>
            </div>
            `
                : ""
            }

          </div>
        </div>

        <!-- CTA -->
        <div
          style="
            margin-top:28px;
            text-align:center;
          "
        >
          <a
            href="${obligationUrl}"
            style="
              display:inline-block;
              padding:12px 22px;
              background:#0f172a;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-size:14px;
              font-weight:600;
            "
          >
            View Obligation
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div
        style="
          padding:20px 24px;
          background:#f8fafc;
          border-top:1px solid #e2e8f0;
        "
      >

        <p
          style="
            margin:0;
            color:#64748b;
            font-size:12px;
            line-height:1.6;
          "
        >
          This is an automated notification from DueMate.
        </p>

        <p
          style="
            margin:8px 0 0;
            color:#94a3b8;
            font-size:12px;
          "
        >
          Please do not reply to this email.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
`;

  const result = await notificationProviders.email.send({
    to: user.email,
    subject,
    text,
    html,
  });

  logger.info("[Notification] EMAIL delivered", {
    reminderId: payload.reminderId,
    userId: payload.userId,
    messageId: result.messageId,
  });
  return result;
};

export const sendSmsNotification = async (
  payload: NotificationPayload,
): Promise<{ messageId?: string }> => {
  const user = await User.findById(payload.userId).select("name email phone");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.phone) {
    throw new Error("User mobile number not available");
  }

  const result = await notificationProviders.sms.send({
    to: user.phone,
    body: `DueMate Reminder: ${payload.title}. ${payload.message}`,
  });

  logger.info("[Notification] SMS delivered", {
    reminderId: payload.reminderId,
    userId: payload.userId,
    messageId: result.messageId,
  });
  return result;
};

export const sendWhatsAppNotification = async (
  payload: NotificationPayload,
): Promise<{ messageId?: string }> => {
  const user = await User.findById(payload.userId).select(
    "name email phone",
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.phone) {
    throw new Error("User mobile number not available");
  }

  const dueDate = payload.obligation.dueDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: payload.obligation.currency,
  }).format(payload.obligation.amount);

  const result = await notificationProviders.whatsapp.send({
    to: user.phone,
    variables: {
      "1": user.name,
      "2": payload.obligation.title,
      "3": dueDate,
      "4": amount,
    },
  });

  await NotificationDelivery.findOneAndUpdate(
  {
    reminderId: payload.reminderId,
    userId: payload.userId,
    channel: "WHATSAPP",
  },
  {
    $set: {
      messageId: result.messageId ?? null,
      status: "SENT",
      success: true,
      retryable: false,
      error: null,
      deliveredAt: new Date(),
    },
  },
);

  logger.info("[Notification] WHATSAPP delivered", {
  reminderId: payload.reminderId,
  userId: payload.userId,
  messageId: result.messageId,
});

return result;
};

export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;

  const filter = {
    userId,
  };

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnreadNotificationCount = async (userId: string) => {
  return Notification.countDocuments({
    userId,
    isRead: false,
  });
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    },
  );
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return Notification.updateMany(
    {
      userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );
};
