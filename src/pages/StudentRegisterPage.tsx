import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type StudyMode = "Nappali" | "Levelező";

type FormState = {
  // User (auth)
  email: string;
  password: string;
  confirmPassword: string;

  // StudentProfile
  fullName: string;
  mothersName: string;
  birthDate: string; // yyyy-mm-dd (input date)
  address: string;

  highSchool: string;
  graduationYear: string; // input text/number
  neptunCode: string; // optional
  currentMajor: string;
  studyMode: StudyMode;
  hasLanguageCert: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function StudentRegisterPage() {
  const navigate = useNavigate();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",

    fullName: "",
    mothersName: "",
    birthDate: "",
    address: "",

    highSchool: "",
    graduationYear: "",
    neptunCode: "",
    currentMajor: "",
    studyMode: "Nappali",
    hasLanguageCert: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!form.email.trim()) e.email = "Email megadása kötelező.";
    else if (!isValidEmail(form.email)) e.email = "Érvénytelen email formátum.";

    if (!form.password) e.password = "Jelszó megadása kötelező.";
    else if (form.password.length < 8) e.password = "A jelszó legalább 8 karakter legyen.";

    if (!form.confirmPassword) e.confirmPassword = "Jelszó megerősítése kötelező.";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "A két jelszó nem egyezik.";

    if (!form.fullName.trim()) e.fullName = "Teljes név megadása kötelező.";
    if (!form.mothersName.trim()) e.mothersName = "Anyja neve megadása kötelező.";
    if (!form.birthDate) e.birthDate = "Születési dátum megadása kötelező.";
    if (!form.address.trim()) e.address = "Lakcím megadása kötelező.";

    if (!form.highSchool.trim()) e.highSchool = "Középiskola megadása kötelező.";

    if (!form.graduationYear.trim()) {
      e.graduationYear = "Érettségi év megadása kötelező.";
    } else {
      const y = Number(form.graduationYear);
      if (Number.isNaN(y)) e.graduationYear = "Érettségi év csak szám lehet.";
      else if (y < 1950 || y > currentYear + 1) e.graduationYear = "Érettségi év nem tűnik valósnak.";
    }

    // Neptun: opcionális, de ha megadja, legyen 6 karakter alfanumerikus (gyakori)
    if (form.neptunCode.trim()) {
      const v = form.neptunCode.trim().toUpperCase();
      if (!/^[A-Z0-9]{6}$/.test(v)) e.neptunCode = "Neptun kód formátuma: 6 karakter (betű/szám).";
    }

    if (!form.currentMajor.trim()) e.currentMajor = "Szak megadása kötelező.";

    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length > 0) return;

    // Később ez megy majd a backendbe:
    // POST /auth/register (User + StudentProfile)
    // A séma alapján: User(email,password,role=STUDENT) + StudentProfile mezők
    const payload = {
      email: form.email.trim(),
      password: form.password,
      role: "STUDENT",
      studentProfile: {
        fullName: form.fullName.trim(),
        mothersName: form.mothersName.trim(),
        birthDate: form.birthDate, // backend oldalon DateTime-re alakítjátok
        address: form.address.trim(),
        highSchool: form.highSchool.trim(),
        graduationYear: Number(form.graduationYear),
        neptunCode: form.neptunCode.trim() ? form.neptunCode.trim().toUpperCase() : null,
        currentMajor: form.currentMajor.trim(),
        studyMode: form.studyMode,
        hasLanguageCert: form.hasLanguageCert,
      },
    };

    console.log("REGISTER PAYLOAD (mock):", payload);

    setSubmitStatus("success");
    // opcionálisan vissza a kezdőlapra
    setTimeout(() => navigate("/"), 900);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Hallgatói regisztráció
          </h1>
          <p className="text-sm text-slate-600">
            Add meg a szükséges adatokat a fiók létrehozásához.
          </p>
        </div>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          Vissza a kezdőlapra
        </Link>
      </div>

      {submitStatus === "success" && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Sikeres (mock) regisztráció! Átirányítás...
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Fiók adatok */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Fiók adatok
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              placeholder="pl. milan@gmail.com"
              error={errors.email}
              type="email"
            />
            <div />
            <Field
              label="Jelszó"
              value={form.password}
              onChange={(v) => setField("password", v)}
              placeholder="Minimum 8 karakter"
              error={errors.password}
              type="password"
            />
            <Field
              label="Jelszó megerősítése"
              value={form.confirmPassword}
              onChange={(v) => setField("confirmPassword", v)}
              placeholder="Ugyanaz, mint a jelszó"
              error={errors.confirmPassword}
              type="password"
            />
          </div>
        </section>

        {/* Személyes adatok */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Személyes adatok
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Teljes név"
              value={form.fullName}
              onChange={(v) => setField("fullName", v)}
              placeholder="pl. Kovács Milán"
              error={errors.fullName}
            />
            <Field
              label="Anyja neve"
              value={form.mothersName}
              onChange={(v) => setField("mothersName", v)}
              placeholder="pl. Kiss Andrea"
              error={errors.mothersName}
            />
            <Field
              label="Születési dátum"
              value={form.birthDate}
              onChange={(v) => setField("birthDate", v)}
              error={errors.birthDate}
              type="date"
            />
            <Field
              label="Lakcím"
              value={form.address}
              onChange={(v) => setField("address", v)}
              placeholder="pl. 6000 Kecskemét, Fő utca 12."
              error={errors.address}
            />
          </div>
        </section>

        {/* Oktatási adatok */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Oktatási adatok
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Középiskola"
              value={form.highSchool}
              onChange={(v) => setField("highSchool", v)}
              placeholder="pl. Katona József Gimnázium"
              error={errors.highSchool}
            />
            <Field
              label="Érettségi éve"
              value={form.graduationYear}
              onChange={(v) => setField("graduationYear", v)}
              placeholder="pl. 2024"
              error={errors.graduationYear}
              inputMode="numeric"
            />
            <Field
              label="Neptun kód (opcionális)"
              value={form.neptunCode}
              onChange={(v) => setField("neptunCode", v)}
              placeholder="pl. ABC123"
              error={errors.neptunCode}
            />
            <Field
              label="Jelenlegi szak"
              value={form.currentMajor}
              onChange={(v) => setField("currentMajor", v)}
              placeholder="pl. Mérnökinformatikus"
              error={errors.currentMajor}
            />

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Tagozat
              </label>
              <select
                value={form.studyMode}
                onChange={(e) => setField("studyMode", e.target.value as StudyMode)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Nappali">Nappali</option>
                <option value="Levelező">Levelező</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                id="langCert"
                type="checkbox"
                checked={form.hasLanguageCert}
                onChange={(e) => setField("hasLanguageCert", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label htmlFor="langCert" className="text-sm text-slate-700">
                Van nyelvvizsgám
              </label>
            </div>
          </div>
        </section>

        {/* Gombok */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Regisztráció
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg text-sm font-semibold">
            Mégsem, vissza a belépéshez
          </Link>
        </div>

        <p className="text-[11px] text-slate-500">
        Megjegyzés: ez most mock (backend nélkül). Később ugyanezeket az adatokat
        küldjük a backend <code className="font-mono">/auth/register</code> végpontjára,
        ahol létrejön a <code className="font-mono">User</code> és a{" "}
        <code className="font-mono">StudentProfile</code>.
        </p>

      </form>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-700">
        {props.label}
      </label>
      <input
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-blue-500 ${
          props.error
            ? "border-red-300 focus:ring-red-500"
            : "border-slate-300 focus:ring-blue-500"
        }`}
      />
      {props.error && (
        <div className="text-xs text-red-600">{props.error}</div>
      )}
    </div>
  );
}

export default StudentRegisterPage;
