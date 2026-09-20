import { useState } from "react";

import { useChangePassword } from "@/features/auth/auth.hooks";

const SecurityPage = () => {
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });
    } catch {
      // Error is displayed through mutation state.
    }
  };

  const isSaving = changePasswordMutation.isPending;
  const passwordsMatch =
    confirmPassword.length === 0 || newPassword === confirmPassword;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Security</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account password and security.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password that you do not use elsewhere.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="current-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Current Password
            </label>

            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              New Password
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Minimum 8 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm New Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
              className={[
                "w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                passwordsMatch ? "border-slate-300" : "border-red-400",
              ].join(" ")}
            />

            {!passwordsMatch && (
              <p className="mt-1.5 text-xs text-red-600">
                Passwords do not match.
              </p>
            )}
          </div>

          {changePasswordMutation.isSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Password changed successfully. Please log in again with your new
              password.
            </div>
          )}

          {changePasswordMutation.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {changePasswordMutation.error instanceof Error
                ? changePasswordMutation.error.message
                : "Unable to change your password. Please check your current password and try again."}
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={
                isSaving ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !passwordsMatch
              }
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityPage;