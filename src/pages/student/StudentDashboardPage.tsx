import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApplicationsList from "../../features/applications/components/ApplicationsList";
import { useAuth } from "../../features/auth";
import StudentNewsPage from "./StudentNewsPage";
import { api, type StudentProfile } from "../../lib/api";

type StudentProfilePayload = Partial<StudentProfile> & {
  profile?: Partial<StudentProfile>;
  studentProfile?: Partial<StudentProfile>;
  user?: {
    id?: string | number;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
  };
  birthDate?: string;
};

function normalizeStudentProfile(payload: StudentProfilePayload | null) {
  if (!payload) return null;

  const toNumber = (value: unknown) => {
    if (value === null || value === undefined || value === "") return undefined;
    const num = typeof value === "number" ? value : Number(value);
    return Number.isNaN(num) ? undefined : num;
  };

  const merged = {
    ...payload,
    ...(payload.profile || {}),
    ...(payload.studentProfile || {}),
  };
  const user = merged.user || {};
  const rawDate = merged.dateOfBirth || payload.birthDate || "";
  const dateOfBirth = rawDate ? String(rawDate).split("T")[0] : "";

  return {
    id: merged.id ?? "",
    userId: merged.userId ?? user.id ?? "",
    fullName: merged.fullName ?? user.fullName ?? "",
    email: merged.email ?? user.email ?? "",
    phoneNumber: merged.phoneNumber ?? user.phoneNumber ?? "",
    mothersName: merged.mothersName ?? "",
    dateOfBirth,
    country: merged.country ?? "",
    zipCode: toNumber(merged.zipCode),
    city: merged.city ?? "",
    streetAddress: merged.streetAddress ?? (merged as { address?: string }).address ?? "",
    highSchool: merged.highSchool ?? "",
    graduationYear: toNumber(merged.graduationYear),
    neptunCode: merged.neptunCode ?? "",
    currentMajor: merged.currentMajor ?? "",
    studyMode: merged.studyMode ?? "NAPPALI",
    hasLanguageCert: Boolean(merged.hasLanguageCert),
  } as Partial<StudentProfile>;
}

function buildProfileForm(data: Partial<StudentProfile> | null): Partial<StudentProfile> {
  if (!data) return {};
  return {
    fullName: data.fullName ?? "",
    email: data.email ?? "",
    phoneNumber: data.phoneNumber ?? "",
    mothersName: data.mothersName ?? "",
    dateOfBirth: data.dateOfBirth ?? "",
    country: data.country ?? "",
    zipCode: data.zipCode ?? undefined,
    city: data.city ?? "",
    streetAddress: data.streetAddress ?? "",
    highSchool: data.highSchool ?? "",
    graduationYear: data.graduationYear ?? undefined,
    neptunCode: data.neptunCode ?? "",
    currentMajor: data.currentMajor ?? "",
    studyMode: data.studyMode ?? "NAPPALI",
    hasLanguageCert: data.hasLanguageCert ?? false,
  };
}

