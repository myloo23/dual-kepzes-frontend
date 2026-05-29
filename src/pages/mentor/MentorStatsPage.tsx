import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import {
  Users,
  CheckCircle2,
  Clock,
  Archive,
  Building,
  AlertTriangle,
  GraduationCap
} from "lucide-react";
import { companyApi } from "../../features/companies/services/companyApi";

export default function MentorStatsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, studentsData] = await Promise.all([
        api.employees.me.get(),
        api.employees.myStudents(),
      ]);

      setStudents(studentsData);

      if (profileData.companyId) {
        try {
          const comp = await companyApi.get(profileData.companyId);
          setCompanyName(comp.name);
        } catch {
          setCompanyName("Partnercég");
        }
      }
    } catch (err: unknown) {
      console.error("Hiba a statisztikák betöltésekor:", err);
      setError(
        err instanceof Error ? err.message : "Nem sikerült betölteni a statisztikai adatokat."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const totalCount = students.length;
  const activeCount = students.filter((s) => s.status === "ACTIVE").length;
  const pendingCount = students.filter(
    (s) => s.status === "PENDING_MENTOR" || s.status === "PENDING_UNIVERSITY"
  ).length;
  const finishedCount = students.filter(
    (s) => s.status === "FINISHED" || s.status === "TERMINATED"
  ).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-550 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-800 dark:text-red-400">
          Sikertelen statisztikai betöltés
        </h3>
        <p className="mt-2 text-sm text-red-650 dark:text-red-400">{error}</p>
        <button
          onClick={() => void loadData()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Újrapróbálkozás
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Header Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
              Képzési statisztikák
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              {companyName || "Partnercég"} • Szakmai mentoráltak áttekintése
            </p>
          </div>
          <button
            onClick={() => void loadData()}
            className="self-start sm:self-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          >
            Adatok frissítése
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-550 dark:text-slate-400">
              Összes hallgató
            </span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-450 block mt-1">
              hozzárendelt diák
            </span>
          </div>
        </div>

        {/* Active Students */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-550 dark:text-slate-400">
              Aktív képzés
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 block mt-1 font-medium">
              szerződött diák
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-550 dark:text-slate-400">
              Jóváhagyásra vár
            </span>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {pendingCount}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 block mt-1 font-medium">
              folyamatban lévő
            </span>
          </div>
        </div>

        {/* Completed/Terminated */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-550 dark:text-slate-400">
              Archivált képzések
            </span>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-850 p-2 text-slate-600 dark:text-slate-400">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {finishedCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-450 block mt-1">
              lezárt vagy megszakított
            </span>
          </div>
        </div>
      </section>

      {/* Visual Status Progression */}
      {totalCount > 0 && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Képzési státuszok megoszlása
            </h2>
          </div>
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {activeCount > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${(activeCount / totalCount) * 100}%` }}
                title={`Aktív: ${activeCount} fő`}
              />
            )}
            {pendingCount > 0 && (
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${(pendingCount / totalCount) * 100}%` }}
                title={`Függőben: ${pendingCount} fő`}
              />
            )}
            {finishedCount > 0 && (
              <div
                className="h-full bg-slate-400 dark:bg-slate-655 transition-all"
                style={{ width: `${(finishedCount / totalCount) * 100}%` }}
                title={`Archivált: ${finishedCount} fő`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400">Aktív ({((activeCount / totalCount) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600 dark:text-slate-400">Függőben ({((pendingCount / totalCount) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-550" />
              <span className="text-slate-600 dark:text-slate-400">Archivált ({((finishedCount / totalCount) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
