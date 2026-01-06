import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Eye, EyeOff } from "lucide-react";



function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError(null);
  setLoading(true);

  try {
    const res = await api.login(email.trim(), password);

    // token + user mentése
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("role", res.user.role);

    // role alapú navigáció (most még egyszerű)
    const role = (res.user.role || "").toUpperCase();

    if (role === "ADMIN") navigate("/admin");
    else if (role === "STUDENT") navigate("/student");
    else if (role === "TEACHER" || role === "INSTRUCTOR") navigate("/teacher");
    else if (role === "MENTOR") navigate("/mentor");
    else if (role === "HR" || role === "COMPANY_HR") navigate("/hr");
    else navigate("/student");

  } catch (err: any) {
    setLoginError(err?.message || "Sikertelen bejelentkezés.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8">
      {/* HERO + LOGIN */}
      <section
        id="home"
        className="py-10 lg:py-16 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center"
      >
        <div>
          <p className="text-sm font-medium text-blue-600 mb-2">
            Duális képzések online felülete
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Duális képzési online rendszer
          </h1>
          <p className="text-slate-600 mb-4 max-w-xl">
            Egy egységes platform a hallgatók, céges partnerek és az
            egyetem számára a duális képzés jelentkezési, szerződéses
            és naplózási folyamatainak kezelésére.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-700">
            <li>🎓 Hallgatói jelentkezés és dokumentumfeltöltés</li>
            <li>🏢 Céges pozíciók és jelentkezéskezelés</li>
            <li>📘 Haladási napló és mentor jóváhagyás</li>
            <li>📝 Félév végi értékelések és admin felület</li>
          </ul>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 px-6 py-7">
          <h2 className="text-xl font-semibold mb-1 text-slate-900">
            Belépés
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Válaszd ki a szerepköröd, és jelentkezz be a rendszerbe.
          </p>

          <form
            onSubmit={handleLoginSubmit}
            className="space-y-3 text-sm"
          >
            {loginError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-medium text-slate-700">
                E-mail cím
              </label>
              <input
                type="email"
                placeholder="pelda@uni.hu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
          <label className="font-medium text-slate-700">Jelszó</label>

            <div className="relative">
            <input
             type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
            title={showPassword ? "Elrejtés" : "Megjelenítés"}
          >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          </div>
        </div>
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition disabled:opacity-60">
              {loading ? "Belépés..." : "Belépés"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Elfelejtett jelszó?
            </Link>
            <span>Még nincs fiókod?</span>
            <Link to="/register" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition">
            Regisztráció
            </Link>

          </div>
        </div>
      </section>

      {/* HOGYAN MŰKÖDIK */}
      <section
        id="how-it-works"
        className="py-10 border-t border-slate-200"
      >
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-4">
          Hogyan működik a duális rendszer?
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold mb-1">1. Jelentkezés</h3>
            <p className="text-slate-600">
              A hallgató feltölti a dokumentumait és jelentkezik a
              számára szimpatikus pozíciókra.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold mb-1">
              2. Céges kiválasztás
            </h3>
            <p className="text-slate-600">
              A céges admin áttekinti a jelentkezéseket, interjút
              szervez és kiválasztja a megfelelő jelölteket.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold mb-1">
              3. Szerződés és státusz
            </h3>
            <p className="text-slate-600">
              Az egyetem jóváhagyja a duális státuszt, és a rendszer
              nyomon követi a szerződéses adatokat.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold mb-1">
              4. Naplózás és értékelés
            </h3>
            <p className="text-slate-600">
              A hallgató naplózza a tevékenységét, a mentor
              jóváhagyja, majd félév végén mindkét fél értékel.
            </p>
          </div>
        </div>
      </section>

      {/* KAPCSOLAT */}
      <section
        id="contact"
        className="py-10 border-t border-slate-200"
      >
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">
          Kapcsolat
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          A rendszer egyetemi pilot projekt részeként készül. Kérdés
          esetén forduljon az egyetem duális képzési koordinátorához.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
