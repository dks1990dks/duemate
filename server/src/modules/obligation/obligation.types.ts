export const obligationTypes = [
  "INSURANCE",
  "LOAN_EMI",
  "CREDIT_CARD",
  "SUBSCRIPTION",
  "RENT",
  "TAX",
  "SCHOOL_FEE",
  "OTHER",
] as const;

export type ObligationType =
  (typeof obligationTypes)[number];


export const recurrenceTypes = [
  "ONE_TIME",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY",
] as const;

export type RecurrenceType =
  (typeof recurrenceTypes)[number];


export const obligationStatuses = [
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
] as const;

export type ObligationStatus =
  (typeof obligationStatuses)[number];