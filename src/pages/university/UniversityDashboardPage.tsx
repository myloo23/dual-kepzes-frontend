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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Egyetemi felulet
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Hallgatoi adatok, kapcsolatok es sajat profil kezelese egy helyen.
          </p>
        </div>
      )}

      {activeTab === "students" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Hallgatok</h2>
            <p className="text-sm text-slate-600">
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={studentMajorFilter}
                onChange={(e) => setStudentMajorFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="text-sm text-slate-600">Betoltes...</div>
          )}
          {studentsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {studentsError}
            </div>
          )}
          {!studentsLoading &&
            !studentsError &&
            filteredStudents.length === 0 && (
              <div className="text-sm text-slate-600">
                Nincs a keresesnek megfelelo hallgato.
              </div>
            )}
          <div className="grid gap-3">
            {paginatedStudents.map((student) => (
              <div
                key={String(student.id)}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="font-semibold text-slate-900">
                  {student.fullName}
                </div>
                <div className="text-sm text-slate-600">
                  {student.email}{" "}
                  {student.currentMajor ? `• ${student.currentMajor}` : ""}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {student.location?.city ? `${student.location.city} ` : ""}
                  {student.studyMode ? `• ${student.studyMode}` : ""}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalStudentPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                disabled={studentPage === 1}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Elozo
              </button>
              <span className="text-sm text-slate-600">
                {studentPage} / {totalStudentPages} oldal
              </span>
              <button
                onClick={() =>
                  setStudentPage((p) => Math.min(totalStudentPages, p + 1))
                }
                disabled={studentPage === totalStudentPages}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Kovetkezo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "partnerships" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Partnerkapcsolatok
            </h2>
            <p className="text-sm text-slate-600">
              Egyetemi partnerkapcsolatok listaja.
            </p>
          </div>

          {partnershipsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">
              Sajat profil
            </h1>
            <p className="text-sm text-slate-600">
              Itt frissitheted az egyetemi profilodat.
            </p>
          </header>

          {profileLoading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Betoltes...
            </div>
          )}

          {!profileLoading && profileError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {profileError}
            </div>
          )}

          {!profileLoading && profileSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {profileSuccess}
            </div>
          )}

          {!profileLoading && !profileError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold text-slate-600">
                  Nev
                </span>
                <input
                  name="fullName"
                  value={profileForm.fullName ?? ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold text-slate-600">
                  E-mail
                </span>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email ?? ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                <span className="text-xs font-semibold text-slate-600">
                  Tanszek / Egyseg
                </span>
                <input
                  name="department"
                  value={profileForm.department ?? ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          )}

          {!profileLoading && (
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
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
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
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
