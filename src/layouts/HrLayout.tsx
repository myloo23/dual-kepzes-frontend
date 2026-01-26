import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../features/auth";

const navItemBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition";
const navItemInactive = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
const navItemActive = "bg-blue-50 text-blue-700 border border-blue-100";

export default function HrLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 lg:px-8 py-6">
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Cégadmin felület</div>
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
          >
            {mobileOpen ? "Bezár" : "Menü"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
          <aside
            className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ${mobileOpen ? "block" : "hidden"
              } lg:block`}
          >
            <div className="px-2 py-2">
              <div className="text-xs text-slate-500">CÉGADMIN</div>
              <div className="text-sm font-semibold text-slate-900">
                Duális rendszer
              </div>
            </div>

            <nav className="mt-2 space-y-1">
              <NavLink
                to="/hr"
                end
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/hr/job-postings"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Álláshirdetések
              </NavLink>
              <NavLink
                to="/hr/applications"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Jelentkezések
              </NavLink>
              <NavLink
                to="/hr/partnerships"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Partnerek
              </NavLink>
              <NavLink
                to="/hr/employees"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Munkavállalók
              </NavLink>
              <NavLink
                to="/hr/company-profile"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Cégprofil
              </NavLink>
              <NavLink
                to="/hr/profile"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Saját profil
              </NavLink>
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-3 px-2">
              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Kijelentkezés
              </button>
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
