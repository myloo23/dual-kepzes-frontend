import { useState } from "react";

// LOGÓK
import logoAbcTech from "../assets/logos/abc-tech.jpg";
import logoBusinessIt from "../assets/logos/business-it.jpg";

type StudyMode = "On-site" | "Online" | "Hybrid";
type LanguageLabel = "Magyar" | "Angol" | "Magyar & angol";

type Position = {
  id: number;
  title: string;
  company: string;
  location: string;          // település
  major: string;             // szak megnevezése
  degree: "BSc" | "MSc";
  duration: string;
  tuition: "Free" | "Paid";
  tuitionLabel: string;
  studyMode: StudyMode;
  language: LanguageLabel;   // Magyar / Angol / Magyar & angol
  industry: string;          // cég iparága
  deadline: string;          // jelentkezési határidő (pl. "2025.01.31.")
  acceptsUpperYears: boolean; // felsőbb évest fogad-e
  logo?: string;
};

const allPositions: Position[] = [
  {
    id: 1,
    title: "Informatika – Duális gyakornoki program",
    company: "DHBW mintaprojekt Kft.",
    location: "Budapest",
    major: "Programtervező informatikus",
    degree: "BSc",
    duration: "6 félév",
    tuition: "Free",
    tuitionLabel: "Tandíjmentes",
    studyMode: "On-site",
    language: "Magyar",
    industry: "Informatika",
    deadline: "2025.01.31.",
    acceptsUpperYears: true,
    logo: logoAbcTech,
  },
  {
    id: 2,
    title: "Gazdaságinformatika – Duális pozíció",
    company: "Business IT Solutions Zrt.",
    location: "Győr",
    major: "Gazdaságinformatikus",
    degree: "BSc",
    duration: "6 félév",
    tuition: "Free",
    tuitionLabel: "Tandíjmentes",
    studyMode: "Hybrid",
    language: "Magyar & angol",
    industry: "Informatika / üzlet",
    deadline: "2025.02.15.",
    acceptsUpperYears: false,
    logo: logoBusinessIt,
  },
  {
    id: 3,
    title: "Informatikai rendszergazda – Duális képzés",
    company: "CloudWorks Hungary",
    location: "Szeged",
    major: "Mérnökinformatikus",
    degree: "BSc",
    duration: "6 félév",
    tuition: "Paid",
    tuitionLabel: "350.000 Ft / félév",
    studyMode: "Online",
    language: "Magyar",
    industry: "IT üzemeltetés",
    deadline: "2025.03.01.",
    acceptsUpperYears: true,
    logo: logoBusinessIt,
  },
  {
    id: 4,
    title: "Adattudomány – Data Science duális program",
    company: "DataBridge Kft.",
    location: "Budapest",
    major: "Informatika",
    degree: "MSc",
    duration: "4 félév",
    tuition: "Paid",
    tuitionLabel: "450.000 Ft / félév",
    studyMode: "Hybrid",
    language: "Angol",
    industry: "Adattudomány",
    deadline: "2025.01.20.",
    acceptsUpperYears: true,
    logo: logoAbcTech,
  },
  {
    id: 5,
    title: "Szoftverfejlesztés – Full-stack duális pozíció",
    company: "NextGen Software Kft.",
    location: "Kecskemét",
    major: "Programtervező informatikus",
    degree: "BSc",
    duration: "6 félév",
    tuition: "Free",
    tuitionLabel: "Tandíjmentes",
    studyMode: "On-site",
    language: "Magyar",
    industry: "Szoftverfejlesztés",
    deadline: "2025.02.28.",
    acceptsUpperYears: false,
    logo: logoBusinessIt,
  },
];

