import { z } from "zod";

import type { ObligationType, RecurrenceType } from "./obligation.types";

export const obligationFormSchema = z.object({
  type: z.enum([
    "INSURANCE",
    "LOAN_EMI",
    "CREDIT_CARD",
    "SUBSCRIPTION",
    "RENT",
    "TAX",
    "SCHOOL_FEE",
    "OTHER",
  ]),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  providerName: z
    .string()
    .trim()
    .max(200, "Provider name cannot exceed 200 characters")
    .optional(),

  accountReference: z
    .string()
    .trim()
    .max(200, "Account reference cannot exceed 200 characters")
    .optional(),

  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .nonnegative("Amount cannot be negative"),

  currency: z
    .string()
    .trim()
    .length(3, "Currency must be exactly 3 characters"),

  dueDate: z.string().min(1, "Due date is required"),

  recurrence: z.enum([
    "ONE_TIME",
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "HALF_YEARLY",
    "YEARLY",
  ]),
});

export type ObligationFormValues = z.infer<typeof obligationFormSchema>;

export const obligationFormDefaultValues: ObligationFormValues = {
  type: "OTHER" as ObligationType,

  title: "",

  description: "",

  providerName: "",

  accountReference: "",

  amount: 0,

  currency: "INR",

  dueDate: "",

  recurrence: "ONE_TIME" as RecurrenceType,
};
