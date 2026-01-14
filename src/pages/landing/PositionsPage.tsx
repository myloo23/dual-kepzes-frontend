import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import CompanyInfoModal from "../../components/CompanyInfoModal";

// ideiglenes logók
import abcTechLogo from "../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../assets/logos/business-it.jpg";

type TagLike = { name?: string; category?: string } | string;

type Position = {
  id?: string | number;
  title?: string;
  description?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  deadline?: string; // ISO
  tags?: TagLike[];
  companyId?: string | number;
  company?: { id?: string | number; name?: string; companyName?: string };
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow additional properties
};

type SortKey = "NEWEST" | "DEADLINE_ASC" | "DEADLINE_DESC" | "TITLE_ASC";

type DeadlineFilter = "ALL" | "7D" | "30D" | "90D" | "NO_DEADLINE";

function toTagName(t: TagLike): string {
  if (typeof t === "string") return t;
  return t?.name ?? "";
}
function toTagCategory(t: TagLike): string {
  if (typeof t === "string") return "Technology";
  return t?.category ?? "Technology";
}
function norm(s: unknown) {
  return String(s ?? "").trim();
}
function lower(s: unknown) {
  return norm(s).toLowerCase();
}
function parseDate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
function formatHuDate(s?: string) {
  const d = parseDate(s);
  if (!d) return "—";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}.`;
}
function isExpired(deadline?: string) {
  const d = parseDate(deadline);
  if (!d) return false;
  const now = new Date();
  return d.getTime() < now.getTime();
}

function pickLogo(companyKey: string) {
  // determinisztikusan válassz a 2 logó közül
  let sum = 0;
  for (let i = 0; i < companyKey.length; i++) sum += companyKey.charCodeAt(i);
  return sum % 2 === 0 ? abcTechLogo : businessItLogo;
}

function ChipButton(props: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      className={[
        "rounded-full border px-3 py-1 text-[11px] transition-colors",
        props.active
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // szűrők
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>("ALL");
  const [company, setCompany] = useState<string>("ALL");
  const [tagCategory, setTagCategory] = useState<string>("ALL");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("ALL");
  const [activeOnly, setActiveOnly] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("NEWEST");

  // Company modal state - használjuk a position-ből elérhető adatokat vagy API-ból lekért teljes adatokat
  const [selectedCompanyInfo, setSelectedCompanyInfo] = useState<{
    name: string;
    logoUrl?: string | null;
    hqCity?: string;
    description?: string;
    contactName?: string;
    contactEmail?: string;
    website?: string;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.positions.listPublic();
        console.log("📦 Positions API response:", res);
        if (Array.isArray(res) && res.length > 0) {
          console.log("📦 First position structure:", res[0]);
          console.log("📦 First position JSON:", JSON.stringify(res[0], null, 2));
          console.log("📦 First position companyId:", res[0]?.companyId);
          console.log("📦 First position company:", (res[0] as any)?.company);
          console.log("📦 All keys in position:", Object.keys(res[0]));
        }
        setPositions(Array.isArray(res) ? (res as Position[]) : []);
      } catch (e) {
        console.error(e);
        setError("A pozíciók betöltése sikertelen volt.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Show company info from position data or fetch from API by name
  const showCompanyInfo = async (companyData: { id?: string | number; name?: string; logoUrl?: string | null; hqCity?: string } | undefined) => {
    console.log("🏢 showCompanyInfo called with:", companyData);

    if (!companyData || !companyData.name) {
      console.error("❌ No company data available");
      alert("Nincs elérhető céginformáció.");
      return;
    }

    // Ha van company ID, lekérjük ID alapján
    if (companyData.id) {
      console.log("📡 Fetching full company details with ID:", companyData.id);
      try {
        const fullCompany = await api.companies.get(companyData.id);
        console.log("✅ Full company data received:", fullCompany);
        setSelectedCompanyInfo({
          name: fullCompany.name,
          logoUrl: fullCompany.logoUrl ?? undefined,
          hqCity: fullCompany.hqCity,
          description: fullCompany.description,
          contactName: fullCompany.contactName,
          contactEmail: fullCompany.contactEmail,
          website: fullCompany.website ?? undefined
        });
        return;
      } catch (error) {
        console.error("❌ Failed to fetch full company data:", error);
      }
    }

    // Nincs ID - próbáljuk név alapján
    console.log("⚠️ No company ID, trying to fetch by name:", companyData.name);
    try {
      const allCompanies = await api.companies.list();
      console.log("📋 Fetched all companies, searching for:", companyData.name);

      const matchingCompany = allCompanies.find(
        (c) => c.name.trim().toLowerCase() === companyData.name!.trim().toLowerCase()
      );

      if (matchingCompany) {
        console.log("✅ Found matching company:", matchingCompany);
        setSelectedCompanyInfo({
          name: matchingCompany.name,
          logoUrl: matchingCompany.logoUrl ?? undefined,
          hqCity: matchingCompany.hqCity,
          description: matchingCompany.description,
          contactName: matchingCompany.contactName,
          contactEmail: matchingCompany.contactEmail,
          website: matchingCompany.website ?? undefined
        });
        return;
      } else {
        console.warn("⚠️ No matching company found by name");
      }
    } catch (error) {
      console.error("❌ Failed to fetch companies list:", error);
    }

    // Fallback: csak a position-ből elérhető adatokat használjuk
    console.log("⚠️ Using limited data from position");
    setSelectedCompanyInfo({
      name: companyData.name,
      logoUrl: companyData.logoUrl,
      hqCity: companyData.hqCity
    });
  };

  const derived = useMemo(() => {
    const citySet = new Set<string>();
    const companySet = new Set<string>();
    const tagSet = new Set<string>();
    const categorySet = new Set<string>();

    for (const p of positions) {
      const c = norm(p.city);
      if (c) citySet.add(c);

      const companyName = norm(p.company?.name || p.company?.companyName);
      if (companyName) companySet.add(companyName);

      const tags = Array.isArray(p.tags) ? p.tags : [];
      for (const t of tags) {
        const name = norm(toTagName(t));
        if (name) tagSet.add(name);
        categorySet.add(norm(toTagCategory(t)) || "Technology");
      }
    }

    const cities = Array.from(citySet).sort((a, b) => a.localeCompare(b, "hu"));
    const companies = Array.from(companySet).sort((a, b) => a.localeCompare(b, "hu"));
    const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, "hu"));
    const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b, "hu"));

    // “régi” chip-es élmény: ha kevés opció van, mutatunk chipet, ha sok → dropdown.
    const showCityChips = cities.length > 0 && cities.length <= 10;
    const showCompanyChips = companies.length > 0 && companies.length <= 10;

    return { cities, companies, tags, categories, showCityChips, showCompanyChips };
  }, [positions]);

  const resetFilters = () => {
    setSearch("");
    setCity("ALL");
    setCompany("ALL");
    setTagCategory("ALL");
    setDeadlineFilter("ALL");
    setActiveOnly(true);
    setSelectedTags([]);
    setSortKey("NEWEST");
  };

  const toggleTag = (name: string) => {
    setSelectedTags((prev) => {
      const n = norm(name);
      if (!n) return prev;
      const has = prev.some((x) => lower(x) === lower(n));
      if (has) return prev.filter((x) => lower(x) !== lower(n));
      return [...prev, n];
    });
  };

  const filtered = useMemo(() => {
    const now = new Date();

    const withinNextDays = (deadline: string | undefined, days: number) => {
      const d = parseDate(deadline);
      if (!d) return false;
      const diff = d.getTime() - now.getTime();
      return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
    };

    const matchesSelectedTagsAND = (p: Position) => {
      if (selectedTags.length === 0) return true;
      const tags = (Array.isArray(p.tags) ? p.tags : []).map((t) => lower(toTagName(t))).filter(Boolean);
      // AND: mindegyik kiválasztott tag szerepeljen
      return selectedTags.every((t) => tags.includes(lower(t)));
    };

    const matchesCategory = (p: Position) => {
      if (tagCategory === "ALL") return true;
      const tags = Array.isArray(p.tags) ? p.tags : [];
      return tags.some((t) => norm(toTagCategory(t)) === tagCategory);
    };

    const matchesDeadlineFilter = (p: Position) => {
      if (deadlineFilter === "ALL") return true;
      if (deadlineFilter === "NO_DEADLINE") return !parseDate(p.deadline);
      if (deadlineFilter === "7D") return withinNextDays(p.deadline, 7);
      if (deadlineFilter === "30D") return withinNextDays(p.deadline, 30);
      if (deadlineFilter === "90D") return withinNextDays(p.deadline, 90);
      return true;
    };

    const q = lower(search);
    const out = positions.filter((p) => {
      const companyName = norm(p.company?.name || p.company?.companyName || "");
      const cty = norm(p.city);
      const title = norm(p.title);
      const addr = norm(p.address);
      const tagsText = (Array.isArray(p.tags) ? p.tags : [])
        .map((t) => norm(toTagName(t)))
        .filter(Boolean)
        .join(" ");

      if (q) {
        const hay = lower(`${title} ${companyName} ${cty} ${addr} ${tagsText}`);
        if (!hay.includes(q)) return false;
      }

      if (city !== "ALL" && norm(p.city) !== city) return false;
      if (company !== "ALL" && companyName !== company) return false;

      if (activeOnly && isExpired(p.deadline)) return false;

      if (!matchesCategory(p)) return false;
      if (!matchesSelectedTagsAND(p)) return false;
      if (!matchesDeadlineFilter(p)) return false;

      return true;
    });

    const getCreatedLikeTs = (p: Position) => {
      const s = p.createdAt ?? p.updatedAt ?? p.created_at ?? p.updated_at;
      const d = parseDate(s);
      return d ? d.getTime() : 0;
    };
    const getDeadlineTs = (p: Position) => {
      const d = parseDate(p.deadline);
      return d ? d.getTime() : 0;
    };

    out.sort((a, b) => {
      if (sortKey === "TITLE_ASC") return norm(a.title).localeCompare(norm(b.title), "hu");
      if (sortKey === "DEADLINE_ASC") return getDeadlineTs(a) - getDeadlineTs(b);
      if (sortKey === "DEADLINE_DESC") return getDeadlineTs(b) - getDeadlineTs(a);

      // NEWEST: createdAt/updatedAt ha van, különben deadline desc
      const ta = getCreatedLikeTs(a);
      const tb = getCreatedLikeTs(b);
      if (ta !== 0 || tb !== 0) return tb - ta;
      return getDeadlineTs(b) - getDeadlineTs(a);
    });

    return out;
  }, [positions, search, city, company, tagCategory, deadlineFilter, activeOnly, selectedTags, sortKey]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 text-center text-slate-600">Betöltés…</div>;
  }
  if (error) {
    return <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* fejléc */}
      <header className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Elérhető állások</h1>
          <p className="text-sm text-slate-600">A jelenleg elérhető pozíciók a backendből töltődnek be.</p>
        </div>
        <div className="text-xs text-slate-500">
          Találatok:{" "}
          <span className="font-semibold text-slate-800">{filtered.length}</span> / {positions.length}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)]">
        {/* SZŰRŐK (régi hangulat + skálázható) */}
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Szűrők</div>
            <button type="button" onClick={resetFilters} className="text-xs text-blue-600 hover:underline">
              Alaphelyzet
            </button>
          </div>

          {/* keresés */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Keresés cím vagy cég alapján</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pl. szoftverfejlesztő, rendszer…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* város */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Képzés helyszíne</div>

            {derived.showCityChips ? (
              <div className="flex flex-wrap gap-1.5">
                <ChipButton active={city === "ALL"} onClick={() => setCity("ALL")}>
                  Bármely
                </ChipButton>
                {derived.cities.map((c) => (
                  <ChipButton key={c} active={city === c} onClick={() => setCity(c)}>
                    {c}
                  </ChipButton>
                ))}
              </div>
            ) : (
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Bármely</option>
                {derived.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* cég */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Cég neve</div>

            {derived.showCompanyChips ? (
              <div className="flex flex-wrap gap-1.5">
                <ChipButton active={company === "ALL"} onClick={() => setCompany("ALL")}>
                  Bármely
                </ChipButton>
                {derived.companies.map((c) => (
                  <ChipButton key={c} active={company === c} onClick={() => setCompany(c)} title={c}>
                    {c.length > 22 ? c.slice(0, 22) + "…" : c}
                  </ChipButton>
                ))}
              </div>
            ) : (
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Bármely</option>
                {derived.companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* határidő */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Jelentkezési határidő</div>
            <div className="flex flex-wrap gap-1.5">
              <ChipButton active={deadlineFilter === "ALL"} onClick={() => setDeadlineFilter("ALL")}>
                Bármely
              </ChipButton>
              <ChipButton active={deadlineFilter === "7D"} onClick={() => setDeadlineFilter("7D")}>
                7 napon belül
              </ChipButton>
              <ChipButton active={deadlineFilter === "30D"} onClick={() => setDeadlineFilter("30D")}>
                30 napon belül
              </ChipButton>
              <ChipButton active={deadlineFilter === "90D"} onClick={() => setDeadlineFilter("90D")}>
                90 napon belül
              </ChipButton>
              <ChipButton
                active={deadlineFilter === "NO_DEADLINE"}
                onClick={() => setDeadlineFilter("NO_DEADLINE")}
              >
                Nincs megadva
              </ChipButton>
            </div>
          </div>

          {/* tag kategória */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Tag kategória</div>
            <select
              value={tagCategory}
              onChange={(e) => setTagCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Bármely</option>
              {derived.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* csak aktív */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div>
              <div className="text-xs font-semibold text-slate-900">Csak aktív</div>
              <div className="text-[11px] text-slate-500">Lejárt határidő ne látszódjon</div>
            </div>

            <button
              type="button"
              onClick={() => setActiveOnly((p) => !p)}
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                activeOnly ? "bg-blue-600" : "bg-slate-300",
              ].join(" ")}
              aria-label="Csak aktív kapcsoló"
            >
              <span
                className={[
                  "inline-block h-5 w-5 transform rounded-full bg-white transition",
                  activeOnly ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
              />
            </button>
          </div>

          {/* rendezés */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Rendezés</div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NEWEST">Legújabb elöl</option>
              <option value="DEADLINE_ASC">Határidő (hamarabb)</option>
              <option value="DEADLINE_DESC">Határidő (később)</option>
              <option value="TITLE_ASC">Cím (A–Z)</option>
            </select>
          </div>

          {/* címkék (multi AND) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-slate-700">Címkék</div>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Törlés
                </button>
              )}
            </div>

            {derived.tags.length === 0 ? (
              <div className="text-xs text-slate-500">Nincsenek címkék.</div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto pr-1">
                {derived.tags.map((t) => {
                  const active = selectedTags.some((x) => lower(x) === lower(t));
                  return (
                    <ChipButton key={t} active={active} onClick={() => toggleTag(t)}>
                      {t}
                    </ChipButton>
                  );
                })}
              </div>
            )}

            <div className="text-[11px] text-slate-500">Tipp: több címke is kiválasztható (AND).</div>
          </div>
        </aside>

        {/* KÁRTYÁK (régi feeling) */}
        <section className="min-w-0">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              Nincs a szűrési feltételeknek megfelelő pozíció.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {filtered.map((p) => {
                const companyName = norm(p.company?.name || p.company?.companyName) || "Ismeretlen cég";
                const title = norm(p.title) || "Névtelen pozíció";
                const cityText = norm(p.city) || "—";
                const deadlineText = formatHuDate(p.deadline);

                const companyKey = norm(p.company?.id ?? p.companyId ?? companyName);
                const logo = pickLogo(companyKey);

                const tags = (Array.isArray(p.tags) ? p.tags : [])
                  .map((t) => norm(toTagName(t)))
                  .filter(Boolean);

                const previewTags = tags.slice(0, 6);
                const hiddenCount = tags.length - previewTags.length;

                const expired = isExpired(p.deadline);

                return (
                  <article
                    key={String(p.id ?? `${companyName}-${title}-${cityText}`)}
                    className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex-grow">
                      {/* felső sor */}
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => {
                            console.log("🖱️ Logo clicked! company data:", p.company);
                            showCompanyInfo(p.company);
                          }}
                          className="h-20 w-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                          title={`${companyName} információi`}
                        >
                          <img src={logo} alt={`${companyName} logó`} className="h-full w-full object-contain" />
                        </button>

                        <div className="min-w-0">
                          <div className="text-xs text-slate-500 mb-1">
                            <button
                              onClick={() => {
                                console.log("🖱️ Company name clicked! company data:", p.company);
                                showCompanyInfo(p.company);
                              }}
                              className="hover:text-blue-600 hover:underline transition cursor-pointer"
                              title={`${companyName} információi`}
                            >
                              {companyName}
                            </button>
                            {" • "}
                            {cityText}
                          </div>

                          <h3 className="text-base font-semibold text-slate-900 leading-snug break-words">
                            {title}
                          </h3>
                        </div>
                      </div>

                      {/* meta chip sor */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                          📍 {cityText}
                        </span>

                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
                            expired
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-800",
                          ].join(" ")}
                        >
                          ⏳ Határidő: {deadlineText}
                        </span>
                      </div>

                      {/* tagek */}
                      {previewTags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {previewTags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                            >
                              {t}
                            </span>
                          ))}
                          {hiddenCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                              +{hiddenCount}
                            </span>
                          )}
                        </div>
                      )}

                      {/* leírás */}
                      {norm(p.description) && (
                        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                          {String(p.description).length > 140
                            ? String(p.description).slice(0, 140) + "…"
                            : String(p.description)}
                        </p>
                      )}

                      {/* alsó meta */}
                      <div className="mt-4 space-y-1 text-xs text-slate-600">
                        {norm(p.address) && (
                          <div>📌 {norm(p.address)}</div>
                        )}
                        {(norm(p.zipCode) || norm(p.city)) && (
                          <div>🏷️ {norm(p.zipCode)} {norm(p.city)}</div>
                        )}
                      </div>

                    </div>
                    {/* CTA */}
                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                      >
                        Részletek és jelentkezés
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Company Info Modal */}
      {(() => {
        console.log("📊 Modal render check:", {
          selectedCompanyInfo,
          isOpen: !!selectedCompanyInfo
        });
        return (
          <CompanyInfoModal
            companyInfo={selectedCompanyInfo}
            isOpen={!!selectedCompanyInfo}
            onClose={() => {
              console.log("🚪 Modal closing");
              setSelectedCompanyInfo(null);
            }}
          />
        );
      })()}
    </div>
  );
}
