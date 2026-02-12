import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  api,
  type StudentProfile,
  type UniversityUserProfile,
  type Partnership,
} from "../../lib/api";
import { useAuth } from "../../features/auth";
import { studentsApi } from "../../features/students/services/studentsApi";
import UniversityPartnershipsTable from "../../features/partnerships/components/UniversityPartnershipsTable";

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

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [partnershipsLoading, setPartnershipsLoading] = useState(false);
  const [partnershipsError, setPartnershipsError] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    if (activeTab !== "students") return;
    const load = async () => {
      setStudentsLoading(true);
      setStudentsError(null);
      try {
        const list = await studentsApi.list();
        setStudents(Array.isArray(list) ? list : []);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Hiba a hallgatok betoltese kozben.";
        setStudentsError(message);
      } finally {
        setStudentsLoading(false);
      }
    };
    void load();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "partnerships") return;
    const load = async () => {
      setPartnershipsLoading(true);
      setPartnershipsError(null);
      try {
        const list = await api.partnerships.listUniversity();
        setPartnerships(Array.isArray(list) ? list : []);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Hiba a partnerkapcsolatok betoltese kozben.";
        setPartnershipsError(message);
      } finally {
        setPartnershipsLoading(false);
      }
    };
    void load();
  }, [activeTab]);

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
              Aktiv hallgatoi profilok listaja.
            </p>
          </div>
          {studentsLoading && (
            <div className="text-sm text-slate-600">Betoltes...</div>
          )}
          {studentsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {studentsError}
            </div>
          )}
          {!studentsLoading && !studentsError && students.length === 0 && (
            <div className="text-sm text-slate-600">
              Nincs megjelenitheto hallgato.
            </div>
          )}
          <div className="grid gap-3">
            {students.map((student) => (
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
            partnerships={partnerships}
            isLoading={partnershipsLoading}
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
