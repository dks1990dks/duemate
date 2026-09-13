import { Schema, model, type InferSchemaType } from "mongoose";

const notificationDeliverySchema = new Schema(
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

    channel: {
      type: String,
      enum: ["IN_APP", "EMAIL", "SMS", "WHATSAPP"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["SENT", "FAILED", "NOT_CONFIGURED"],
      required: true,
      index: true,
    },

    success: {
      type: Boolean,
      required: true,
    },

    retryable: {
      type: Boolean,
      required: true,
      default: false,
    },

    messageId: {
      type: String,
      default: null,
      trim: true,
    },

    error: {
      type: String,
      default: null,
      trim: true,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

notificationDeliverySchema.index(
  {
    reminderId: 1,
    channel: 1,
  },
  {
    unique: true,
  },
);

notificationDeliverySchema.index({
  userId: 1,
  createdAt: -1,
});

export type NotificationDeliveryDocument = InferSchemaType<
  typeof notificationDeliverySchema
>;

export const NotificationDelivery = model(
  "NotificationDelivery",
  notificationDeliverySchema,
);
