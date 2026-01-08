import { NavLink, Outlet, useNavigate} from "react-router-dom";
import { useState } from "react";

const navItemBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition";
const navItemInactive = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
const navItemActive = "bg-blue-50 text-blue-700 border border-blue-100";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* Mobil: menü gomb */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Admin felület</div>
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
          >
            {mobileOpen ? "Bezár" : "Menü"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)]">
          {/* Sidebar */}
          <aside
            className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ${
              mobileOpen ? "block" : "hidden"
            } lg:block`}
          >
            <div className="px-2 py-2">
              <div className="text-xs text-slate-500">ADMIN</div>
              <div className="text-sm font-semibold text-slate-900">
                Duális rendszer
              </div>
            </div>

            <nav className="mt-2 space-y-1">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Felhasználók
              </NavLink>

              <NavLink
                to="/admin/companies"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Cégek
              </NavLink>

              <NavLink
                to="/admin/positions"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Pozíciók
              </NavLink>

              <NavLink
                to="/admin/tags"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Címkék / Tag-ek
              </NavLink>

              <div className="my-3 border-t border-slate-200" />

              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Beállítások
              </NavLink>
            </nav>
                
                <div className="mt-4 border-t border-slate-200 pt-3 px-2">
              <button
                onClick={logout}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Kijelentkezés
              </button>
            </div>

            <div className="mt-4 px-2 py-2 text-[11px] text-slate-500">
              Megjegyzés: később role alapú védelem (ADMIN).
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

export default AdminLayout;
