import {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

import {
  obligationTypes,
  recurrenceTypes,
  obligationStatuses,
} from "./obligation.types.js";


const obligationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: obligationTypes,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    providerName: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    accountReference: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    recurrence: {
      type: String,
      enum: recurrenceTypes,
      default: "ONE_TIME",
      required: true,
    },

    status: {
      type: String,
      enum: obligationStatuses,
      default: "ACTIVE",
      required: true,
      index: true,
    },

    lastPaidDate: {
      type: Date,
      default: null,
    },

    nextDueDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);


// Main query pattern for the application:
// "Show this user's upcoming obligations"
obligationSchema.index({
  userId: 1,
  status: 1,
  nextDueDate: 1,
});


export type ObligationDocument =
  InferSchemaType<typeof obligationSchema>;


export const Obligation = model(
  "Obligation",
  obligationSchema,
);