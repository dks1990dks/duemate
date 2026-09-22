import { NavLink } from "react-router-dom";

const AdminNavigation = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");

  return (
    <nav className="flex flex-wrap gap-2">
      <NavLink to="/admin" end className={getNavLinkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/users" className={getNavLinkClass}>
        Users
      </NavLink>

      <NavLink to="/admin/notifications" className={getNavLinkClass}>
        Notifications
      </NavLink>
    </nav>
  );
};

export default AdminNavigation;
