import { z } from "zod";

export const updateNotificationPreferencesSchema =
  z.object({
    channels: z
      .object({
        IN_APP: z.boolean().optional(),
        EMAIL: z.boolean().optional(),
        SMS: z.boolean().optional(),
        WHATSAPP: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.channels !== undefined &&
      Object.keys(data.channels).length > 0,
    {
      message:
        "At least one notification channel must be provided.",
      path: ["channels"],
    },
  );

export type UpdateNotificationPreferencesInput =
  z.infer<
    typeof updateNotificationPreferencesSchema
  >;