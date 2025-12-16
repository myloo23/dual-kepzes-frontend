import { useState } from "react";

type Role = "STUDENT" | "COMPANY_ADMIN" | "MENTOR" | "UNI_STAFF" | "UNI_ADMIN";

type Position = {
  id: number;
  title: string;
  company: string;
  location: string;
  major: string;
  semester: string;
  slots: number;
};

const mockPositions: Position[] = [
  {
    id: 1,
    title: "Junior szoftverfejlesztő gyakornok",
    company: "ABC Tech Kft.",
    location: "Budapest",
    major: "Programtervező informatikus BSc",
    semester: "2024/25/1",
    slots: 3,
  },
  {
    id: 2,
    title: "Automatizálási mérnök gyakornok",
    company: "SmartFactory Zrt.",
    location: "Kecskemét",
    major: "Gépészmérnöki BSc",
    semester: "2024/25/1",
    slots: 2,
  },
  {
    id: 3,
    title: "IT support / rendszergazda gyakornok",
    company: "CloudWorks Hungary",
    location: "Szeged (remote opció)",
    major: "Mérnökinformatikus BSc",
    semester: "2024/25/2",
    slots: 4,
  },
  {
    id: 4,
    title: "Adatbázis fejlesztő gyakornok",
    company: "DataBridge Kft.",
    location: "Budapest",
    major: "Gazdaságinformatikus BSc",
    semester: "2024/25/2",
    slots: 1,
  },
];

function App() {
  const [role, setRole] = useState<Role>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Itt majd a /api/v1/auth/login endpointot hívjuk meg 🙂");
  };

  const handleJobClick = (position: Position) => {
    alert(
      `Itt majd a(z) "${position.title}" pozíció részleteit és a jelentkezést mutatjuk.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
          <div className="font-semibold tracking-tight">
            Duális képzési rendszer
          </div>
          <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
            <a href="#home" className="hover:text-slate-900">
              Kezdőlap
            </a>
            <a href="#positions" className="hover:text-slate-900">
              Elérhető állások
            </a>
            <a href="#how-it-works" className="hover:text-slate-900">
              Hogyan működik?
            </a>
            <a href="#contact" className="hover:text-slate-900">
              Kapcsolat
            </a>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1">
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
                egyetem számára a duális képzés jelentkezési, szerződéses és
                naplózási folyamatainak kezelésére.
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
                    onChange={(e) => setRole(e.target.value as Role)}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="STUDENT">Hallgató</option>
                    <option value="COMPANY_ADMIN">Céges partner</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="UNI_STAFF">Egyetemi dolgozó</option>
                    <option value="UNI_ADMIN">Adminisztrátor</option>
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
                    onChange={(e) => setPassword(e.target.value)}
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

          {/* POZÍCIÓK */}
          <section id="positions" className="py-10 border-t border-slate-200">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">
                Elérhető duális pozíciók
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl">
                A következő duális pozíciók érhetők el jelenleg. A részletek
                megtekintéséhez és a jelentkezéshez nem kötelező a belépés – a
                rendszer publikus álláslistát biztosít.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mockPositions.map((position) => (
                <article
                  key={position.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                    {position.title}
                  </h3>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{position.company}</span>
                    <span>{position.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1.5">
                    {position.major}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mb-3">
                    Szabad helyek: {position.slots}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleJobClick(position)}
                    className="mt-auto inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Részletek
                  </button>
                </article>
              ))}
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
                  A hallgató feltölti a dokumentumait és jelentkezik a számára
                  szimpatikus pozíciókra.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold mb-1">2. Céges kiválasztás</h3>
                <p className="text-slate-600">
                  A céges admin áttekinti a jelentkezéseket, interjút szervez
                  és kiválasztja a megfelelő jelölteket.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold mb-1">3. Szerződés és státusz</h3>
                <p className="text-slate-600">
                  Az egyetem jóváhagyja a duális státuszt, és a rendszer nyomon
                  követi a szerződéses adatokat.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold mb-1">
                  4. Naplózás és értékelés
                </h3>
                <p className="text-slate-600">
                  A hallgató naplózza a tevékenységét, a mentor jóváhagyja,
                  majd félév végén mindkét fél értékel.
                </p>
              </div>
            </div>
          </section>

          {/* KAPCSOLAT */}
          <section id="contact" className="py-10 border-t border-slate-200">
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">
              Kapcsolat
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              A rendszer egyetemi pilot projekt részeként készül. Kérdés esetén
              forduljon az egyetem duális képzési koordinátorához.
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-3">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-xs text-slate-500 text-right">
          © {new Date().getFullYear()} Duális képzési rendszer
        </div>
      </footer>
    </div>
  );
}

export default App;
