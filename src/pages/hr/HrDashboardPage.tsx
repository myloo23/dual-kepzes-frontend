import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, type Application, type ApplicationStatus, type CompanyAdminProfile, type EmployeeProfile, type Position } from "../../lib/api";
import { useAuth } from "../../features/auth";
import CompanyProfilePage from "./CompanyProfilePage";

export default function HrDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useAuth();

  const [companyAdmin, setCompanyAdmin] = useState<CompanyAdminProfile | null>(null);
  const [adminForm, setAdminForm] = useState<Partial<CompanyAdminProfile>>({});
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminDeleting, setAdminDeleting] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);

  const [positions, setPositions] = useState<Position[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [applicationsActionError, setApplicationsActionError] = useState<string | null>(null);
  const [applicationsActionId, setApplicationsActionId] = useState<string | null>(null);
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Application filtering states
  const [appStatusFilter, setAppStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appSortBy, setAppSortBy] = useState<"newest" | "oldest" | "student-asc" | "student-desc" | "position-asc">("newest");

  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path === "/hr/job-postings") return "positions";
    if (path === "/hr/applications") return "applications";
    if (path === "/hr/employees") return "employees";
    if (path === "/hr/company-profile") return "company";
    if (path === "/hr/profile") return "profile";
    const hash = location.hash;
    if (hash === "#positions") return "positions";
    if (hash === "#applications") return "applications";
    if (hash === "#employees") return "employees";
    if (hash === "#company") return "company";
    if (hash === "#profile") return "profile";
    return "overview";
  }, [location.pathname, location.hash]);

  const loadCompanyAdmin = async () => {
    setAdminLoading(true);
    setAdminError(null);
    setAdminSuccess(null);
    try {
      const data = await api.companyAdmins.me.get();
      setCompanyAdmin(data);
      setAdminForm({
        fullName: data.fullName ?? "",
        email: data.email ?? "",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a profil betöltésekor.";
      setAdminError(message);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "profile") return;
    void loadCompanyAdmin();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "positions") return;
    const load = async () => {
      setPositionsLoading(true);
      setPositionsError(null);
      try {
        const admin = companyAdmin ?? (await api.companyAdmins.me.get());
        if (!companyAdmin) setCompanyAdmin(admin);
        const list = await api.positions.listByCompany(admin.companyId);
        setPositions(Array.isArray(list) ? list : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Hiba az álláshirdetések betöltésekor.";
        setPositionsError(message);
      } finally {
        setPositionsLoading(false);
      }
    };
    void load();
  }, [activeTab, companyAdmin]);

  const loadApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const list = await api.applications.listCompany();
      setApplications(Array.isArray(list) ? list : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a jelentkezések betöltésekor.";
      setApplicationsError(message);
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "applications") return;
    void loadApplications();
  }, [activeTab]);

  const handleApplicationDecision = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    setApplicationsActionId(id);
    setApplicationsActionError(null);
    try {
      await api.applications.evaluateCompany(id, { status });
      await loadApplications();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a jelentkezés frissítésekor.";
      setApplicationsActionError(message);
    } finally {
      setApplicationsActionId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    try {
      setDeletingId(deleteConfirmId);
      setDeleteError(null);
      await api.applications.updateCompanyApplication(deleteConfirmId, {
        status: "REJECTED",
        companyNote: "Jelentkezés törölve a cég által."
      });

      // Remove the application from the list
      setApplications(prev => prev.filter(app => app.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      const errorMsg = err.message || "Hiba történt a jelentkezés törlése során.";
      setDeleteError(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
    setDeleteError(null);
  };

  // Filtered and sorted applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Status filter
    if (appStatusFilter !== "ALL") {
      filtered = filtered.filter(app => app.status === appStatusFilter);
    }

    // Search filter (student name, email, major, or position title)
    if (appSearchQuery.trim()) {
      const query = appSearchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.student?.fullName.toLowerCase().includes(query) ||
        app.student?.email.toLowerCase().includes(query) ||
        app.student?.currentMajor.toLowerCase().includes(query) ||
        app.position?.title.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (appSortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "student-asc":
          return (a.student?.fullName || "").localeCompare(b.student?.fullName || "", "hu");
        case "student-desc":
          return (b.student?.fullName || "").localeCompare(a.student?.fullName || "", "hu");
        case "position-asc":
          return (a.position?.title || "").localeCompare(b.position?.title || "", "hu");
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, appStatusFilter, appSearchQuery, appSortBy]);

  // Clear application filters
  const clearAppFilters = () => {
    setAppStatusFilter("ALL");
    setAppSearchQuery("");
    setAppSortBy("newest");
  };

  useEffect(() => {
    if (activeTab !== "employees") return;
    const load = async () => {
      setEmployeesLoading(true);
      setEmployeesError(null);
      try {
        const list = await api.employees.list();
        setEmployees(Array.isArray(list) ? list : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Hiba a munkavállalók betöltésekor.";
        setEmployeesError(message);
      } finally {
        setEmployeesLoading(false);
      }
    };
    void load();
  }, [activeTab]);

  const handleAdminChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminSave = async () => {
    setAdminSaving(true);
    setAdminError(null);
    setAdminSuccess(null);
    try {
      const updated = await api.companyAdmins.me.update({
        fullName: adminForm.fullName ?? "",
        email: adminForm.email ?? "",
      });
      setCompanyAdmin(updated);
      setAdminForm({
        fullName: updated.fullName ?? "",
        email: updated.email ?? "",
      });
      setAdminSuccess("Profil frissítve.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a mentés során.";
      setAdminError(message);
    } finally {
      setAdminSaving(false);
    }
  };

  const handleAdminDelete = async () => {
    const ok = window.confirm("Biztosan törlöd a profilodat? Ez nem visszavonható.");
    if (!ok) return;
    setAdminDeleting(true);
    setAdminError(null);
    setAdminSuccess(null);
    try {
      await api.companyAdmins.me.remove();
      authLogout();
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a profil törlése során.";
      setAdminError(message);
    } finally {
      setAdminDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {activeTab === "overview" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Cég adminisztráció</h1>
          <p className="mt-1 text-sm text-slate-600">
            Álláshirdetések, jelentkezések, munkavállalók és cégprofil kezelése egy helyen.
          </p>
        </div>
      )}

      {activeTab === "positions" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Álláshirdetések</h2>
            <p className="text-sm text-slate-600">Saját céghez tartozó pozíciók.</p>
          </div>
          {positionsLoading && <div className="text-sm text-slate-600">Betöltés...</div>}
          {positionsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {positionsError}
            </div>
          )}
          {!positionsLoading && !positionsError && positions.length === 0 && (
            <div className="text-sm text-slate-600">Nincs megjeleníthető pozíció.</div>
          )}
          <div className="grid gap-3">
            {positions.map((position) => (
              <div key={String(position.id)} className="rounded-lg border border-slate-200 p-4">
                <div className="font-semibold text-slate-900">{position.title}</div>
                <div className="text-sm text-slate-600">
                  {position.location?.city ?? "Ismeretlen város"} • {position.isDual ? "Duális" : "Nem duális"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "applications" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Jelentkezések</h2>
            <p className="text-sm text-slate-600">A céghez beérkezett jelentkezések.</p>
          </div>

          {/* Filters Section */}
          {!applicationsLoading && !applicationsError && applications.length > 0 && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Keresés hallgató neve, email, szakja vagy pozíció alapján..."
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAppStatusFilter("ALL")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${appStatusFilter === "ALL"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  Összes ({applications.length})
                </button>
                <button
                  onClick={() => setAppStatusFilter("SUBMITTED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${appStatusFilter === "SUBMITTED"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  📤 Beküldve ({applications.filter(a => a.status === "SUBMITTED").length})
                </button>
                <button
                  onClick={() => setAppStatusFilter("ACCEPTED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${appStatusFilter === "ACCEPTED"
                      ? "bg-green-600 text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  ✅ Elfogadva ({applications.filter(a => a.status === "ACCEPTED").length})
                </button>
                <button
                  onClick={() => setAppStatusFilter("REJECTED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${appStatusFilter === "REJECTED"
                      ? "bg-red-600 text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  ❌ Elutasítva ({applications.filter(a => a.status === "REJECTED").length})
                </button>
                <button
                  onClick={() => setAppStatusFilter("NO_RESPONSE")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${appStatusFilter === "NO_RESPONSE"
                      ? "bg-gray-600 text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  ⏳ Nincs válasz ({applications.filter(a => a.status === "NO_RESPONSE").length})
                </button>
              </div>

              {/* Sort and Clear */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Rendezés:</label>
                  <select
                    value={appSortBy}
                    onChange={(e) => setAppSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Legújabb először</option>
                    <option value="oldest">Legrégebbi először</option>
                    <option value="student-asc">Hallgató neve (A-Z)</option>
                    <option value="student-desc">Hallgató neve (Z-A)</option>
                    <option value="position-asc">Pozíció (A-Z)</option>
                  </select>
                </div>
                {(appStatusFilter !== "ALL" || appSearchQuery || appSortBy !== "newest") && (
                  <button
                    onClick={clearAppFilters}
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Szűrők törlése
                  </button>
                )}
              </div>

              {/* Results count */}
              <div className="text-sm text-slate-600">
                <span className="font-medium">{filteredApplications.length}</span> jelentkezés megjelenítve
                {filteredApplications.length !== applications.length && (
                  <span className="text-slate-500"> ({applications.length} összesen)</span>
                )}
              </div>
            </div>
          )}

          {applicationsLoading && <div className="text-sm text-slate-600">Betöltés...</div>}
          {applicationsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {applicationsError}
            </div>
          )}
          {applicationsActionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {applicationsActionError}
            </div>
          )}
          {!applicationsLoading && !applicationsError && applications.length === 0 && (
            <div className="text-sm text-slate-600">Nincs megjeleníthető jelentkezés.</div>
          )}

          {/* No results message */}
          {!applicationsLoading && filteredApplications.length === 0 && applications.length > 0 && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nincs találat
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Próbálj más szűrési feltételeket használni.
              </p>
              <button
                onClick={clearAppFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Szűrők törlése
              </button>
            </div>
          )}

          <div className="grid gap-3">\n            {filteredApplications.map((app) => (
            <div key={String(app.id)} className="rounded-lg border border-slate-200 p-4">
              <div className="font-semibold text-slate-900">
                {app.position?.title ?? "Pozíció"}
              </div>
              <div className="text-sm text-slate-600">
                Státusz: {app.status}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    setExpandedApplicationId((prev) =>
                      prev === String(app.id) ? null : String(app.id)
                    )
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {expandedApplicationId === String(app.id) ? "Bezárás" : "Megtekintés"}
                </button>
                <button
                  onClick={() => handleApplicationDecision(String(app.id), "ACCEPTED")}
                  disabled={applicationsActionId === String(app.id)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {applicationsActionId === String(app.id) ? "Mentés..." : "Elfogadás"}
                </button>
                <button
                  onClick={() => handleApplicationDecision(String(app.id), "REJECTED")}
                  disabled={applicationsActionId === String(app.id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  Elutasítás
                </button>
                <button
                  onClick={() => handleDeleteClick(String(app.id))}
                  disabled={deletingId === String(app.id)}
                  className="rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deletingId === String(app.id) ? "Törlés..." : "🗑️ Törlés"}
                </button>
              </div>
              {expandedApplicationId === String(app.id) && (
                <>
                  {app.student && (
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">Jelentkező adatai</div>
                      <div className="mt-1">Név: {app.student.fullName}</div>
                      <div>E-mail: {app.student.email}</div>
                      <div>Telefonszám: {app.student.phoneNumber}</div>
                      <div>Város: {app.student.city}</div>
                      <div>Szak: {app.student.currentMajor}</div>
                    </div>
                  )}
                  {!app.student && (
                    <div className="mt-4 text-sm text-slate-600">
                      A jelentkező részletes adatai nem elérhetők.
                    </div>
                  )}
                </>
              )}
              {app.companyNote && (
                <div className="mt-2 text-sm text-slate-700">Megjegyzés: {app.companyNote}</div>
              )}
            </div>
          ))}
          </div>

          {/* Delete Confirmation Dialog */}
          {deleteConfirmId && (() => {
            const app = applications.find(a => String(a.id) === deleteConfirmId);
            const isAccepted = app?.status === "ACCEPTED";
            return (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">⚠️</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Jelentkezés törlése
                    </h3>
                    <p className="text-sm text-slate-600">
                      {isAccepted
                        ? "Biztosan törlöd ezt az elfogadott jelentkezést? Ez megszakítja a duális partnerséget is."
                        : "Biztosan törlöd ezt a jelentkezést? Ez a művelet nem vonható vissza."
                      }
                    </p>
                  </div>

                  {deleteError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {deleteError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteCancel}
                      disabled={deletingId !== null}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Mégse
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={deletingId !== null}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {deletingId ? "Törlés..." : "Törlés"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "employees" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Munkavállalók</h2>
            <p className="text-sm text-slate-600">Céghez tartozó mentorok és munkatársak.</p>
          </div>
          {employeesLoading && <div className="text-sm text-slate-600">Betöltés...</div>}
          {employeesError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {employeesError}
            </div>
          )}
          {!employeesLoading && !employeesError && employees.length === 0 && (
            <div className="text-sm text-slate-600">Nincs megjeleníthető munkavállaló.</div>
          )}
          <div className="grid gap-3">
            {employees.map((emp) => (
              <div key={String(emp.id)} className="rounded-lg border border-slate-200 p-4">
                <div className="font-semibold text-slate-900">
                  {emp.fullName ?? "Munkavállaló"}
                </div>
                <div className="text-sm text-slate-600">
                  {emp.email ?? "Nincs email"}{emp.role ? ` • ${emp.role}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "company" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CompanyProfilePage />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">Saját profil</h1>
            <p className="text-sm text-slate-600">
              Itt frissítheted a cégadmin profilodat, vagy törölheted a fiókot.
            </p>
          </header>

          {adminLoading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Betöltés...
            </div>
          )}

          {!adminLoading && adminError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {adminError}
            </div>
          )}

          {!adminLoading && adminSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {adminSuccess}
            </div>
          )}

          {!adminLoading && !adminError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold text-slate-600">Név</span>
                <input
                  name="fullName"
                  value={adminForm.fullName ?? ""}
                  onChange={handleAdminChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold text-slate-600">E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={adminForm.email ?? ""}
                  onChange={handleAdminChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          )}

          {!adminLoading && (
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
              <button
                onClick={handleAdminSave}
                disabled={adminSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {adminSaving ? "Mentés..." : "Mentés"}
              </button>
              <button
                onClick={handleAdminDelete}
                disabled={adminDeleting}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {adminDeleting ? "Törlés..." : "Profil törlése"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