function buildProfilePayload(form: Partial<StudentProfile>) {
  const {
    dateOfBirth,
    email,
    ...rest
  } = form;

  return {
    ...rest,
    ...(dateOfBirth ? { birthDate: dateOfBirth } : {}),
  };
}

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: authLogout } = useAuth();
  const [profile, setProfile] = useState<Partial<StudentProfile> | null>(null);
  const [profileForm, setProfileForm] = useState<Partial<StudentProfile>>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileDeleting, setProfileDeleting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const logout = () => {
    authLogout();
    navigate("/");
  };

  // Determine active tab from URL hash
  const activeTab = location.pathname === "/student/news"
    ? "news"
    : location.hash === "#profile"
      ? "profile"
    : location.hash === "#applications"
      ? "applications"
      : "overview";

  useEffect(() => {
    if (activeTab !== "profile") return;
    let mounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      setProfileSuccess(null);
      try {
        const data = await api.me.get();
        if (!mounted) return;
        const normalized = normalizeStudentProfile(data as StudentProfilePayload);
        setProfile(normalized);
        setProfileForm(buildProfileForm(normalized));
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : "Hiba a profil betöltésekor.";
        setProfileError(message);
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;
    const { name, value, type } = target;
    const isCheckbox = target instanceof HTMLInputElement && type === "checkbox";
    setProfileForm((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? target.checked
        : name === "zipCode" || name === "graduationYear"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const updated = await api.me.update(buildProfilePayload(profileForm));
      const normalized = normalizeStudentProfile(updated as StudentProfilePayload);
      setProfile(normalized);
      setProfileForm(buildProfileForm(normalized));
      setProfileSuccess("Profil frissítve.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a mentés során.";
      setProfileError(message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileDelete = async () => {
    if (!profile) return;
    const ok = window.confirm("Biztosan törlöd a profilodat? Ez nem visszavonható.");
    if (!ok) return;

    setProfileDeleting(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await api.me.remove();
      authLogout();
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hiba a profil törlése során.";
      setProfileError(message);
    } finally {
      setProfileDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* TOP BAR */}
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
            <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500" />
            <div>
              <div className="text-sm text-slate-500">Diák felület</div>
              <div className="font-semibold text-slate-900">
                Üdv, {user?.email ?? "Hallgató"} 👋
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/positions"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Állások böngészése
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Kijelentkezés
            </button>
          </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="px-4 lg:px-8 py-8 space-y-6">
        {/* TAB NAVIGATION */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <Link
              to="/student"
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Áttekintés
            </Link>
            <Link
              to="/student#applications"
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${activeTab === "applications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Jelentkezéseim
            </Link>

            <Link
              to="/student/news"
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${activeTab === "news"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Hírek
            </Link>

            <Link
              to="/student#profile"
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${activeTab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Saját profil
            </Link>
            
          </nav>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "overview" && (
          <>
            {/* HERO CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-semibold text-slate-900">
                Kezdjük el a jelentkezést!
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Itt fogod látni a jelentkezéseidet, státuszokat, határidőket és a mentett pozíciókat.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/positions"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Elérhető pozíciók megtekintése
                </Link>

                <button
                  onClick={() => alert("Később: profil kitöltése oldal")}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Profil kitöltése
                </button>
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* My applications */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Jelentkezéseim</div>
                <p className="mt-1 text-sm text-slate-600">
                  Gyors áttekintés a jelentkezéseidről.
                </p>

                <div className="mt-4 space-y-2">
                  <Link
                    to="/student#applications"
                    className="block w-full text-left rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm hover:bg-slate-100 transition"
                  >
                    <div className="font-medium text-slate-900">Jelentkezések megtekintése →</div>
                    <div className="text-slate-600">Kattints ide a részletekért</div>
                  </Link>
                </div>
              </div>

              {/* Deadlines */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Határidők</div>
                <p className="mt-1 text-sm text-slate-600">
                  (Mock) Később ide jönnek a leadási / jelentkezési határidők.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <span className="text-slate-700">Önéletrajz frissítése</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                      jövő hét
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <span className="text-slate-700">Mentett pozíciók átnézése</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      ma
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Gyors műveletek</div>
                <p className="mt-1 text-sm text-slate-600">
                  Hasznos linkek és műveletek.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Link
                    to="/positions"
                    className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Állások böngészése →
                  </Link>

                  <Link
                    to="/student#applications"
                    className="block text-left rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Jelentkezéseim →
                  </Link>

                  <button
                    onClick={() => alert("Később: beállítások oldal")}
                    className="text-left rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Beállítások →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "applications" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ApplicationsList />
          </div>
        )}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <header className="space-y-1">
              <h1 className="text-xl font-semibold text-slate-900">Saját profil</h1>
              <p className="text-sm text-slate-600">
                Itt frissítheted a saját adataidat, vagy törölheted a profilodat.
              </p>
            </header>

            {profileLoading && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Betöltés...
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
                  <span className="text-xs font-semibold text-slate-600">Teljes név</span>
                  <input
                    name="fullName"
                    value={profileForm.fullName ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">E-mail</span>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Telefonszám</span>
                  <input
                    name="phoneNumber"
                    value={profileForm.phoneNumber ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Anyja neve</span>
                  <input
                    name="mothersName"
                    value={profileForm.mothersName ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Születési dátum</span>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileForm.dateOfBirth ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Ország</span>
                  <input
                    name="country"
                    value={profileForm.country ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Irányítószám</span>
                  <input
                    name="zipCode"
                    value={profileForm.zipCode ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Város</span>
                  <input
                    name="city"
                    value={profileForm.city ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Utca, házszám</span>
                  <input
                    name="streetAddress"
                    value={profileForm.streetAddress ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Középiskola</span>
                  <input
                    name="highSchool"
                    value={profileForm.highSchool ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Érettségi éve</span>
                  <input
                    name="graduationYear"
                    value={profileForm.graduationYear ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Neptun kód</span>
                  <input
                    name="neptunCode"
                    value={profileForm.neptunCode ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Szak</span>
                  <input
                    name="currentMajor"
                    value={profileForm.currentMajor ?? ""}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">Képzési forma</span>
                  <select
                    name="studyMode"
                    value={profileForm.studyMode ?? "NAPPALI"}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NAPPALI">Nappali</option>
                    <option value="LEVELEZŐ">Levelező</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700 md:col-span-2">
                  <input
                    type="checkbox"
                    name="hasLanguageCert"
                    checked={Boolean(profileForm.hasLanguageCert)}
                    onChange={handleProfileChange}
                    className="h-4 w-4"
                  />
                  Van nyelvvizsga
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
                  {profileSaving ? "Mentés..." : "Mentés"}
                </button>
                <button
                  onClick={handleProfileDelete}
                  disabled={profileDeleting}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  {profileDeleting ? "Törlés..." : "Profil törlése"}
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "news" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <StudentNewsPage />
          </div>
        )}
          </main>
        </div>
      </div>
    </div>
  );
}
