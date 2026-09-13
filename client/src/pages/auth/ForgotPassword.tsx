import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/auth.schemas";
import { forgotPassword } from "@/features/auth/auth.api";

export const ForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      setSuccessMessage(res.message);
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Enter your account email address and we'll send you a password reset link.
          </p>
        </div>

        {successMessage ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-800">
                {successMessage}
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full text-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {mutation.isError && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-sm font-medium text-red-700">
                {(mutation.error as any)?.response?.data?.message ||
                  "Failed to request password reset. Please try again."}
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
                {...register("email")}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {mutation.isPending ? "Sending Link..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
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

export default ForgotPassword;