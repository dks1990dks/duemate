import type { RecurrenceType } from "./obligation.types.js";

export const calculateNextDueDate = (
  currentDueDate: Date,
  recurrence: RecurrenceType,
): Date | null => {
  const nextDate = new Date(currentDueDate);

  switch (recurrence) {
    case "DAILY":
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case "WEEKLY":
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case "QUARTERLY":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;

    case "HALF_YEARLY":
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;

    case "YEARLY":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;

    case "ONE_TIME":
      return null;

    default:
      return null;
  }

  return nextDate;
};