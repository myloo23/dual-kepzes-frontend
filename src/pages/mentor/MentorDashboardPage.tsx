import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { EmployeeProfile } from "../../types/api.types";
import {
  Users,
  CheckCircle2,
  Clock,
  Archive,
  Mail,
  Phone,
  User,
  GraduationCap,
  Calendar,
  Building
} from "lucide-react";

export default function MentorDashboardPage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, studentsData] = await Promise.all([
        api.employees.me.get(),
        api.employees.myStudents(),
      ]);
      setProfile(profileData);
      setStudents(studentsData);
    } catch (err: unknown) {
      console.error("Hiba az irányítópult betöltésekor:", err);
      setError(
        err instanceof Error ? err.message : "Nem sikerült betölteni az adatokat."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  // Calculate statistics
  const totalCount = students.length;
  const activeCount = students.filter((s) => s.status === "ACTIVE").length;
  const pendingCount = students.filter(
    (s) => s.status === "PENDING_MENTOR" || s.status === "PENDING_UNIVERSITY"
  ).length;
  const finishedCount = students.filter(
    (s) => s.status === "FINISHED" || s.status === "TERMINATED"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
            Aktív
          </span>
        );
      case "PENDING_MENTOR":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
            Mentor kijelölésre vár
          </span>
        );
      case "PENDING_UNIVERSITY":
        return (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20">
            Egyetemi jóváhagyásra vár
          </span>
        );
      case "FINISHED":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
            Lezárt
          </span>
        );
      case "TERMINATED":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
            Megszakított
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
          Sikertelen adatbetöltés
        </h3>
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
        <button
          onClick={() => void loadDashboardData()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Újrapróbálkozás
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
              Üdvözöljük, {profile?.user?.fullName || "Mentor"}!
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              Mentori irányítópult • {profile?.jobTitle || "Szakmai mentor"}
            </p>
          </div>
          <button
            onClick={() => void loadDashboardData()}
            className="self-start sm:self-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
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
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Összes hallgató
            </span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {totalCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              hozzárendelt diák
            </span>
          </div>
        </div>

        {/* Active Students */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aktív képzés
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 block mt-1">
              szerződött diák
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Jóváhagyásra vár
            </span>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {pendingCount}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 block mt-1">
              együttműködés folyamatban
            </span>
          </div>
        </div>

        {/* Completed/Terminated */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Archivált képzések
            </span>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-850 p-2 text-slate-600 dark:text-slate-400">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {finishedCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              lezárt vagy megszakított
            </span>
          </div>
        </div>
      </section>

      {/* Students List */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Saját hallgatók adatai
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Az Ön szakmai felügyelete alá tartozó duális hallgatók és elérhetőségeik.
          </p>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-12 h-12 text-slate-350 mx-auto mb-3" />
            <p className="font-semibold">Még nincs Önhöz rendelt hallgató.</p>
            <p className="text-xs mt-1">
              A cégadminisztrátor jelölheti ki Önt mentornak a felvételi folyamat végén.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((p) => (
              <div
                key={p.id}
                className="p-6 hover:bg-slate-50/55 dark:hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Student profile info */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {p.student?.user?.fullName || "Ismeretlen Hallgató"}
                      </span>
                      {getStatusBadge(p.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-650 dark:text-slate-350">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a
                          href={`mailto:${p.student?.user?.email}`}
                          className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {p.student?.user?.email || "-"}
                        </a>
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {p.student?.user?.phoneNumber || "-"}
                      </span>
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        Neptun-kód: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{p.student?.neptunCode || "Nincs"}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Képzési forma: {p.student?.studyMode === "NAPPALI" ? "Nappali" : "Levelező"}
                      </span>
                    </div>
                  </div>

                  {/* Partnership timeline & university advisor */}
                  <div className="lg:text-right space-y-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-sm text-slate-500 dark:text-slate-450 flex items-center lg:justify-end gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(p.startDate)} - {formatDate(p.endDate)}
                      </span>
                    </div>

                    {p.uniEmployee ? (
                      <div className="text-xs rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 inline-block text-left border border-slate-200/50 dark:border-slate-800">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                          Egyetemi felelős (Supervisor):
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {p.uniEmployee.fullName} (
                          <a
                            href={`mailto:${p.uniEmployee.email}`}
                            className="hover:underline text-blue-600 dark:hover:text-blue-450"
                          >
                            {p.uniEmployee.email}
                          </a>
                          )
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-550 dark:text-slate-450 italic">
                        Még nincs egyetemi felelős kijelölve.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
