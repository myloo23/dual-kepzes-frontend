import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  api,
  type StudentProfile,
  type UniversityUserProfile,
  type Partnership,
} from "../../lib/api";
import { useAuth } from "../../features/auth";
import UniversityPartnershipsTable, {
  type SortConfig,
} from "../../features/partnerships/components/UniversityPartnershipsTable";

export default function UniversityDashboardPage() {
  const location = useLocation();
  const { logout: authLogout } = useAuth();

  const [profileForm, setProfileForm] = useState<
    Partial<UniversityUserProfile>
  >({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileDeleting, setProfileDeleting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Note: We derive students FROM partnerships to only show relevant ones
  const [students, setStudents] = useState<StudentProfile[]>([]);
  // We keep studentsLoading to match previous behavior structure, though it depends on partnerships now
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [partnershipsLoading, setPartnershipsLoading] = useState(false);
  const [partnershipsError, setPartnershipsError] = useState<string | null>(
    null,
  );

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "student",
    direction: "asc",
  });

  // Filtering & Pagination State
  const [studentSearch, setStudentSearch] = useState("");
  const [studentMajorFilter, setStudentMajorFilter] = useState<string>("");
  const [studentPage, setStudentPage] = useState(1);
  const STUDENT_PAGE_SIZE = 10;

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path === "/university/students") return "students";
    if (path === "/university/partnerships") return "partnerships";
    if (path === "/university/profile") return "profile";
    const hash = location.hash;
    if (hash === "#students") return "students";
    if (hash === "#partnerships") return "partnerships";
    if (hash === "#profile") return "profile";
    return "overview";
  }, [location.pathname, location.hash]);

  // Reset pagination when filters change
  useEffect(() => {
    setStudentPage(1);
  }, [studentSearch, studentMajorFilter]);

  const uniqueMajors = useMemo(() => {
    const majors = new Set<string>();
    students.forEach((s) => {
      if (s.currentMajor) majors.add(s.currentMajor);
    });
    return Array.from(majors).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        studentSearch === "" ||
        student.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesMajor =
        studentMajorFilter === "" ||
        student.currentMajor === studentMajorFilter;
      return matchesSearch && matchesMajor;
    });
  }, [students, studentSearch, studentMajorFilter]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (studentPage - 1) * STUDENT_PAGE_SIZE;
    return filteredStudents.slice(startIndex, startIndex + STUDENT_PAGE_SIZE);
  }, [filteredStudents, studentPage]);

  const totalStudentPages = Math.ceil(
    filteredStudents.length / STUDENT_PAGE_SIZE,
  );

  const loadProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const data = await api.universityUsers.me.get();
      setProfileForm({
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        department: data.department ?? "",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a profil betoltese kozben.";
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "profile") return;
    void loadProfile();
  }, [activeTab]);

  // Unified loading for partnerships (which also feeds students list)
  useEffect(() => {
    if (activeTab !== "partnerships" && activeTab !== "students") return;

    // If we already have partnerships, don't reload unless force refresh needed
    // But simplistic approach: reload on tab switch to be safe
    const load = async () => {
      setPartnershipsLoading(true);
      setPartnershipsError(null);
      // If looking at students, we also need to load partnerships to derive them
      if (activeTab === "students") {
        setStudentsLoading(true);
        setStudentsError(null);
      }

      try {
        const list = await api.partnerships.listUniversity();
        const pList = Array.isArray(list) ? list : [];
        setPartnerships(pList);

        // Derive unique students from partnerships
        const uniqueStudentsMap = new Map<string, StudentProfile>();
        pList.forEach((p) => {
          if (p.student && p.student.studentProfile) {
            // p.student is the User object, p.student.studentProfile is the Profile
            // We ensure we have the User fields (email, name, id) merged in
            const profile = {
              ...p.student.studentProfile,
              email: p.student.email,
              fullName: p.student.fullName,
              userId: p.student.id,
            };
            uniqueStudentsMap.set(String(profile.id), profile);
          }
        });
        setStudents(Array.from(uniqueStudentsMap.values()));
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Hiba az adatok betoltese kozben.";
        setPartnershipsError(message);
        if (activeTab === "students") setStudentsError(message);
      } finally {
        setPartnershipsLoading(false);
        if (activeTab === "students") setStudentsLoading(false);
      }
    };
    void load();
  }, [activeTab]);

  const sortedPartnerships = useMemo(() => {
    const sorted = [...partnerships];
    sorted.sort((a, b) => {
      let aValue = "";
      let bValue = "";

      switch (sortConfig.key) {
        case "student":
          aValue = a.student?.fullName || "";
          bValue = b.student?.fullName || "";
          break;
        case "company":
          aValue = a.position?.company?.name || "";
          bValue = b.position?.company?.name || "";
          break;
        case "semester":
          aValue = a.semester || "";
          bValue = b.semester || "";
          break;
        case "mentor":
          aValue = a.mentor?.fullName || "";
          bValue = b.mentor?.fullName || "";
          break;
        case "uniEmployee":
          aValue = a.uniEmployee?.fullName || "";
          bValue = b.uniEmployee?.fullName || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
      }

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue, "hu")
        : bValue.localeCompare(aValue, "hu");
    });
    return sorted;
  }, [partnerships, sortConfig]);

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const updated = await api.universityUsers.me.update({
        fullName: profileForm.fullName ?? "",
        email: profileForm.email ?? "",
        department: profileForm.department ?? "",
      });
      setProfileForm({
        fullName: updated.fullName ?? "",
        email: updated.email ?? "",
        department: updated.department ?? "",
      });
      setProfileSuccess("Profil frissitve.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a mentes soran.";
      setProfileError(message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileDelete = async () => {
    const ok = window.confirm(
      "Biztosan torlod a profilodat? Ez nem visszavonhato.",
    );
    if (!ok) return;
    setProfileDeleting(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await api.universityUsers.me.remove();
      authLogout();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a profil torlese soran.";
      setProfileError(message);
    } finally {
      setProfileDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {activeTab === "overview" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none transition-colors">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Egyetemi felulet
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Hallgatoi adatok, kapcsolatok es sajat profil kezelese egy helyen.
          </p>
        </div>
      )}

      {activeTab === "students" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none transition-colors space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hallgatok</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Aktiv hallgatoi profilok listaja (partnerkapcsolatok alapjan).
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Kereses nev vagy email alapjan..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={studentMajorFilter}
                onChange={(e) => setStudentMajorFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">-- Minden szak --</option>
                {uniqueMajors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {studentsLoading && (
            <div className="text-sm text-slate-600 dark:text-slate-400">Betoltes...</div>
          )}
          {studentsError && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
              {studentsError}
            </div>
          )}
          {!studentsLoading &&
            !studentsError &&
            filteredStudents.length === 0 && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Nincs a keresesnek megfelelo hallgato.
              </div>
            )}
          <div className="grid gap-3">
            {paginatedStudents.map((student) => (
              <div
                key={String(student.id)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 transition-colors"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {student.fullName}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {student.email}{" "}
                  {student.currentMajor ? `• ${student.currentMajor}` : ""}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {student.location?.city ? `${student.location.city} ` : ""}
                  {student.studyMode ? `• ${student.studyMode}` : ""}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalStudentPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors">
              <button
                onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                disabled={studentPage === 1}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-sm disabled:opacity-50 transition-colors"
              >
                Elozo
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {studentPage} / {totalStudentPages} oldal
              </span>
              <button
                onClick={() =>
                  setStudentPage((p) => Math.min(totalStudentPages, p + 1))
                }
                disabled={studentPage === totalStudentPages}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-sm disabled:opacity-50 transition-colors"
              >
                Kovetkezo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "partnerships" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none transition-colors space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Partnerkapcsolatok
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Egyetemi partnerkapcsolatok listaja.
            </p>
          </div>

          {partnershipsError && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
              {partnershipsError}
            </div>
          )}

          <UniversityPartnershipsTable
            partnerships={sortedPartnerships}
            isLoading={partnershipsLoading}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none transition-colors space-y-6">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Sajat profil
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Itt frissitheted az egyetemi profilodat.
            </p>
          </header>

          {profileLoading && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 text-sm text-slate-600 dark:text-slate-400 transition-colors">
              Betoltes...
            </div>
          )}

          {!profileLoading && profileError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 transition-colors">
              {profileError}
            </div>
          )}

          {!profileLoading && profileSuccess && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-700 dark:text-emerald-400 transition-colors">
              {profileSuccess}
            </div>
          )}

          {!profileLoading && !profileError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Nev
                </span>
                <input
                  name="fullName"
                  value={profileForm.fullName ?? ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  E-mail
                </span>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email ?? ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 md:col-span-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Tanszek / Egyseg
                </span>
                <input
                  name="department"
                  value={profileForm.department ?? ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </label>
            </div>
          )}

          {!profileLoading && (
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors">
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {profileSaving ? "Mentes..." : "Mentes"}
              </button>
              <button
                onClick={handleProfileDelete}
                disabled={profileDeleting}
                className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-60 transition-colors"
              >
                {profileDeleting ? "Torles..." : "Profil torlese"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

