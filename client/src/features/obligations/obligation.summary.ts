import type { Obligation } from "./obligation.types";

export interface ObligationSummary {
  activeCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  overdueCount: number;
  upcomingAmount: number;
}

const getStartOfDay = (date: Date) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

const getEndOfDay = (date: Date) => {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
};

export const getObligationSummary = (
  obligations: Obligation[],
): ObligationSummary => {
  const now = new Date();

  const startOfToday = getStartOfDay(now);

  const endOfToday = getEndOfDay(now);

  const endOfWeek = new Date(startOfToday);

  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const activeObligations = obligations.filter(
    (obligation) => obligation.status === "ACTIVE",
  );

  const activeCount = activeObligations.length;

  const dueTodayCount = activeObligations.filter((obligation) => {
    const dueDate = new Date(obligation.nextDueDate);

    return dueDate >= startOfToday && dueDate <= endOfToday;
  }).length;

  const dueThisWeekCount = activeObligations.filter((obligation) => {
    const dueDate = new Date(obligation.nextDueDate);

    return dueDate > endOfToday && dueDate <= endOfWeek;
  }).length;

  const overdueCount = activeObligations.filter((obligation) => {
    const dueDate = new Date(obligation.nextDueDate);

    return dueDate < startOfToday;
  }).length;

  const upcomingAmount = activeObligations
    .filter((obligation) => {
      const dueDate = new Date(obligation.nextDueDate);

      return dueDate >= startOfToday;
    })
    .reduce((total, obligation) => total + obligation.amount, 0);

  return {
    activeCount,
    dueTodayCount,
    dueThisWeekCount,
    overdueCount,
    upcomingAmount,
  };
};
