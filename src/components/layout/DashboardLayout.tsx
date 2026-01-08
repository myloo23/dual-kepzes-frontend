import { type ReactNode, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";

export type NavItem = {
  to: string;
  label: string;
  hint?: string;
};


export default function DashboardLayout(props: {
  roleLabel: string;
  title?: string;
  navItems: NavItem[];
  sidebarTop?: ReactNode;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userEmail = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.email ?? null;
    } catch {
      return null;
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Mobil fejléc */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{props.roleLabel}</div>
            <div className="text-sm font-semibold text-slate-900">
              {props.title ?? "Vezérlőpult"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
          >
            {mobileOpen ? "Bezár" : "Menü"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
          {/* Sidebar */}
          <aside
            className={cn(
              "rounded-2xl border border-slate-200 bg-white p-3 shadow-sm",
              mobileOpen ? "block" : "hidden",
              "lg:block"
            )}
          >
            <div className="px-2 py-2">
              <div className="text-xs text-slate-500">{props.roleLabel}</div>
              <div className="text-sm font-semibold text-slate-900">
                {props.title ?? "Vezérlőpult"}
              </div>
              {userEmail && (
                <div className="mt-1 text-xs text-slate-500">{userEmail}</div>
              )}
            </div>

            {props.sidebarTop && (
              <div className="mt-2 px-2">{props.sidebarTop}</div>
            )}

            <nav className="mt-3 space-y-1">
              {props.navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="font-medium">{item.label}</div>
                  {item.hint && (
                    <div className="text-[11px] text-slate-500">{item.hint}</div>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-3 px-2">
              <button
                onClick={logout}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Kijelentkezés
              </button>
            </div>
          </aside>

          {/* Tartalom */}
          <main className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
