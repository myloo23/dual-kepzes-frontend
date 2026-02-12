import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import ApplicationsList from "../../features/applications/components/ApplicationsList";
import StudentPartnershipsList from "../../features/partnerships/components/StudentPartnershipsList";
import { useAuth } from "../../features/auth";
import StudentNewsPage from "./StudentNewsPage";
import { GuidePlayer } from "../../features/guide";
import { api, type StudentProfile } from "../../lib/api";
import {
  normalizeNeptun,
  validateNeptunOptional,
} from "../../utils/validation-utils";
import { LANGUAGES, LANGUAGE_LEVELS } from "../../features/auth/constants";
import { useMajors } from "../../features/majors";

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
  major?: {
    id: string;
    name: string;
    language?: string;
  };
};

type StudentFormState = {
  firstName?: string; // Not used?
  fullName: string;
  email: string;
  phoneNumber: string;
  mothersName: string;
  dateOfBirth: string;
  country: string;
  zipCode: string | number;
  city: string;
  streetAddress: string;
  highSchool: string;
  graduationYear: string | number;
  neptunCode: string;
  currentMajor: string;
  studyMode: string;
  hasLanguageCert: boolean;
  languageExams: { language: string; level: string }[];
  studentType: "HIGHSCHOOL" | "UNIVERSITY";
  firstChoiceId: string; // For High School
  secondChoiceId: string; // For High School
  universityMajor: string; // For University
};

// Returns standard nested StudentProfile
function normalizeStudentProfile(
  payload: StudentProfilePayload | null,
): Partial<StudentProfile> | null {
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
  const rawDate =
    merged.dateOfBirth || (merged as any).birthDate || payload.birthDate || "";
  const dateOfBirth = rawDate ? String(rawDate).split("T")[0] : "";
  const loc = (merged as any).location || {};

  return {
    id: merged.id ?? "",
    userId: merged.userId ?? user.id ?? "",
    fullName: merged.fullName ?? user.fullName ?? "",
    email: merged.email ?? user.email ?? "",
    phoneNumber: merged.phoneNumber ?? user.phoneNumber ?? "",
    mothersName: merged.mothersName ?? "",
    dateOfBirth,
    location: {
      country: loc.country || (merged as any).country || "",
      zipCode: toNumber(loc.zipCode || (merged as any).zipCode) || 0,
      city: loc.city || (merged as any).city || "",
      address:
        loc.address ||
        (merged as any).streetAddress ||
        (merged as any).address ||
        "",
    },
    highSchool: merged.highSchool ?? "",
    graduationYear: toNumber(merged.graduationYear) || 0,
    neptunCode: merged.neptunCode ?? "",
    currentMajor: merged.major?.id ?? merged.currentMajor ?? "",
    studyMode:
      (merged.studyMode?.toUpperCase() as "NAPPALI" | "LEVELEZŐ") ?? "NAPPALI",
    isAvailableForWork: merged.isAvailableForWork ?? false,
    hasLanguageCert: Boolean(merged.hasLanguageCert),
    languageExams: merged.languageExams || [],
    firstChoiceId:
      (merged as any).firstChoice?.id || (merged as any).firstChoiceId || "",
    secondChoiceId:
      (merged as any).secondChoice?.id || (merged as any).secondChoiceId || "",
  } as Partial<StudentProfile>;
}

