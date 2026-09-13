import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
  obligationFormDefaultValues,
  obligationFormSchema,
  type ObligationFormValues,
} from "../obligation.form";

interface ObligationFormProps {
  defaultValues?: ObligationFormValues;

  onSubmit: (values: ObligationFormValues) => void | Promise<void>;

  onCancel?: () => void;

  isSubmitting?: boolean;

  submitLabel?: string;
}

const ObligationForm = ({
  defaultValues = obligationFormDefaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Obligation",
}: ObligationFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ObligationFormValues>({
    resolver: zodResolver(obligationFormSchema),

    defaultValues,
  });

  useEffect(() => {
  reset(defaultValues);
}, [defaultValues, reset]);

  const handleFormSubmit = async (values: ObligationFormValues) => {
    if (isSubmitting) {
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <fieldset disabled={isSubmitting} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Basic Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-slate-700"
              >
                Obligation Type
              </label>

              <select
                id="type"
                {...register("type")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="INSURANCE">Insurance</option>

                <option value="LOAN_EMI">Loan / EMI</option>

                <option value="CREDIT_CARD">Credit Card</option>

                <option value="SUBSCRIPTION">Subscription</option>

                <option value="RENT">Rent</option>

                <option value="TAX">Tax</option>

                <option value="SCHOOL_FEE">School Fee</option>

                <option value="OTHER">Other</option>
              </select>

              {errors.type && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="e.g. Home Loan EMI"
                {...register("title")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />

              {errors.title && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Provider */}
            <div>
              <label
                htmlFor="providerName"
                className="block text-sm font-medium text-slate-700"
              >
                Provider
              </label>

              <input
                id="providerName"
                type="text"
                placeholder="e.g. HDFC Bank"
                {...register("providerName")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />

              {errors.providerName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.providerName.message}
                </p>
              )}
            </div>

            {/* Account Reference */}
            <div>
              <label
                htmlFor="accountReference"
                className="block text-sm font-medium text-slate-700"
              >
                Account / Policy Reference
              </label>

              <input
                id="accountReference"
                type="text"
                placeholder="Optional reference number"
                {...register("accountReference")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />

              {errors.accountReference && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.accountReference.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              placeholder="Optional notes or description"
              {...register("description")}
              className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Payment Details
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-700"
              >
                Amount
              </label>

              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                {...register("amount", {
                  valueAsNumber: true,
                })}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />

              {errors.amount && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-slate-700"
              >
                Currency
              </label>

              <input
                id="currency"
                type="text"
                maxLength={3}
                placeholder="INR"
                {...register("currency")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-slate-500"
              />

              {errors.currency && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Due Schedule */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Due Schedule
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-slate-700"
              >
                First Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />

              {errors.dueDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            {/* Recurrence */}
            <div>
              <label
                htmlFor="recurrence"
                className="block text-sm font-medium text-slate-700"
              >
                Recurrence
              </label>

              <select
                id="recurrence"
                {...register("recurrence")}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="ONE_TIME">One-time</option>

                <option value="DAILY">Daily</option>

                <option value="WEEKLY">Weekly</option>

                <option value="MONTHLY">Monthly</option>

                <option value="QUARTERLY">Quarterly</option>

                <option value="HALF_YEARLY">Half-yearly</option>

                <option value="YEARLY">Yearly</option>
              </select>

              {errors.recurrence && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.recurrence.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-36 items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ObligationForm;
