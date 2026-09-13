import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-500">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-slate-600">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;