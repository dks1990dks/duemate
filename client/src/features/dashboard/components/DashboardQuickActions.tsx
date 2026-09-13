import { Link } from "react-router-dom";

const DashboardQuickActions = () => {
  return (
    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:gap-3">
      <Link
        to="/obligations/new"
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:min-h-0 sm:flex-none sm:px-4"
      >
        + Add Obligation
      </Link>

      <Link
        to="/obligations"
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 sm:min-h-0 sm:flex-none sm:px-4"
      >
        View Obligations
      </Link>
    </div>
  );
};

export default DashboardQuickActions;