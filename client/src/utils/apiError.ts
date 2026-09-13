import axios from "axios";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      fallback
    );
  }

  return fallback;
};