function buildProfileForm(
  data: Partial<StudentProfile> | null,
): StudentFormState {
  if (!data) return {} as StudentFormState;
  const loc = data.location || {
    country: "",
    zipCode: "",
    city: "",
    address: "",
  };

  // Heuristic: If neptunCode is present and not empty, assume University.
  // Otherwise, if currentMajor is a comma-separated list, assume High School.
  const hasNeptun = !!data.neptunCode;
  const studentType = hasNeptun ? "UNIVERSITY" : "HIGHSCHOOL";

  const currentMajor = data.currentMajor || "";

  // Parse majors for HS
  // Priority: 1. Explicit fields from API, 2. Parsed from currentMajor string
  let firstChoiceId = data.firstChoiceId || "";
  let secondChoiceId = data.secondChoiceId || "";

  if (studentType === "HIGHSCHOOL") {
    // If explicit fields are missing, try parsing currentMajor
    if (!firstChoiceId && !secondChoiceId && currentMajor) {
      const parts = currentMajor
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 0) firstChoiceId = parts[0];
      if (parts.length > 1) secondChoiceId = parts[1];
    }
  }

  const universityMajor = studentType === "UNIVERSITY" ? currentMajor : "";

  return {
    fullName: data.fullName ?? "",
    email: data.email ?? "",
    phoneNumber: data.phoneNumber ?? "",
    mothersName: data.mothersName ?? "",
    dateOfBirth: data.dateOfBirth ?? "",
    country: loc.country ?? "",
    zipCode: loc.zipCode ?? "",
    city: loc.city ?? "",
    streetAddress: loc.address ?? "",
    highSchool: data.highSchool ?? "",
    graduationYear: data.graduationYear ?? "",
    neptunCode: data.neptunCode ?? "",
    currentMajor: data.currentMajor ?? "",
    studyMode: data.studyMode ?? "NAPPALI",
    hasLanguageCert: data.hasLanguageCert ?? false,
    languageExams:
      data.languageExams && data.languageExams.length > 0
        ? data.languageExams
        : [{ language: LANGUAGES[0], level: LANGUAGE_LEVELS[2] }], // Default B1
    studentType,
    firstChoiceId,
    secondChoiceId,
    universityMajor,
  };
}

function buildProfilePayload(form: StudentFormState) {
  const {
    dateOfBirth,
    email,
    country,
    zipCode,
    city,
    streetAddress,
    studentType,
    firstChoiceId,
    secondChoiceId,
    universityMajor,
    languageExams,
    neptunCode,
    ...rest
  } = form;

  // Finalize majors and neptun based on type
  let finalMajor = "";
  let finalNeptun = "";

  if (studentType === "HIGHSCHOOL") {
    const parts = [];
    if (firstChoiceId) parts.push(firstChoiceId);
    if (secondChoiceId) parts.push(secondChoiceId);
    finalMajor = parts.join(", ");
    finalNeptun = ""; // Clear neptun for high schoolers
  } else {
    finalMajor = universityMajor;
    finalNeptun = neptunCode;
  }

  // Filter proper language exams
  const finalLanguageExams = rest.hasLanguageCert ? languageExams : [];

  return {
    ...rest,
    neptunCode: finalNeptun ? normalizeNeptun(finalNeptun) : undefined,
    currentMajor: finalMajor,
    languageExams: finalLanguageExams,
    studyMode: rest.studyMode as "NAPPALI" | "LEVELEZŐ",
    graduationYear: Number(rest.graduationYear),
    ...(dateOfBirth ? { birthDate: dateOfBirth } : {}),
    location: {
      country,
      zipCode: Number(zipCode),
      city,
      address: streetAddress,
    },
  };
}

