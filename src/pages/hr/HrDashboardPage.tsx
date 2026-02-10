import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, type CompanyAdminProfile } from "../../lib/api";
import CompanyProfilePage from "./CompanyProfilePage";
import HrOverview from "./components/HrOverview";
import CompanyPositionList from "../../features/positions/components/CompanyPositionList";
import CompanyApplicationList from "../../features/applications/components/CompanyApplicationList";
import CompanyEmployeeList from "../../features/companies/components/CompanyEmployeeList";
import CompanyProfileEditor from "../../features/companies/components/CompanyProfileEditor";
import CompanyPartnershipList from "../../features/partnerships/components/CompanyPartnershipList";
import { StudentList } from "../../features/students";

export default function HrDashboardPage() {
  const location = useLocation();

  const [companyAdmin, setCompanyAdmin] = useState<CompanyAdminProfile | null>(
    null,
  );

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path === "/hr/job-postings") return "positions";
    if (path === "/hr/applications") return "applications";
    if (path === "/hr/students") return "students";
    if (path === "/hr/partnerships") return "partnerships";
    if (path === "/hr/employees") return "employees";
    if (path === "/hr/company-profile") return "company";
    if (path === "/hr/profile") return "profile";
    const hash = location.hash;
    if (hash === "#positions") return "positions";
    if (hash === "#applications") return "applications";
    if (hash === "#students") return "students";
    if (hash === "#partnerships") return "partnerships";
    if (hash === "#employees") return "employees";
    if (hash === "#company") return "company";
    if (hash === "#profile") return "profile";
    return "overview";
  }, [location.pathname, location.hash]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanyAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.companyAdmins.me.get();
      setCompanyAdmin(data);
    } catch (err: any) {
      console.error("Failed to load company admin profile", err);
      // More user-friendly error message for connection issues
      if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("Network request failed")
      ) {
        setError(
          "Nem sikerült kapcsolódni a szerverhez. Ellenőrizd az internetkapcsolatot vagy próbáld újra később.",
        );
      } else {
        setError(
          "Hiba történt az adatok betöltésekor: " +
            (err.message || "Ismeretlen hiba"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load admin profile initially to have the data ready
    void loadCompanyAdmin();
  }, []);

  if (error && !companyAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
        <div className="rounded-full bg-red-50 p-3 mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Hiba történt
        </h3>
        <p className="text-slate-600 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => loadCompanyAdmin()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Újrapróbálkozás
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTab === "overview" && <HrOverview />}
      {activeTab === "positions" && (
        <>
          {loading && !companyAdmin ? (
            <div className="text-slate-600">Admin adatok betöltése...</div>
          ) : (
            <CompanyPositionList companyAdmin={companyAdmin} />
          )}
        </>
      )}
      {activeTab === "applications" && <CompanyApplicationList />}
      {activeTab === "students" && <StudentList />}
      {activeTab === "partnerships" && <CompanyPartnershipList />}
      {activeTab === "employees" && <CompanyEmployeeList />}
      {activeTab === "company" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CompanyProfilePage />
        </div>
      )}
      {activeTab === "profile" && (
        <CompanyProfileEditor
          companyAdmin={companyAdmin}
          onUpdate={(updated) => setCompanyAdmin(updated)}
        />
      )}
    </div>
  );
}
