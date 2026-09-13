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


export interface Obligation {
  _id: string;

  userId: string;

  type: ObligationType;

  title: string;

  description: string | null;

  providerName: string | null;

  accountReference: string | null;

  amount: number;

  currency: string;

  dueDate: string;

  recurrence: RecurrenceType;

  status: ObligationStatus;

  lastPaidDate: string | null;

  nextDueDate: string;

  createdAt: string;

  updatedAt: string;
}
export interface CreateObligationData {
  type: ObligationType;

  title: string;

  description?: string | null;

  providerName?: string | null;

  accountReference?: string | null;

  amount: number;

  currency?: string;

  dueDate: string;

  recurrence: RecurrenceType;
}


export interface UpdateObligationData {
  type?: ObligationType;

  title?: string;

  description?: string | null;

  providerName?: string | null;

  accountReference?: string | null;

  amount?: number;

  currency?: string;

  dueDate?: string;

  recurrence?: RecurrenceType;
}

export interface ObligationResponse {
  success: boolean;
  message: string;
  data: {
    obligation: Obligation;
  };
}

export interface ObligationsResponse {
  success: boolean;
  message: string;
  data: {
    obligations: Obligation[];
  };
}

