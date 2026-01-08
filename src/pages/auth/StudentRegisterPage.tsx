import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import type { StudentRegisterPayload } from "../../lib/api";
import { Eye, EyeOff } from "lucide-react";


function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizeNeptun(code: string) {
  return code.trim().toUpperCase();
}

function validateNeptunOptional(code: string) {
  const c = normalizeNeptun(code);
  if (!c) return null; // üres => ok
  if (!/^[A-Z0-9]{6}$/.test(c)) return "A Neptun kód pontosan 6 karakter (A–Z, 0–9).";
  return null;
}

export default function StudentRegisterPage() {
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
  const [currentMajor, setCurrentMajor] = useState("");
  const [studyMode, setStudyMode] = useState<"NAPPALI" | "LEVELEZŐ">("NAPPALI");
  const [hasLanguageCert, setHasLanguageCert] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  //jelszó megjelenés
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    // validálás (alap)
    if (!isValidEmail(email)) return setError("Érvénytelen e-mail cím.");
    if (password.length < 12) return setError("A jelszó legyen legalább 12 karakter.");
    if (!fullName.trim()) return setError("A teljes név megadása kötelező.");
    if (!phoneNumber.trim()) return setError("Telefonszám megadása kötelező.");

    if (!mothersName.trim()) return setError("Anyja neve megadása kötelező.");
    if (!birthDate) return setError("Születési dátum megadása kötelező.");

    if (!country.trim()) return setError("Ország megadása kötelező.");
    if (!zipCode.trim()) return setError("Irányítószám megadása kötelező.");
    if (!city.trim()) return setError("Település megadása kötelező.");
    if (!streetAddress.trim()) return setError("Utca/házszám megadása kötelező.");

    if (!highSchool.trim()) return setError("Középiskola megadása kötelező.");
    if (graduationYear === "") return setError("Érettségi éve megadása kötelező.");
    if (typeof graduationYear === "number" && (graduationYear < 1950 || graduationYear > 2100)) {
      return setError("Érettségi éve nem tűnik helyesnek.");
    }

    const neptunErr = validateNeptunOptional(neptunCode);
    if (neptunErr) return setError(neptunErr);

    if (!currentMajor.trim()) return setError("Szak megnevezése kötelező.");

    const neptun = normalizeNeptun(neptunCode);

    const payload: StudentRegisterPayload = {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      role: "STUDENT",

      mothersName: mothersName.trim(),
      dateOfBirth: birthDate, // "YYYY-MM-DD"
      country: country.trim(),
      zipCode: zipCode.trim(),
      city: city.trim(),
      streetAddress: streetAddress.trim(),
      highSchool: highSchool.trim(),
      graduationYear: Number(graduationYear),
      currentMajor: currentMajor.trim(),
      studyMode,
      hasLanguageCert: !!hasLanguageCert,

      ...(neptun ? { neptunCode: neptun } : {}),
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Hallgatói regisztráció</h1>
          <p className="text-sm text-slate-600">
            Töltsd ki a kötelező mezőket. A Neptun kód opcionális.
          </p>
        </div>

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

              <div className="space-y-1">
  <label className="text-xs font-medium text-slate-700">Jelszó *</label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Minimum 12 karakter"
      className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
      aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

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

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Neptun kód <span className="text-slate-400">(opcionális)</span>
                </label>
                <input
                  value={neptunCode}
                  onChange={(e) => setNeptunCode(e.target.value)}
                  placeholder="ABC123"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">Ha megadod: 6 karakter (A–Z, 0–9).</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">Szak megnevezése *</label>
                <input
                  value={currentMajor}
                  onChange={(e) => setCurrentMajor(e.target.value)}
                  placeholder="Mérnökinformatikus BSc"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              <div className="flex items-center gap-3 md:pt-6">
                <input
                  id="langCert"
                  type="checkbox"
                  checked={hasLanguageCert}
                  onChange={(e) => setHasLanguageCert(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="langCert" className="text-sm text-slate-700">
                  Van nyelvvizsgám
                </label>
              </div>
            </div>
          </section>

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
    </div>
  );
}
