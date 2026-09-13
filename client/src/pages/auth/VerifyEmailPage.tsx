import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { verifyEmail } from "../../features/auth/auth.api";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();

  const hasVerified = useRef(false);

  const [status, setStatus] = useState<VerificationStatus>("loading");

  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        setStatus("success");

        setMessage(
          response.message ?? "Your email has been verified successfully.",
        );
      } catch (error) {
        setStatus("error");

        const apiMessage =
          error && typeof error === "object" && "response" in error
            ? (
                error as {
                  response?: {
                    data?: {
                      message?: string;
                    };
                  };
                }
              ).response?.data?.message
            : undefined;

        setMessage(
          apiMessage ??
            "Verification failed. The link may be invalid or expired.",
        );
      }
    };

    void verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-slate-900">
          Email Verification
        </h1>

        {status === "loading" && (
          <p className="text-center text-slate-600">{message}</p>
        )}

        {status === "success" && (
          <div className="text-center">
            <p className="mb-6 text-green-600">{message}</p>

            <Link
              to="/login"
              className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Continue to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <p className="mb-6 text-red-600">{message}</p>

            <Link
              to="/login"
              className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
