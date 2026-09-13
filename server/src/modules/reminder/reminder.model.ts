import { Schema, model, type InferSchemaType } from "mongoose";

import {
  reminderChannels,
  reminderStatuses,
  reminderTriggerTypes,
} from "./reminder.constants.js";

const reminderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    obligationId: {
      type: Schema.Types.ObjectId,
      ref: "Obligation",
      required: true,
      index: true,
    },

    triggerType: {
      type: String,
      enum: reminderTriggerTypes,
      required: true,
    },

    daysOffset: {
      type: Number,
      required: true,
      min: 0,
    },

    channels: {
      type: [
        {
          type: String,
          enum: reminderChannels,
        },
      ],
      required: true,
      validate: {
        validator: (channels: string[]) => channels.length > 0,
        message: "At least one reminder channel is required",
      },
    },

    scheduledFor: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: reminderStatuses,
      default: "PENDING",
      required: true,
      index: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    sentAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: null,
      trim: true,
    },

    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    nextRetryAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

reminderSchema.index({
  status: 1,
  scheduledFor: 1,
});

reminderSchema.index({
  obligationId: 1,
  scheduledFor: 1,
});

reminderSchema.index(
  {
    userId: 1,
    obligationId: 1,
    triggerType: 1,
    daysOffset: 1,
    scheduledFor: 1,
  },
  {
    unique: true,
  },
);

export type ReminderDocument = InferSchemaType<typeof reminderSchema>;

export const Reminder = model("Reminder", reminderSchema);
