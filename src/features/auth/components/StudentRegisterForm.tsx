import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import type { StudentRegisterPayload } from "../../../lib/api";
import PasswordInput from "../../../components/shared/PasswordInput";
import {
  isValidEmail,
  normalizeNeptun,
  validatePassword,
} from "../../../utils/validation-utils";
import { LANGUAGES, LANGUAGE_LEVELS } from "../constants";
import { useMajors } from "../../majors";

export default function StudentRegisterForm() {
  const navigate = useNavigate();
  const { majors, loading: majorsLoading } = useMajors();

  // fiók
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // profil
  const [mothersName, setMothersName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // YYYY-MM-DD
  const [country, setCountry] = useState("Magyarország");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [highSchool, setHighSchool] = useState("");
  const [highSchoolCity, setHighSchoolCity] = useState("");
  const [graduationYear, setGraduationYear] = useState<number | "">("");

  // University specific
  const [neptunCode, setNeptunCode] = useState("");
  const [majorId, setMajorId] = useState("");

  // High School specific
  const [firstChoiceId, setFirstChoiceId] = useState("");
  const [secondChoiceId, setSecondChoiceId] = useState("");

  const [studyMode, setStudyMode] = useState<"NAPPALI" | "LEVELEZŐ">("NAPPALI");
  const [hasLanguageCert, setHasLanguageCert] = useState(false);

  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [languageLevel, setLanguageLevel] = useState(LANGUAGE_LEVELS[0]);

  const [studentType, setStudentType] = useState<"HIGHSCHOOL" | "UNIVERSITY">(
    "HIGHSCHOOL",
  );
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    // validálás
    if (!isValidEmail(email)) return setError("Érvénytelen e-mail cím.");

    const passwordError = validatePassword(password, 12);
    if (passwordError) return setError(passwordError);

    // Stricter password regex match to align with backend
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{12,64}$/;
    if (!passwordRegex.test(password)) {
      return setError(
        "A jelszónak legalább 12 karakter hosszúnak kell lennie, és tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert."
      );
    }

    if (!fullName.trim().includes(" ")) {
      return setError("A teljes névnek legalább egy szóközt kell tartalmaznia.");
    }

    if (!/^\+?[0-9]{7,15}$/.test(phoneNumber.trim())) {
      return setError("Érvénytelen telefonszám formátum.");
    }

    if (!mothersName.trim().includes(" ")) {
      return setError("Az anyja nevének legalább egy szóközt kell tartalmaznia.");
    }

    if (!birthDate) return setError("Születési dátum megadása kötelező.");

    const birth = new Date(birthDate);
    const minBirth = new Date("1900-01-01");
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (birth < minBirth) {
      return setError("Túl öreg!");
    }
    if (birth > eighteenYearsAgo) {
      return setError("Túl fiatal! 18 éven aluliak nem regisztrálhatnak.");
    }

    // Lakcím validation (only if any address info is filled, since it is optional)
    const isLocationEntered =
      country.trim() !== "" ||
      zipCode.trim() !== "" ||
      city.trim() !== "" ||
      streetAddress.trim() !== "";

    if (isLocationEntered) {
      if (zipCode.trim() !== "") {
        const zipNum = Number(zipCode.trim());
        if (isNaN(zipNum) || zipNum < 1000 || zipNum > 9999) {
          return setError("Az irányítószámnak 1000 és 9999 között kell lennie.");
        }
      }
      if (streetAddress.trim() !== "") {
        if (!streetAddress.trim().includes(" ")) {
          return setError("A címnek legalább egy szóközt kell tartalmaznia.");
        }
      }
    }

    // Középiskola fields are required in all cases based on studentBaseSchema
    if (!highSchool.trim()) {
      return setError("Középiskola megadása kötelező.");
    }
    if (!highSchoolCity.trim()) {
      return setError("A középiskola helyszíne kötelező.");
    }

    const gradYear = Number(graduationYear);
    const maxYear = new Date().getFullYear() + 1;
    if (isNaN(gradYear) || gradYear < 2000 || gradYear > maxYear) {
      return setError(`Érvénytelen érettségi év (2000 és ${maxYear} között).`);
    }

    if (hasLanguageCert) {
      if (!language) return setError("Nyelv megadása kötelező, ha van nyelvvizsga.");
      if (!languageLevel) return setError("Nyelvvizsga szint megadása kötelező.");
    }

    let payload: StudentRegisterPayload;

    const locationObj = isLocationEntered
      ? {
        country: country.trim() || undefined,
        zipCode: zipCode.trim() ? Number(zipCode.trim()) : undefined,
        city: city.trim() || undefined,
        address: streetAddress.trim() || undefined,
      }
      : undefined;

    const commonData = {
      email: email.trim(),
      password,
      isEmailEnabled,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      role: "STUDENT" as const,
      mothersName: mothersName.trim(),
      dateOfBirth: birthDate,
      location: locationObj,
      highSchool: highSchool.trim(),
      highSchoolLocation: highSchoolCity.trim(),
      studyMode,
      graduationYear: gradYear,
      hasLanguageCert,
      ...(hasLanguageCert ? { language, languageLevel } : {}),
    };

    if (studentType === "HIGHSCHOOL") {
      if (!firstChoiceId) {
        return setError("Első választás kötelező középiskolások számára.");
      }
      if (!secondChoiceId) {
        return setError("Második választás kötelező középiskolások számára.");
      }
      if (firstChoiceId === secondChoiceId) {
        return setError("A két megjelölt szak nem lehet ugyanaz.");
      }

      payload = {
        ...commonData,
        isInHighSchool: true,
        firstChoiceId,
        secondChoiceId,
      };
    } else {
      // UNIVERSITY
      const neptunNormal = neptunCode.trim() ? normalizeNeptun(neptunCode) : undefined;
      if (neptunNormal && neptunNormal.length !== 6) {
        return setError("A neptun kód pontosan 6 karakter hosszú.");
      }

      payload = {
        ...commonData,
        isInHighSchool: false,
        neptunCode: neptunNormal,
        majorId: majorId || undefined,
      };
    }

    if (!gdprAccepted) {
      return setError(
        "A regisztrációhoz el kell fogadni az adatkezelési tájékoztatót."
      );
    }

    setLoading(true);
    try {
      const res = await api.registerStudent(payload);
      setOkMsg(res?.message || "Sikeres regisztráció!");
      setTimeout(() => navigate("/"), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sikertelen regisztráció.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
          {error}
        </div>
      )}
      {okMsg && (
        <div className="mb-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-400 transition-colors">
          {okMsg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Fiók adatok */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none transition-colors">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
            Fiók adatok
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                E-mail *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="diak@student.com"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Teljes név *
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Példa Diák"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Telefonszám *
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+36301234567"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <label className="md:col-span-2 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={isEmailEnabled}
                onChange={(e) => setIsEmailEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              E-mail értesítések engedélyezése
            </label>
          </div>

          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
            Szerepkör automatikusan: <span className="font-mono">STUDENT</span>
          </p>
        </section>

        {/* Személyes adatok */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none transition-colors">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
            Személyes adatok
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Anyja neve *
              </label>
              <input
                value={mothersName}
                onChange={(e) => setMothersName(e.target.value)}
                placeholder="Példa Anya"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Születési dátum *
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Lakcím */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none transition-colors">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
            Lakcím
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Ország
                <span className="text-slate-400 font-normal ml-1">(Opcionális)</span>
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Irányítószám
                <span className="text-slate-400 font-normal ml-1">(Opcionális)</span>
              </label>
              <input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="4028"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Település
                <span className="text-slate-400 font-normal ml-1">(Opcionális)</span>
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Debrecen"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Utca, házszám
                <span className="text-slate-400 font-normal ml-1">(Opcionális)</span>
              </label>
              <input
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Kassai út 26."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Tanulmányok */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none transition-colors">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
            Tanulmányok
          </h2>

          {/* Student Type Selector */}
          <div className="mb-6 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="studentType"
                value="HIGHSCHOOL"
                checked={studentType === "HIGHSCHOOL"}
                onChange={() => setStudentType("HIGHSCHOOL")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">
                Középiskolás
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="studentType"
                value="UNIVERSITY"
                checked={studentType === "UNIVERSITY"}
                onChange={() => setStudentType("UNIVERSITY")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">
                Egyetemista
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Középiskola *
              </label>
              <input
                value={highSchool}
                onChange={(e) => setHighSchool(e.target.value)}
                placeholder="Tóth Árpád Gimnázium"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Középiskola városa *
              </label>
              <input
                value={highSchoolCity}
                onChange={(e) => setHighSchoolCity(e.target.value)}
                placeholder="Debrecen"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                Érettségi éve *
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) =>
                  setGraduationYear(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                placeholder="2026"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* MOVED: Képzési forma is now under the new section below */}

            {/* Conditional Fields based on Student Type */}
            {studentType === "UNIVERSITY" ? (
              <>
                {/* NEPTUN (Uni only) */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                    Neptun kód *
                  </label>
                  <input
                    value={neptunCode}
                    onChange={(e) => setNeptunCode(e.target.value)}
                    placeholder="ABC123"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
                    6 karakter (A–Z, 0–9).
                  </p>
                </div>

                {/* MAJOR (Uni - single select) */}
                <div className="md:col-span-2 mt-4 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors">
                    Egyetemi jelentkezés / Szak
                  </h3>
                </div>

                <div className="space-y-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Képzési forma MOVED HERE ALSO for consistency */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Képzési forma *
                    </label>
                    <select
                      value={studyMode}
                      onChange={(e) =>
                        setStudyMode(e.target.value as "NAPPALI" | "LEVELEZŐ")
                      }
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <option value="NAPPALI">NAPPALI</option>
                      <option value="LEVELEZŐ" disabled>LEVELEZŐ (hamarosan)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Szak megnevezése *
                    </label>
                    <select
                      value={majorId}
                      onChange={(e) => setMajorId(e.target.value)}
                      disabled={majorsLoading}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                    >
                      <option value="">
                        {majorsLoading ? "Betöltés..." : "Válassz szakot..."}
                      </option>
                      {majors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                          {m.language ? ` (${m.language})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* HIGH SCHOOL - First & Second Choice */}
                <div className="md:col-span-2 mt-4 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors">
                    Egyetemi jelentkezés / Szak
                  </h3>
                </div>

                <div className="space-y-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Képzési forma MOVED HERE */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Képzési forma *
                    </label>
                    <select
                      value={studyMode}
                      onChange={(e) =>
                        setStudyMode(e.target.value as "NAPPALI" | "LEVELEZŐ")
                      }
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <option value="NAPPALI">NAPPALI</option>
                      <option value="LEVELEZŐ" disabled>LEVELEZŐ (hamarosan)</option>
                    </select>
                  </div>

                  {/* Spacer to align grid if needed, or just let them flow */}
                  <div className="hidden md:block"></div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Helyszín 1. választás (Szak) *
                    </label>
                    <select
                      value={firstChoiceId}
                      onChange={(e) => setFirstChoiceId(e.target.value)}
                      disabled={majorsLoading}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
                    >
                      <option value="">
                        {majorsLoading ? "Betöltés..." : "Válassz szakot..."}
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
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Helyszín 2. választás (Szak) *
                    </label>
                    <select
                      value={secondChoiceId}
                      onChange={(e) => setSecondChoiceId(e.target.value)}
                      disabled={majorsLoading}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-colors"
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
                          disabled={m.id === firstChoiceId}
                        >
                          {m.name}
                          {m.language ? ` (${m.language})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Language Cert - Only for University based on Schema, but generic UI allows it. 
                  However, based on strict 'hasLanguageCert: false' in HS schema, 
                  I will hide it for HS to avoid user confusion and payload mismatch. 
              */}
            <div className="md:col-span-2 space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <input
                  id="langCert"
                  type="checkbox"
                  checked={hasLanguageCert}
                  onChange={(e) => setHasLanguageCert(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="langCert"
                  className="text-sm text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Van nyelvvizsgám
                </label>
              </div>

              {hasLanguageCert && (
                <div className="grid grid-cols-2 gap-4 pl-7">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Nyelv *
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                      Szint *
                    </label>
                    <select
                      value={languageLevel}
                      onChange={(e) => setLanguageLevel(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {LANGUAGE_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* GDPR */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-4 transition-colors">
          <input
            id="gdpr"
            type="checkbox"
            checked={gdprAccepted}
            onChange={(e) => setGdprAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="gdpr"
            className="text-sm text-blue-900 dark:text-blue-100 cursor-pointer transition-colors"
          >
            Elfogadom az{" "}
            <a
              href="https://nje.hu/adatkezelesi-nyilatkozat"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              adatkezelési tájékoztatót
            </a>
            , és hozzájárulok adataim kezeléséhez a regisztráció során.
          </label>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Vissza a belépéshez
          </Link>

          <button
            type="submit"
            disabled={loading || !gdprAccepted}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Regisztráció..." : "Regisztráció"}
          </button>
        </div>
      </form>
    </div>
  );
}
