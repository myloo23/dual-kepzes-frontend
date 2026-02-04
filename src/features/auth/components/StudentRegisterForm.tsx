import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import type { StudentRegisterPayload } from "../../../lib/api";
import PasswordInput from "../../../components/shared/PasswordInput";
import {
  isValidEmail,
  normalizeNeptun,
  validateNeptunOptional,
  validatePassword,
  validateRequired,
  validateYear,
} from "../../../utils/validation-utils";
import { MAJORS, LANGUAGES, LANGUAGE_LEVELS } from "../constants";

export default function StudentRegisterForm() {
  const navigate = useNavigate();

  // fiók
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const [graduationYear, setGraduationYear] = useState<number | "">("");
  const [neptunCode, setNeptunCode] = useState("");
  // const [currentMajor, setCurrentMajor] = useState(""); // Removed in favor of conditional logic
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [universityMajor, setUniversityMajor] = useState("");
  
  const [studyMode, setStudyMode] = useState<"NAPPALI" | "LEVELEZŐ">("NAPPALI");
  const [hasLanguageCert, setHasLanguageCert] = useState(false);
  
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [languageLevel, setLanguageLevel] = useState(LANGUAGE_LEVELS[0]);

  const [studentType, setStudentType] = useState<"HIGHSCHOOL" | "UNIVERSITY">("HIGHSCHOOL");
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

    const requiredFields = [
      { value: fullName, name: "Teljes név" },
      { value: phoneNumber, name: "Telefonszám" },
      { value: mothersName, name: "Anyja neve" },
      { value: country, name: "Ország" },
      { value: zipCode, name: "Irányítószám" },
      { value: city, name: "Település" },
      { value: streetAddress, name: "Utca/házszám" },
      { value: highSchool, name: "Középiskola" },
      // { value: currentMajor, name: "Szak megnevezése" }, // Dynamic check below
    ];

    for (const field of requiredFields) {
      const err = validateRequired(field.value, field.name);
      if (err) return setError(err);
    }

    if (!birthDate) return setError("Születési dátum megadása kötelező.");

    const yearError = validateYear(graduationYear, "Érettségi éve");
    if (yearError) return setError(yearError);

    // Dynamic Validation based on Student Type
    let finalMajor = "";
    let finalNeptun = "";

    if (studentType === "HIGHSCHOOL") {
      if (selectedMajors.length === 0) return setError("Legalább egy szak megjelölése kötelező.");
      finalMajor = selectedMajors.join(", ");
    } else {
      if (!universityMajor) return setError("Szak megnevezése kötelező.");
      finalMajor = universityMajor;
      
      const neptunErr = validateNeptunOptional(neptunCode); // Should be required for Univ? User said "neptun kód legyen bekérve"
      if (!neptunCode) return setError("Neptun kód megadása kötelező egyetemistáknak.");
      if (neptunErr) return setError(neptunErr);
      finalNeptun = normalizeNeptun(neptunCode);
    }

    if (hasLanguageCert) {
        if (!language) return setError("Nyelv kiválasztása kötelező.");
        if (!languageLevel) return setError("Nyelvi szint kiválasztása kötelező.");
    }
    
    if (!gdprAccepted) return setError("A regisztrációhoz el kell fogadni az adatkezelési tájékoztatót.");

    const payload: StudentRegisterPayload = {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      role: "STUDENT",

      mothersName: mothersName.trim(),
      dateOfBirth: birthDate, // "YYYY-MM-DD"
      location: {
        country: country.trim(),
        zipCode: Number(zipCode.trim()), // Convert to number for backend
        city: city.trim(),
        address: streetAddress.trim(),
      },
      highSchool: highSchool.trim(),
      graduationYear: Number(graduationYear),
      currentMajor: finalMajor,
      studyMode,
      hasLanguageCert: !!hasLanguageCert,
      ...(hasLanguageCert ? { language, languageLevel } : {}),

      ...(finalNeptun ? { neptunCode: finalNeptun } : {}),
    };

    setLoading(true);
    try {
      const res = await api.registerStudent(payload);
      setOkMsg(res?.message || "Sikeres regisztráció!");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      setError(err?.message || "Sikertelen regisztráció.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {okMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {okMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Fiók adatok */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Fiók adatok</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">E-mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="diak@student.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Teljes név *</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Példa Diák"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Telefonszám *</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+36301234567"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              Szerepkör automatikusan: <span className="font-mono">STUDENT</span>
            </p>
          </section>

          {/* Személyes adatok */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Személyes adatok</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Anyja neve *</label>
                <input
                  value={mothersName}
                  onChange={(e) => setMothersName(e.target.value)}
                  placeholder="Példa Anya"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Születési dátum *</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Lakcím */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Lakcím</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Ország *</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Irányítószám *</label>
                <input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="4028"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Település *</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Debrecen"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">Utca, házszám *</label>
                <input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Kassai út 26."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Tanulmányok */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Tanulmányok</h2>

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
                    <span className="text-sm text-slate-700">Középiskolás</span>
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
                    <span className="text-sm text-slate-700">Egyetemista</span>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">Középiskola *</label>
                <input
                  value={highSchool}
                  onChange={(e) => setHighSchool(e.target.value)}
                  placeholder="Tóth Árpád Gimnázium"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Érettségi éve *</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : "")}
                  placeholder="2019"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {studentType === "UNIVERSITY" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Neptun kód *
                    </label>
                    <input
                      value={neptunCode}
                      onChange={(e) => setNeptunCode(e.target.value)}
                      placeholder="ABC123"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-500">6 karakter (A–Z, 0–9).</p>
                  </div>
              )}

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">
                    {studentType === "HIGHSCHOOL" ? "Megjelölt szak az egyetemen" : "Szak megnevezése *"}
                </label>
                
                {studentType === "HIGHSCHOOL" ? (
                    <div className="space-y-2">
                        {selectedMajors.map((major, idx) => (
                            <div key={idx} className="flex gap-2">
                                <select
                                    value={major}
                                    onChange={(e) => {
                                        const newMajors = [...selectedMajors];
                                        newMajors[idx] = e.target.value;
                                        setSelectedMajors(newMajors);
                                    }}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Válassz szakot...</option>
                                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedMajors(selectedMajors.filter((_, i) => i !== idx))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {selectedMajors.length === 0 && (
                             <select
                                value=""
                                onChange={(e) => setSelectedMajors([e.target.value])}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Válassz szakot...</option>
                                {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        )}
                        {selectedMajors.length > 0 && selectedMajors.length < 2 && (
                            <button
                                type="button"
                                onClick={() => setSelectedMajors([...selectedMajors, ""])}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                + Új szak hozzáadása
                            </button>
                        )}
                    </div>
                ) : (
                    <select
                        value={universityMajor}
                        onChange={(e) => setUniversityMajor(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Válassz szakot...</option>
                        {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Képzési forma *</label>
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value as "NAPPALI" | "LEVELEZŐ")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NAPPALI">NAPPALI</option>
                  <option value="LEVELEZŐ">LEVELEZŐ</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-4 pt-2">
                <div className="flex items-center gap-3">
                    <input
                    id="langCert"
                    type="checkbox"
                    checked={hasLanguageCert}
                    onChange={(e) => setHasLanguageCert(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="langCert" className="text-sm text-slate-700">
                    Van nyelvvizsgám
                    </label>
                </div>
                
                {hasLanguageCert && (
                    <div className="grid grid-cols-2 gap-4 pl-7">
                         <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Nyelv *</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Szint *</label>
                            <select
                                value={languageLevel}
                                onChange={(e) => setLanguageLevel(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {LANGUAGE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                         </div>
                    </div>
                )}
              </div>
            </div>
          </section>

          {/* GDPR */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <input
                id="gdpr"
                type="checkbox"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="gdpr" className="text-sm text-blue-900 cursor-pointer">
                  Elfogadom az <span className="font-semibold underline">adatkezelési tájékoztatót</span>, és hozzájárulok adataim kezeléséhez a regisztráció során.
              </label>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
              Vissza a belépéshez
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Regisztráció..." : "Regisztráció"}
            </button>
          </div>
        </form>
    </div>
  );
}
