import { Link } from "react-router-dom";

interface DashboardWidgetEmptyProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

const DashboardWidgetEmpty = ({
  title,
  description,
  actionLabel,
  actionTo,
}: DashboardWidgetEmptyProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default DashboardWidgetEmpty;