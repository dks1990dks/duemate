import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import ResendVerificationPage from "@/pages/auth/ResendVerificationPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";
import NotFoundPage from "@/pages/NotFoundPage";

import ObligationsPage from "@/features/obligations/pages/ObligationsPage";
import CreateObligationPage from "@/features/obligations/pages/CreateObligationPage";
import ObligationDetailPage from "@/features/obligations/pages/ObligationDetailPage";
import EditObligationPage from "@/features/obligations/pages/EditObligationPage";

import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import NotificationPreferencesPage from "@/features/notification-preferences/pages/NotificationPreferencesPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import SecurityPage from "@/features/profile/pages/SecurityPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {/* Public-only authentication entry pages */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/resend-verification" element={<ResendVerificationPage />} />
        </Route>

        {/* Token/action pages remain directly accessible */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/obligations" element={<ObligationsPage />} />
          <Route path="/obligations/new" element={<CreateObligationPage />} />
          <Route path="/obligations/:id" element={<ObligationDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route
            path="/notification-preferences"
            element={<NotificationPreferencesPage />}
          />
          <Route
            path="/obligations/:id/edit"
            element={<EditObligationPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/security" element={<SecurityPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
