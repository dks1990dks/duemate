import { z } from "zod";

import {
  obligationTypes,
  recurrenceTypes,
} from "./obligation.types.js";

export const createObligationSchema = z.object({
  body: z.object({
    type: z.enum(obligationTypes),

    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(200, "Title must not exceed 200 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description must not exceed 1000 characters")
      .optional()
      .nullable(),

    providerName: z
      .string()
      .trim()
      .max(200, "Provider name must not exceed 200 characters")
      .optional()
      .nullable(),

    accountReference: z
      .string()
      .trim()
      .max(200, "Account reference must not exceed 200 characters")
      .optional()
      .nullable(),

    amount: z
      .number({
        error: "Amount must be a number",
      })
      .min(0, "Amount cannot be negative"),

    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter code")
      .optional()
      .default("INR"),

    dueDate: z.coerce.date({
      error: "Invalid due date",
    }),

    recurrence: z
      .enum(recurrenceTypes)
      .optional()
      .default("ONE_TIME"),
  }),
});

export type CreateObligationInput =
  z.infer<typeof createObligationSchema>;

export const obligationIdParamsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "Invalid obligation ID",
      ),
  }),
});

export const updateObligationSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "Invalid obligation ID",
      ),
  }),

  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(
          2,
          "Title must be at least 2 characters",
        )
        .max(200, "Title is too long")
        .optional(),

      type: z
        .enum([
          "INSURANCE",
          "LOAN_EMI",
          "CREDIT_CARD",
          "SUBSCRIPTION",
          "RENT",
          "TAX",
          "SCHOOL_FEE",
          "OTHER",
        ])
        .optional(),

      description: z
        .string()
        .trim()
        .max(
          1000,
          "Description is too long",
        )
        .nullable()
        .optional(),

      providerName: z
        .string()
        .trim()
        .max(
          200,
          "Provider name is too long",
        )
        .nullable()
        .optional(),

      accountReference: z
        .string()
        .trim()
        .max(
          200,
          "Account reference is too long",
        )
        .nullable()
        .optional(),

      dueDate: z.coerce
        .date()
        .optional(),

      amount: z
        .number()
        .nonnegative(
          "Amount cannot be negative",
        )
        .optional(),

      currency: z
        .string()
        .trim()
        .length(
          3,
          "Currency must contain exactly 3 characters",
        )
        .optional(),

      recurrence: z
        .enum([
          "ONE_TIME",
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "QUARTERLY",
          "HALF_YEARLY",
          "YEARLY",
        ])
        .optional(),
    })
    .strict()
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message:
          "At least one field is required for update",
      },
    ),
});

export const markObligationAsPaidSchema =
  z.object({
    params: z.object({
      id: z
        .string()
        .regex(
          /^[a-fA-F0-9]{24}$/,
          "Invalid obligation ID",
        ),
    }),

    body: z
      .object({
        paymentDate: z
          .coerce
          .date()
          .optional(),
      })
      .optional(),
  });
  
export const pauseObligationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Obligation ID is required"),
  }),
});

export const resumeObligationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Obligation ID is required"),
  }),
});