export default function StudentDashboardPage() {
  const location = useLocation();
  const { user, logout: authLogout } = useAuth();
  const { majors, loading: majorsLoading } = useMajors();
  const [profile, setProfile] = useState<Partial<StudentProfile> | null>(null);
  const [profileForm, setProfileForm] = useState<StudentFormState>(
    {} as StudentFormState,
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileDeleting, setProfileDeleting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Partnerships state
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [partnershipsLoading, setPartnershipsLoading] = useState(false);

  // Determine active tab from URL hash
  const activeTab =
    location.pathname === "/student/news"
      ? "news"
      : location.pathname === "/student/guide"
        ? "guide"
        : location.pathname === "/student/partnerships"
          ? "partnerships"
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
        const normalized = normalizeStudentProfile(
          data as StudentProfilePayload,
        );
        setProfile(normalized);
        setProfileForm(buildProfileForm(normalized));
      } catch (err) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : "Hiba a profil betöltésekor.";
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

  // Sync profile major names to IDs when majors list is loaded
  useEffect(() => {
    if (
      activeTab === "profile" &&
      profile &&
      !majorsLoading &&
      majors.length > 0
    ) {
      const currentMajor = profile.currentMajor || "";
      const studentType = profile.neptunCode ? "UNIVERSITY" : "HIGHSCHOOL";

      if (studentType === "HIGHSCHOOL") {
        // Try to resolve IDs if they are Names or if we only have currentMajor string
        // If data.firstChoiceId is already a UUID, the matching below (exact ID match) will confirm it.
        // If it is a Name, the matching (exact/partial name) will find the ID.

        const raw1 =
          profile.firstChoiceId || currentMajor.split(/[,;]/)[0]?.trim() || "";
        const raw2 =
          profile.secondChoiceId || currentMajor.split(/[,;]/)[1]?.trim() || "";

        const findMajor = (val: string) => {
          if (!val) return undefined;
          const lowerVal = val.toLowerCase();
          // 1. Try exact ID match
          let match = majors.find((m) => String(m.id) === val);
          // 2. Try exact Name match (case-insensitive)
          if (!match)
            match = majors.find((m) => m.name.toLowerCase() === lowerVal);
          // 3. Try partial Name match
          if (!match)
            match = majors.find(
              (m) =>
                m.name.toLowerCase().includes(lowerVal) ||
                lowerVal.includes(m.name.toLowerCase()),
            );
          return match;
        };

        const match1 = findMajor(raw1);
        const match2 = findMajor(raw2);

        setProfileForm((prev) => {
          const newFirstId = match1 ? String(match1.id) : prev.firstChoiceId;
          const newSecondId = match2 ? String(match2.id) : prev.secondChoiceId;

          if (
            prev.firstChoiceId !== newFirstId ||
            prev.secondChoiceId !== newSecondId
          ) {
            return {
              ...prev,
              firstChoiceId: newFirstId || "",
              secondChoiceId: newSecondId || "",
            };
          }
          return prev;
        });
      }
    }
  }, [profile, majors, majorsLoading, activeTab]);

  useEffect(() => {
    if (activeTab !== "partnerships") return;
    let mounted = true;

    const loadPartnerships = async () => {
      setPartnershipsLoading(true);
      try {
        const data = await api.partnerships.listStudent();
        if (!mounted) return;
        setPartnerships(data);
      } catch (err) {
        console.error("Failed to load partnerships:", err);
      } finally {
        if (mounted) setPartnershipsLoading(false);
      }
    };

    loadPartnerships();
    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const handleProfileChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = event.target;
    // Handle checkbox vs text/select
    const { name, value, type } = target as HTMLInputElement;
    const isCheckbox = type === "checkbox";

    setProfileForm((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (target as HTMLInputElement).checked
        : name === "zipCode" || name === "graduationYear"
          ? value === ""
            ? ""
            : value // Store as string in form state
          : value,
    }));
  };

  // Helper for language exam changes
  const handleLanguageExamChange = (
    index: number,
    field: "language" | "level",
    value: string,
  ) => {
    const newExams = [...(profileForm.languageExams || [])];
    if (newExams[index]) {
      newExams[index] = { ...newExams[index], [field]: value };
      setProfileForm((p) => ({ ...p, languageExams: newExams }));
    }
  };

  const addLanguageExam = () => {
    setProfileForm((p) => ({
      ...p,
      languageExams: [
        ...(p.languageExams || []),
        { language: LANGUAGES[0], level: LANGUAGE_LEVELS[2] },
      ],
    }));
  };

  const removeLanguageExam = (index: number) => {
    setProfileForm((p) => ({
      ...p,
      languageExams: p.languageExams.filter((_, i) => i !== index),
    }));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);

    // Validation
    const {
      studentType,
      firstChoiceId,
      secondChoiceId,
      neptunCode,
      universityMajor,
      hasLanguageCert,
      languageExams,
    } = profileForm;

    if (studentType === "UNIVERSITY") {
      if (!universityMajor) {
        setProfileSaving(false);
        return setProfileError("Szak megnevezése kötelező egyetemistáknak.");
      }
      if (!neptunCode) {
        setProfileSaving(false);
        return setProfileError("Neptun kód megadása kötelező egyetemistáknak.");
      }
      const neptunErr = validateNeptunOptional(neptunCode);
      if (neptunErr) {
        setProfileSaving(false);
        return setProfileError(neptunErr);
      }
    } else {
      // HIGHSCHOOL
      if (!firstChoiceId) {
        setProfileSaving(false);
        return setProfileError(
          "Első helyen megjelölt szak kiválasztása kötelező.",
        );
      }
      if (!secondChoiceId) {
        setProfileSaving(false);
        return setProfileError(
          "Második helyen megjelölt szak kiválasztása kötelező.",
        );
      }
      if (firstChoiceId === secondChoiceId) {
        setProfileSaving(false);
        return setProfileError("A két megjelölt szak nem lehet ugyanaz.");
      }
    }

    if (hasLanguageCert) {
      if (!languageExams || languageExams.length === 0) {
        setProfileSaving(false);
        return setProfileError(
          "Legalább egy nyelvvizsga megadása kötelező, ha bejelölted a mezőt.",
        );
      }
      for (const exam of languageExams) {
        if (!exam.language || !exam.level) {
          setProfileSaving(false);
          return setProfileError(
            "Minden nyelvvizsgához kötelező a nyelv és a szint megadása.",
          );
        }
      }
    }

    try {
      const updated = await api.me.update(buildProfilePayload(profileForm));
      const normalized = normalizeStudentProfile(
        updated as StudentProfilePayload,
      );
      setProfile(normalized);
      setProfileForm(buildProfileForm(normalized));
      setProfileSuccess("Profil frissítve.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a mentés során.";
      setProfileError(message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileDelete = async () => {
    if (!profile) return;
    const ok = window.confirm(
      "Biztosan törlöd a profilodat? Ez nem visszavonható.",
    );
    if (!ok) return;

    setProfileDeleting(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await api.me.remove();
      authLogout();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Hiba a profil törlése során.";
      setProfileError(message);
    } finally {
      setProfileDeleting(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!profile) return;
    try {
      // Optimistic update
      const newValue = !profile.isAvailableForWork;
      setProfile((prev) =>
        prev ? { ...prev, isAvailableForWork: newValue } : null,
      );

      const updated = await api.me.toggleAvailability();
      const normalized = normalizeStudentProfile(
        updated as StudentProfilePayload,
      );
      setProfile(normalized);
      // Sync form just in case, though this field isn't in the form state explicitly
    } catch (err) {
      console.error("Failed to toggle availability:", err);
      // Revert on error
      const message =
        err instanceof Error ? err.message : "Hiba az állapot módosításakor.";
      setProfileError(message);
      // Reload profile to ensure sync
      const data = await api.me.get();
      setProfile(normalizeStudentProfile(data as StudentProfilePayload));
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
                  onClick={authLogout}
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
                  className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${
                    activeTab === "overview"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Áttekintés
                </Link>
                <Link
                  to="/student#applications"
                  className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${
                    activeTab === "applications"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Jelentkezéseim
                </Link>

                <Link
                  to="/student/news"
                  className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${
                    activeTab === "news"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Hírek
                </Link>

                <Link
                  to="/student/partnerships"
                  className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${
                    activeTab === "partnerships"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Partnerek
                </Link>

                <Link
                  to="/student#profile"
                  className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${
                    activeTab === "profile"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Saját profil
                </Link>

                <Link
                  to="/student/guide"
                  className={`pb-4 px-1 text-sm font-semibold border-b-2 transition ${
                    activeTab === "guide"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tananyag
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
                    Itt fogod látni a jelentkezéseidet, státuszokat, határidőket
                    és a mentett pozíciókat.
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
                    <div className="text-sm font-semibold text-slate-900">
                      Jelentkezéseim
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Gyors áttekintés a jelentkezéseidről.
                    </p>

                    <div className="mt-4 space-y-2">
                      <Link
                        to="/student#applications"
                        className="block w-full text-left rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm hover:bg-slate-100 transition"
                      >
                        <div className="font-medium text-slate-900">
                          Jelentkezések megtekintése →
                        </div>
                        <div className="text-slate-600">
                          Kattints ide a részletekért
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Deadlines */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">
                      Határidők
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      (Mock) Később ide jönnek a leadási / jelentkezési
                      határidők.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <span className="text-slate-700">
                          Önéletrajz frissítése
                        </span>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                          jövő hét
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <span className="text-slate-700">
                          Mentett pozíciók átnézése
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          ma
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">
                      Gyors műveletek
                    </div>
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
                  <h1 className="text-xl font-semibold text-slate-900">
                    Saját profil
                  </h1>
                  <p className="text-sm text-slate-600">
                    Itt frissítheted a saját adataidat, vagy törölheted a
                    profilodat.
                  </p>
                </header>

                {!profileLoading && profile && (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Munkakeresési státusz
                      </h3>
                      <p className="text-sm text-slate-500 max-w-xl">
                        {profile.isAvailableForWork
                          ? "Jelenleg aktívan keresel munkát. A cégek láthatják a profilodat a keresőben."
                          : "Nem keresel munkát. A profilod rejtve van a cégek elől (kivéve ha jelentkezel hozzájuk)."}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleAvailability}
                      type="button"
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        profile.isAvailableForWork
                          ? "bg-blue-600"
                          : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                          profile.isAvailableForWork
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )}

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
                      <span className="text-xs font-semibold text-slate-600">
                        Teljes név
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
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Telefonszám
                      </span>
                      <input
                        name="phoneNumber"
                        value={profileForm.phoneNumber ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Anyja neve
                      </span>
                      <input
                        name="mothersName"
                        value={profileForm.mothersName ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Születési dátum
                      </span>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileForm.dateOfBirth ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Ország
                      </span>
                      <input
                        name="country"
                        value={profileForm.country ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Irányítószám
                      </span>
                      <input
                        name="zipCode"
                        value={profileForm.zipCode ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Város
                      </span>
                      <input
                        name="city"
                        value={profileForm.city ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Utca, házszám
                      </span>
                      <input
                        name="streetAddress"
                        value={profileForm.streetAddress ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Középiskola
                      </span>
                      <input
                        name="highSchool"
                        value={profileForm.highSchool ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Érettségi éve
                      </span>
                      <input
                        name="graduationYear"
                        value={profileForm.graduationYear ?? ""}
                        onChange={handleProfileChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    {/* Student Type Switch */}
                    <div className="md:col-span-2 flex gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="studentType"
                          checked={profileForm.studentType === "HIGHSCHOOL"}
                          onChange={() =>
                            setProfileForm((p) => ({
                              ...p,
                              studentType: "HIGHSCHOOL",
                            }))
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Középiskolás
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="studentType"
                          checked={profileForm.studentType === "UNIVERSITY"}
                          onChange={() =>
                            setProfileForm((p) => ({
                              ...p,
                              studentType: "UNIVERSITY",
                            }))
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Egyetemista
                        </span>
                      </label>
                    </div>

                    {profileForm.studentType === "UNIVERSITY" && (
                      <label className="space-y-1 text-sm text-slate-700">
                        <span className="text-xs font-semibold text-slate-600">
                          Neptun kód
                        </span>
                        <input
                          name="neptunCode"
                          value={profileForm.neptunCode ?? ""}
                          onChange={handleProfileChange}
                          placeholder="ABC123"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                    )}

                    <div className="space-y-1 text-sm text-slate-700 md:col-span-2">
                      <span className="text-xs font-semibold text-slate-600">
                        {profileForm.studentType === "HIGHSCHOOL"
                          ? "Megjelölt szakok"
                          : "Szak megnevezése"}
                      </span>

                      {profileForm.studentType === "HIGHSCHOOL" ? (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">
                              Helyszín 1. választás
                            </label>
                            <select
                              value={profileForm.firstChoiceId ?? ""}
                              onChange={(e) =>
                                setProfileForm((p) => ({
                                  ...p,
                                  firstChoiceId: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">
                                {majorsLoading
                                  ? "Betöltés..."
                                  : "Válassz szakot..."}
                              </option>
                              {majors.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                  {m.language ? ` (${m.language})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">
                              Helyszín 2. választás
                            </label>
                            <select
                              value={profileForm.secondChoiceId ?? ""}
                              onChange={(e) =>
                                setProfileForm((p) => ({
                                  ...p,
                                  secondChoiceId: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">
                                {majorsLoading
                                  ? "Betöltés..."
                                  : "Válassz szakot..."}
                              </option>
                              {majors.map((m) => (
                                <option
                                  key={m.id}
                                  value={m.id}
                                  disabled={m.id === profileForm.firstChoiceId}
                                >
                                  {m.name}
                                  {m.language ? ` (${m.language})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={profileForm.universityMajor}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              universityMajor: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">
                            {majorsLoading
                              ? "Betöltés..."
                              : "Válassz szakot..."}
                          </option>
                          {majors.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                              {m.language ? ` (${m.language})` : ""}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <label className="space-y-1 text-sm text-slate-700">
                      <span className="text-xs font-semibold text-slate-600">
                        Képzési forma
                      </span>
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

                    {/* Language Exams */}
                    {profileForm.hasLanguageCert && (
                      <div className="md:col-span-2 space-y-3 pl-7 border-l-2 border-slate-100">
                        {profileForm.languageExams?.map((exam, idx) => (
                          <div key={idx} className="flex gap-3 items-end">
                            <label className="space-y-1 text-sm text-slate-700 flex-1">
                              <span className="text-xs font-semibold text-slate-600">
                                Nyelv
                              </span>
                              <select
                                value={exam.language}
                                onChange={(e) =>
                                  handleLanguageExamChange(
                                    idx,
                                    "language",
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {LANGUAGES.map((l) => (
                                  <option key={l} value={l}>
                                    {l}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="space-y-1 text-sm text-slate-700 w-32">
                              <span className="text-xs font-semibold text-slate-600">
                                Szint
                              </span>
                              <select
                                value={exam.level}
                                onChange={(e) =>
                                  handleLanguageExamChange(
                                    idx,
                                    "level",
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {LANGUAGE_LEVELS.map((l) => (
                                  <option key={l} value={l}>
                                    {l}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeLanguageExam(idx)}
                              className="mb-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Törlés"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addLanguageExam}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          + Nyelvvizsga hozzáadása
                        </button>
                      </div>
                    )}
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
            {activeTab === "partnerships" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Partnerkapcsolatok
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Az Önhöz kapcsolódó partnerkapcsolatok és együttműködések.
                    </p>
                  </div>
                </div>

                <StudentPartnershipsList
                  partnerships={partnerships}
                  isLoading={partnershipsLoading}
                />
              </div>
            )}
            {activeTab === "guide" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      <span className="text-3xl">📚</span>
                    </div>

                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                      Tananyag és útmutató
                    </h1>

                    <p className="text-slate-600 max-w-md mx-auto">
                      Kövesd a lépéseket a tananyag elsajátításához.
                    </p>
                  </div>

                  <GuidePlayer />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
