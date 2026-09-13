import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterFormData,
} from "../../features/auth/auth.schemas";
import { useRegister } from "../../features/auth/auth.hooks";
import { getApiErrorMessage } from "../../utils/apiError";

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);

      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      setRegistrationSuccess(true);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to create your account. Please check your details.",
        ),
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Start managing your financial due dates.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {registrationSuccess ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h2 className="text-lg font-semibold text-green-800">
            Registration Successful
          </h2>

          <p className="mt-2 text-sm leading-6 text-green-700">
            Your account has been created successfully.
          </p>

          <p className="mt-2 text-sm leading-6 text-green-700">
            A verification link has been sent to your registered email address.
            Please verify your email before signing in.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Go to Login
          </button>
        </div>
      ) : (
        // your existing form

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register("phone")}
              placeholder="9876543210"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-slate-900 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
