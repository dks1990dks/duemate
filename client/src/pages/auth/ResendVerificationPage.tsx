import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  resendVerificationSchema,
  type ResendVerificationInput,
} from "@/features/auth/auth.schemas";

import {
  resendVerificationEmail,
} from "@/features/auth/auth.api";

export const ResendVerificationPage = () => {
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const mutation = useMutation({
    mutationFn: resendVerificationEmail,

    onSuccess: (response) => {
      setSuccessMessage(
        response.message ||
          "Verification email sent successfully.",
      );
    },
  });

  const onSubmit = (
    data: ResendVerificationInput,
  ) => {
    mutation.mutate(data.email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        <div>
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Resend Verification Email
          </h1>

          <p className="mt-2 text-center text-sm text-slate-600">
            Enter your email address and we'll send you
            a new verification link.
          </p>
        </div>

        {successMessage ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">
                {successMessage}
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {mutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {(mutation.error as any)?.response?.data?.message ||
                  "Unable to resend the verification email. Please try again."}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending
                ? "Sending..."
                : "Resend Verification Email"}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerificationPage;