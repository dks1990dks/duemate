import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  updateCurrentUser,
   changePassword,
} from "./auth.api";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateCurrentUser,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};