import type { RecurrenceType } from "./obligation.types.js";

const getDaysInMonth = (
  year: number,
  month: number,
): number => {
  return new Date(
    year,
    month + 1,
    0,
  ).getDate();
};

const addMonthsSafely = (
  date: Date,
  monthsToAdd: number,
): Date => {
  const nextDate = new Date(date);

  const originalDay = nextDate.getDate();

  // Prevent JavaScript date overflow while changing month.
  nextDate.setDate(1);

  nextDate.setMonth(
    nextDate.getMonth() + monthsToAdd,
  );

  const daysInTargetMonth = getDaysInMonth(
    nextDate.getFullYear(),
    nextDate.getMonth(),
  );

  nextDate.setDate(
    Math.min(
      originalDay,
      daysInTargetMonth,
    ),
  );

  return nextDate;
};

const addYearsSafely = (
  date: Date,
  yearsToAdd: number,
): Date => {
  return addMonthsSafely(
    date,
    yearsToAdd * 12,
  );
};

export const calculateNextDueDate = (
  currentDueDate: Date,
  recurrence: RecurrenceType,
): Date | null => {
  switch (recurrence) {
    case "ONE_TIME":
      return null;

    case "DAILY": {
      const nextDate = new Date(currentDueDate);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    }

    case "WEEKLY": {
      const nextDate = new Date(currentDueDate);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    }

    case "MONTHLY":
      return addMonthsSafely(
        currentDueDate,
        1,
      );

    case "QUARTERLY":
      return addMonthsSafely(
        currentDueDate,
        3,
      );

    case "HALF_YEARLY":
      return addMonthsSafely(
        currentDueDate,
        6,
      );

    case "YEARLY":
      return addYearsSafely(
        currentDueDate,
        1,
      );

    default: {
      const exhaustiveCheck: never = recurrence;

      throw new Error(
        `Unsupported recurrence type: ${exhaustiveCheck}`,
      );
    }
  }
};

