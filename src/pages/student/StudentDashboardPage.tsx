import { useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApplicationsList from "../../components/applications/ApplicationsList";

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
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

  // Determine active tab from URL hash
  const activeTab = location.hash === "#applications" ? "applications" : "overview";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500" />
            <div>
              <div className="text-sm text-slate-500">Diák felület</div>
              <div className="font-semibold text-slate-900">
                Üdv, {user?.email ?? "Hallgató"} 👋
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/positions"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Állások böngészése
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 lg:px-8 py-8 space-y-6">
        {/* TAB NAVIGATION */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <Link
              to="/student"
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Áttekintés
            </Link>
            <Link
              to="/student#applications"
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${activeTab === "applications"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Jelentkezéseim
            </Link>
          </nav>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "overview" && (
          <>
            {/* HERO CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-semibold text-slate-900">
                Kezdjük el a jelentkezést!
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Itt fogod látni a jelentkezéseidet, státuszokat, határidőket és a mentett pozíciókat.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/positions"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Elérhető pozíciók megtekintése
                </Link>

                <button
                  onClick={() => alert("Később: profil kitöltése oldal")}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Profil kitöltése
                </button>
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* My applications */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Jelentkezéseim</div>
                <p className="mt-1 text-sm text-slate-600">
                  Gyors áttekintés a jelentkezéseidről.
                </p>

                <div className="mt-4 space-y-2">
                  <Link
                    to="/student#applications"
                    className="block w-full text-left rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm hover:bg-slate-100 transition"
                  >
                    <div className="font-medium text-slate-900">Jelentkezések megtekintése →</div>
                    <div className="text-slate-600">Kattints ide a részletekért</div>
                  </Link>
                </div>
              </div>

              {/* Deadlines */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Határidők</div>
                <p className="mt-1 text-sm text-slate-600">
                  (Mock) Később ide jönnek a leadási / jelentkezési határidők.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <span className="text-slate-700">Önéletrajz frissítése</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                      jövő hét
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <span className="text-slate-700">Mentett pozíciók átnézése</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      ma
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Gyors műveletek</div>
                <p className="mt-1 text-sm text-slate-600">
                  Hasznos linkek és műveletek.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Link
                    to="/positions"
                    className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Állások böngészése →
                  </Link>

                  <Link
                    to="/student#applications"
                    className="block text-left rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Jelentkezéseim →
                  </Link>

                  <button
                    onClick={() => alert("Később: beállítások oldal")}
                    className="text-left rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Beállítások →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "applications" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ApplicationsList />
          </div>
        )}
      </main>
    </div>
  );
}
