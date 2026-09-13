import {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

const notificationPreferenceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    channels: {
      IN_APP: {
        type: Boolean,
        default: true,
      },

      EMAIL: {
        type: Boolean,
        default: false,
      },

      SMS: {
        type: Boolean,
        default: false,
      },

      WHATSAPP: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

export type NotificationPreferenceDocument =
  InferSchemaType<
    typeof notificationPreferenceSchema
  >;

export const NotificationPreference = model(
  "NotificationPreference",
  notificationPreferenceSchema,
);