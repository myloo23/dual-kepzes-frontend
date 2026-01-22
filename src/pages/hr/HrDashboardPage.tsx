import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, type Application, type CompanyAdminProfile, type EmployeeProfile, type Position } from "../../lib/api";
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
                <div className="grid gap-3">
                  {applications.map((app) => (
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
