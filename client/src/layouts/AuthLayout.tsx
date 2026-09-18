import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
  <img
    src="/duemate-icon.png"
    alt="DueMate"
    className="h-16 w-16 rounded-2xl object-cover"
  />

  <h1 className="mt-4 text-3xl font-bold text-slate-900">
    DueMate
  </h1>

  <p className="mt-2 text-sm text-slate-500">
    Never miss a due date.
  </p>
</div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;