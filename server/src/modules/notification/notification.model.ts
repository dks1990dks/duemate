import { Schema, model, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reminderId: {
      type: Schema.Types.ObjectId,
      ref: "Reminder",
      required: true,
      index: true,
    },

    obligationId: {
      type: Schema.Types.ObjectId,
      ref: "Obligation",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate IN_APP notifications
// for the same reminder.
notificationSchema.index(
  {
    reminderId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

// Optimize notification list queries.
// Example: find({ userId }).sort({ createdAt: -1 })
notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

// Optimize unread count and mark-all-as-read queries.
// Example: { userId, isRead: false }
notificationSchema.index({
  userId: 1,
  isRead: 1,
});

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;

export const Notification = model("Notification", notificationSchema);
