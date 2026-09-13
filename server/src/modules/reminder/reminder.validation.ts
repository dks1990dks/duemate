import { z } from "zod";

import { reminderChannels, reminderTriggerTypes } from "./reminder.constants.js";

export const reminderRuleSchema = z
  .object({
    triggerType: z.enum(reminderTriggerTypes),
    daysOffset: z.number().int().min(0),
    channels: z
      .array(z.enum(reminderChannels))
      .min(1, "At least one reminder channel is required"),
  })
  .superRefine((data, ctx) => {
    if (data.triggerType === "ON_DUE_DATE" && data.daysOffset !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["daysOffset"],
        message: "daysOffset must be 0 for ON_DUE_DATE reminders",
      });
    }

    if (data.triggerType === "BEFORE_DUE" && data.daysOffset < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["daysOffset"],
        message: "daysOffset must be at least 1 for BEFORE_DUE reminders",
      });
    }

    if (data.triggerType === "AFTER_DUE" && data.daysOffset < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["daysOffset"],
        message: "daysOffset must be at least 1 for AFTER_DUE reminders",
      });
    }
  });

export const createReminderSchema = z.object({
  body: reminderRuleSchema.extend({
    obligationId: z.string().trim().min(1),

    scheduledFor: z.coerce.date(),
  }),
});

export const updateReminderSchema = z.object({
  body: z
    .object({
      channels: z
        .array(z.enum(reminderChannels))
        .min(1, "At least one reminder channel is required")
        .optional(),

      scheduledFor: z.coerce.date().optional(),
    })
    .strict(),

  params: z.object({
    reminderId: z.string().trim().min(1),
  }),
});

export const reminderParamsSchema = z.object({
  params: z.object({
    reminderId: z.string().trim().min(1),
  }),
});
