import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/auth.schemas";
import { resetPassword } from "@/features/auth/auth.api";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password fields for real-time requirement feedback
  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";

  // Dynamic complexity indicators
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      setSuccessMessage(res.message || "Password reset successful!");
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    mutation.mutate(data);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Invalid or Missing Token</h2>
          <p className="mt-2 text-sm text-slate-600">
            No password reset token was provided in the link. Please request a new link.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Choose a strong new password for your account.
          </p>
        </div>

        {successMessage ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-800">
                {successMessage} You can now sign in with your new password.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full text-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {mutation.isError && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-sm font-medium text-red-700">
                {(mutation.error as any)?.response?.data?.message ||
                  "Failed to reset password. Token may be expired or invalid."}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 text-sm"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {!errors.confirmPassword && confirmPassword && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      passwordsMatch ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
              <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
              <p className={hasMinLength ? "text-emerald-600 font-medium" : "text-slate-500"}>
                {hasMinLength ? "✓" : "•"} At least 8 characters
              </p>
              <p className={hasUpper ? "text-emerald-600 font-medium" : "text-slate-500"}>
                {hasUpper ? "✓" : "•"} At least one uppercase letter
              </p>
              <p className={hasLower ? "text-emerald-600 font-medium" : "text-slate-500"}>
                {hasLower ? "✓" : "•"} At least one lowercase letter
              </p>
              <p className={hasNumber ? "text-emerald-600 font-medium" : "text-slate-500"}>
                {hasNumber ? "✓" : "•"} At least one number
              </p>
              <p className={hasSpecial ? "text-emerald-600 font-medium" : "text-slate-500"}>
                {hasSpecial ? "✓" : "•"} At least one special character
              </p>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {mutation.isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;