function PositionsPage() {
  // SZŰRŐK ÁLLAPOT
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState<"ALL" | string>("ALL");
  const [locationFilter, setLocationFilter] = useState<"ALL" | string>("ALL");
  const [languageFilter, setLanguageFilter] = useState<
    "ALL" | LanguageLabel
  >("ALL");
  const [deadlineFilter, setDeadlineFilter] = useState<"ALL" | string>("ALL");
  const [upperYearsFilter, setUpperYearsFilter] = useState<
    "ALL" | "YES" | "NO"
  >("ALL");
  const [industryFilter, setIndustryFilter] = useState<"ALL" | string>("ALL");
  const [companyFilter, setCompanyFilter] = useState<"ALL" | string>("ALL");

  // Egyedi értékek a dinamikus gombokhoz
  const majors = Array.from(new Set(allPositions.map((p) => p.major))).sort();
  const locations = Array.from(new Set(allPositions.map((p) => p.location))).sort();
  const languages = Array.from(new Set(allPositions.map((p) => p.language))).sort();
  const deadlines = Array.from(new Set(allPositions.map((p) => p.deadline))).sort();
  const industries = Array.from(new Set(allPositions.map((p) => p.industry))).sort();
  const companies = Array.from(new Set(allPositions.map((p) => p.company))).sort();

  // SZŰRÉS
  const filtered = allPositions.filter((p) => {
    const text = `${p.title} ${p.company} ${p.location} ${p.major}`.toLowerCase();
    if (search.trim() && !text.includes(search.trim().toLowerCase())) {
      return false;
    }
    if (majorFilter !== "ALL" && p.major !== majorFilter) {
      return false;
    }
    if (locationFilter !== "ALL" && p.location !== locationFilter) {
      return false;
    }
    if (languageFilter !== "ALL" && p.language !== languageFilter) {
      return false;
    }
    if (deadlineFilter !== "ALL" && p.deadline !== deadlineFilter) {
      return false;
    }
    if (upperYearsFilter === "YES" && !p.acceptsUpperYears) {
      return false;
    }
    if (upperYearsFilter === "NO" && p.acceptsUpperYears) {
      return false;
    }
    if (industryFilter !== "ALL" && p.industry !== industryFilter) {
      return false;
    }
    if (companyFilter !== "ALL" && p.company !== companyFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
      {/* FELSŐ SOR: cím + szűrés infó */}
      <header className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Informatikai duális pozíciók
          </h1>
          <p className="text-sm text-slate-600">
            Válassz a jelenleg elérhető duális képzési lehetőségek közül
            informatikai és gazdaságinformatikai szakok számára.
          </p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span>
            Találatok:{" "}
            <span className="font-semibold text-slate-800">
              {filtered.length}
            </span>{" "}
            / {allPositions.length}
          </span>
          <span className="hidden sm:inline-block">
            Rendezés:{" "}
            <span className="font-medium text-slate-800">
              Kiemelt (alapértelmezett)
            </span>
          </span>
        </div>
      </header>

      {/* GRID: BAL SZŰRŐK – JOBB KÁRTYÁK */}
      <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        {/* SZŰRŐK */}
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Szűrők
            </h2>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setMajorFilter("ALL");
                setLocationFilter("ALL");
                setLanguageFilter("ALL");
                setDeadlineFilter("ALL");
                setUpperYearsFilter("ALL");
                setIndustryFilter("ALL");
                setCompanyFilter("ALL");
              }}
              className="text-[11px] text-blue-600 hover:underline"
            >
              Összes törlése
            </button>
          </div>

          {/* Keresés */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Keresés cím vagy cég alapján
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pl. szoftverfejlesztő, rendszergazda..."
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* SZAK MEGNEVEZÉSE */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Szak megnevezése
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setMajorFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  majorFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármely
              </button>
              {majors.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMajorFilter(m)}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    majorFilter === m
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* KÉPZÉS HELYSZÍNE */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Képzés helyszíne
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setLocationFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  locationFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármely
              </button>
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationFilter(loc)}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    locationFilter === loc
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* NYELV */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Nyelv
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setLanguageFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  languageFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármely
              </button>
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() =>
                    setLanguageFilter(lang as LanguageLabel)
                  }
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    languageFilter === lang
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* HATÁRIDŐ */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Jelentkezési határidő
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setDeadlineFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  deadlineFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármely
              </button>
              {deadlines.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeadlineFilter(d)}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    deadlineFilter === d
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* FELSŐBB ÉVEST FOGAD-E */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Felsőbb évest fogad-e
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setUpperYearsFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  upperYearsFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármilyen
              </button>
              <button
                type="button"
                onClick={() => setUpperYearsFilter("YES")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  upperYearsFilter === "YES"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Felsőbb évest is fogad
              </button>
              <button
                type="button"
                onClick={() => setUpperYearsFilter("NO")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  upperYearsFilter === "NO"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Csak elsőéveseket fogad
              </button>
            </div>
          </div>

          {/* CÉG IPARÁGA */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Cég iparága
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setIndustryFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  industryFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármely
              </button>
              {industries.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setIndustryFilter(ind)}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    industryFilter === ind
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* CÉG NEVE */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">
              Cég neve
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCompanyFilter("ALL")}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  companyFilter === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Bármely
              </button>
              {companies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompanyFilter(c)}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    companyFilter === c
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* JOB CARDS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {filtered.length} találat a szűrési feltételek alapján
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Nincs a szűrési feltételeknek megfelelő duális pozíció.
              Próbáld módosítani a szűrőket.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  {/* LOGÓ + fejléck */}
                  <header className="mb-3 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={`${p.company} logó`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          LOGO
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">
                        {p.company} • {p.location}
                      </div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        {p.title}
                      </h2>
                    </div>
                  </header>

                  {/* CÍMKÉK – szint, nyelv, szak, iparág, helyszín */}
                  <div className="flex flex-wrap gap-1.5 mb-3 text-[11px]">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                      {p.degree}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                      {p.language}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                      {p.major}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                      {p.industry}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                      {p.location}
                    </span>
                  </div>

                  {/* Részletek – tandíj, határidő, felsőbb éves */}
                  <div className="space-y-1 text-xs mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tandíj</span>
                      <span className="font-medium text-slate-900">
                        {p.tuitionLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">
                        Jelentkezési határidő
                      </span>
                      <span className="font-medium text-slate-900">
                        {p.deadline}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">
                        Felsőbb évest fogad-e
                      </span>
                      <span className="font-medium text-slate-900">
                        {p.acceptsUpperYears
                          ? "Felsőbb évest is fogad"
                          : "Csak elsőéveseket fogad"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                    onClick={() =>
                      alert(
                        "Itt majd a pozíció részletes oldalát nyitjuk meg, ahol be lehet jelentkezni."
                      )
                    }
                  >
                    Részletek és jelentkezés
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default PositionsPage;
