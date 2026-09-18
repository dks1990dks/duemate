import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Obligations", path: "/obligations" },
  { label: "Notifications", path: "/notifications" },
  {
    label: "Notification Preferences",
    path: "/notification-preferences",
  },
];

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block rounded-lg px-3 py-2.5 text-sm font-medium transition",
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
        />
      )}

      {/* Desktop + Mobile Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-64 shrink-0 border-r border-slate-200 bg-white transition-transform duration-200",
          "lg:sticky lg:z-auto lg:block lg:translate-x-0",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
  <img
    src="/duemate-icon.png"
    alt="DueMate"
    className="h-10 w-10 rounded-xl object-cover"
  />

  <div>
    <div className="text-xl font-bold text-slate-900">
      DueMate
    </div>

    <p className="mt-1 text-xs text-slate-500">
      Financial reminder manager
    </p>
  </div>
</div>
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Settings */}
          <div className="border-t border-slate-200 p-4">
            <NavLink
              to="/settings"
              className={getNavLinkClass}
              onClick={onClose}
            >
              Settings
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;