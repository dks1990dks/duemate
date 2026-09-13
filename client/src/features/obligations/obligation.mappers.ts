import type {
  Obligation,
} from "./obligation.types";

import type {
  ObligationFormValues,
} from "./obligation.form";


const toDateInputValue = (
  value: string,
): string => {
  return new Date(value)
    .toISOString()
    .split("T")[0];
};


export const mapObligationToFormValues = (
  obligation: Obligation,
): ObligationFormValues => {
  return {
    type: obligation.type,

    title: obligation.title,

    description:
      obligation.description ?? "",

    providerName:
      obligation.providerName ?? "",

    accountReference:
      obligation.accountReference ?? "",

    amount: obligation.amount,

    currency: obligation.currency,

    dueDate: toDateInputValue(
      obligation.dueDate,
    ),

    recurrence: obligation.recurrence,
  };
};