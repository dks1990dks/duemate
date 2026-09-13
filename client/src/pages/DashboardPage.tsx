import { useAuth } from "../features/auth/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back, {user?.name}
      </h1>
      <p className="mt-2 text-slate-600">
        Your personalized due date dashboard will appear here.
      </p>
    </div>
  );
};

export default DashboardPage;