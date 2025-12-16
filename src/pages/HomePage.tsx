import { useState } from "react";

type Role =
  | "STUDENT"
  | "COMPANY_ADMIN"
  | "MENTOR"
  | "UNI_STAFF"
  | "UNI_ADMIN";

function HomePage() {
  const [role, setRole] = useState<Role>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Itt majd a /api/v1/auth/login endpointot hívjuk meg 🙂");
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
            <div className="space-y-1">
              <label className="font-medium text-slate-700">
                Szerepkör
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as Role)
                }
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="STUDENT">Hallgató</option>
                <option value="COMPANY_ADMIN">
                  Céges partner
                </option>
                <option value="MENTOR">Mentor</option>
                <option value="UNI_STAFF">
                  Egyetemi dolgozó
                </option>
                <option value="UNI_ADMIN">
                  Adminisztrátor
                </option>
              </select>
            </div>

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
              <label className="font-medium text-slate-700">
                Jelszó
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition"
            >
              Belépés
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Még nincs fiókod?</span>
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline"
              onClick={() =>
                alert(
                  "Itt majd a hallgatói regisztráció oldal / modul fog megnyílni."
                )
              }
            >
              Hallgatói regisztráció
            </button>
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
