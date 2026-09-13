import type {
  ObligationStatus,
  ObligationType,
  RecurrenceType,
} from "./obligation.types";

export const formatObligationType = (
  type: ObligationType,
) => {
  const labels: Record<
    ObligationType,
    string
  > = {
    INSURANCE: "Insurance",
    LOAN_EMI: "Loan / EMI",
    CREDIT_CARD: "Credit Card",
    SUBSCRIPTION: "Subscription",
    RENT: "Rent",
    TAX: "Tax",
    SCHOOL_FEE: "School Fee",
    OTHER: "Other",
  };

  return labels[type];
};

export const formatRecurrence = (
  recurrence: RecurrenceType,
) => {
  const labels: Record<
    RecurrenceType,
    string
  > = {
    ONE_TIME: "One-time",
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    HALF_YEARLY: "Half-yearly",
    YEARLY: "Yearly",
  };

  return labels[recurrence];
};

export const formatObligationStatus = (
  status: ObligationStatus,
) => {
  const labels: Record<
    ObligationStatus,
    string
  > = {
    ACTIVE: "Active",
    PAUSED: "Paused",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
  };

  return labels[status];
};

export const formatObligationDate = (
  date: string,
) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
};

export const formatObligationAmount = (
  amount: number,
  currency: string,
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    },
  ).format(amount);
};