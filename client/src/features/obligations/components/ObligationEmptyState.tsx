import { Link } from "react-router-dom";

const ObligationEmptyState = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
      <h3 className="font-medium text-slate-900">
        No obligations yet
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Add your first policy, EMI, subscription,
        or payment reminder.
      </p>

      <Link
        to="/obligations/new"
        className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Add Obligation
      </Link>
    </div>
  );
};

export default ObligationEmptyState;