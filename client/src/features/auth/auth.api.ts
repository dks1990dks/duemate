import api from "../../lib/api";

import type { AuthResponse, LoginInput, RegisterInput } from "./auth.types";

import type { ForgotPasswordInput, ResetPasswordInput } from "./auth.schemas";

export const registerUser = async (
  data: RegisterInput,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
};

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("/auth/me");

  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordInput) => {
  const response = await api.post("/auth/forgot-password", data);

  return response.data;
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const response = await api.post("/auth/reset-password", {
    token: data.token,
    password: data.password,
  });

  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await api.get("/auth/verify-email", {
    params: { token },
  });

  return response.data;
};

export const resendVerificationEmail = async (
  email: string,
) => {
  const response = await api.post(
    "/auth/resend-verification",
    { email },
  );

  return response.data;
};