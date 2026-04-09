import { useCompanyStats } from "../hooks/useCompanyStats";
import { type CompanyAdminProfile } from "../../../lib/api";
import { Building2, Users, Briefcase, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CompanyOverviewProps {
  companyAdmin: CompanyAdminProfile | null;
}

export default function CompanyOverview({ companyAdmin }: CompanyOverviewProps) {
  const companyId = companyAdmin?.companyEmployee?.company?.id;
  const companyName = companyAdmin?.companyEmployee?.company?.name || "Cég adatai";
  
  const { stats, loading, error } = useCompanyStats(companyId);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Áttekintés és statisztika
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          A(z) {companyName} alapinformációi és gyors áttekintése.
        </p>
      </header>

      {/* Rendszerszintű hiba megjelnítése */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Statisztikák betöltése sikertelen: {error}
        </div>
      )}

      {/* Summary block */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-4 mb-4">
          <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {companyName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Céges partner adminisztrációs felület
            </p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Üdvözöljük a partnercégeknek szóló adminisztrációs felületen. Ezen a nézeten kezelheti 
          cégének adatait, az önök által meghirdetett duális és szakmai gyakorlati pozíciókat, 
          valamint nyomon követheti a jelentkező hallgatókat és a sikeres partnermegállapodásokat.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-2">
              <Briefcase className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Meghirdetett pozíciók
            </h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? "..." : (stats?.positionsCount ?? "0")}
          </div>
          <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
            <Link to="/hr/job-postings" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center font-medium w-fit">
              Ugrás a pozíciókhoz <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 p-2">
              <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Összes jelentkező
            </h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? "..." : (stats?.applicationsCount ?? "0")}
          </div>
          <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
            <Link to="/hr/applications" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center font-medium w-fit">
              Mutasd a jelentkezőket <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
