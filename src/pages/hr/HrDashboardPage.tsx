import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, type CompanyAdminProfile } from "../../lib/api";
import CompanyProfilePage from "./CompanyProfilePage";
import HrOverview from "../../components/hr/HrOverview";
import HrPositions from "../../components/hr/HrPositions";
import HrApplications from "../../components/hr/HrApplications";
import HrEmployees from "../../components/hr/HrEmployees";
import HrProfile from "../../components/hr/HrProfile";

export default function HrDashboardPage() {
  const location = useLocation();

  const [companyAdmin, setCompanyAdmin] = useState<CompanyAdminProfile | null>(null);

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
    try {
      const data = await api.companyAdmins.me.get();
      setCompanyAdmin(data);
    } catch (err) {
      console.error("Failed to load company admin profile", err);
    }
  };

  useEffect(() => {
    // Load admin profile initially to have the data ready (e.g. companyId for positions)
    void loadCompanyAdmin();
  }, []);

  return (
    <div className="space-y-6">
      {activeTab === "overview" && <HrOverview />}
      {activeTab === "positions" && <HrPositions companyAdmin={companyAdmin} />}
      {activeTab === "applications" && <HrApplications />}
      {activeTab === "employees" && <HrEmployees />}
      {activeTab === "company" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CompanyProfilePage />
        </div>
      )}
      {activeTab === "profile" && (
        <HrProfile
          companyAdmin={companyAdmin}
          onUpdate={(updated) => setCompanyAdmin(updated)}
        />
      )}
    </div>
  );
}
