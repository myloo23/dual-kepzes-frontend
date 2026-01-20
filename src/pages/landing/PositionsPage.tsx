import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Position } from "../../lib/api";
import ApplicationModal from "../../components/applications/ApplicationModal";
import FilterSidebar from "../../components/positions/FilterSidebar";
import PositionCard from "../../components/positions/PositionCard";
import PositionsMap from "../../components/positions/PositionsMap";
import {
  norm,
  lower,
  parseDate,
  toTagName,
  toTagCategory,
  isExpired,
  pickLogo,
} from "../../lib/positions-utils";

// ideiglenes logók
import abcTechLogo from "../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../assets/logos/business-it.jpg";

type SortKey = "NEWEST" | "DEADLINE_ASC" | "DEADLINE_DESC" | "TITLE_ASC";
type DeadlineFilter = "ALL" | "7D" | "30D" | "90D" | "NO_DEADLINE";

export default function PositionsPage() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // szűrők
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>("ALL");
  const [company, setCompany] = useState<string>("ALL");
  const [tagCategory, setTagCategory] = useState<string>("ALL");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("ALL");
  const [activeOnly, setActiveOnly] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("NEWEST");


  // Application modal state
  const [applicationModal, setApplicationModal] = useState<{
    isOpen: boolean;
    position: Position | null;
  }>({ isOpen: false, position: null });
  const [applicationSuccess, setApplicationSuccess] = useState<string | null>(null);

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

  // Check if we should auto-open a position from map navigation
  useEffect(() => {
    if (positions.length === 0) return;

    const openPositionId = sessionStorage.getItem('openPositionId');
    if (openPositionId) {
      // Clear the flag
      sessionStorage.removeItem('openPositionId');

      // Find and open the position
      const position = positions.find(p => String(p.id) === openPositionId);
      if (position) {
        console.log("🗺️ Auto-opening position from map:", position.title);
        setApplicationModal({ isOpen: true, position });
      }
    }
  }, [positions]);

  // Get user location for map
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Navigate to company profile page
  const showCompanyInfo = async (companyData: { id?: string | number; name?: string; logoUrl?: string | null; hqCity?: string } | undefined) => {
    console.log("🏢 showCompanyInfo called with:", companyData);

    if (!companyData || !companyData.name) {
      console.error("❌ No company data available");
      alert("Nincs elérhető céginformáció.");
      return;
    }

    let targetId = companyData.id;

    // If no ID, try to find it from the list of companies
    if (!targetId) {
      console.log("⚠️ No company ID, trying to fetch by name:", companyData.name);
      try {
        const allCompanies = await api.companies.list();
        const matchingCompany = allCompanies.find(
          (c) => c.name.trim().toLowerCase() === companyData.name!.trim().toLowerCase()
        );

        if (matchingCompany) {
          targetId = matchingCompany.id;
        }
      } catch (error) {
        console.error("❌ Failed to fetch companies list:", error);
      }
    }

    if (targetId) {
      navigate(`/companies/${targetId}`);
    } else {
      console.warn("⚠️ Could not find company ID for navigation");
      // Fallback or alert if absolutely necessary, but ideally we should always have an ID
      alert("Nem található a cég profilja.");
    }
  };

  // Handle apply button click
  const handleApply = (positionId: string | number) => {
    const position = positions.find(p => String(p.id) === String(positionId));
    if (!position) return;

    setApplicationModal({ isOpen: true, position });
  };

  // Handle application submission
  const handleSubmitApplication = async (note: string) => {
    if (!applicationModal.position?.id) return;

    try {
      await api.applications.submit({
        positionId: String(applicationModal.position.id),
        studentNote: note || undefined,
      });

      setApplicationSuccess("Sikeres jelentkezés! Hamarosan értesítünk a válaszról.");
      setApplicationModal({ isOpen: false, position: null });

      // Clear success message after 5 seconds
      setTimeout(() => setApplicationSuccess(null), 5000);
    } catch (err: any) {
      throw new Error(err.message || "Hiba történt a jelentkezés során.");
    }
  };

  const derived = useMemo(() => {
    const citySet = new Set<string>();
    const companySet = new Set<string>();
    const tagSet = new Set<string>();
    const categorySet = new Set<string>();

    for (const p of positions) {
      const c = norm(p.city);
      if (c) citySet.add(c);

      const companyName = norm(p.company?.name || "");
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
      const companyName = norm(p.company?.name || "");
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
      const s = p.createdAt ?? p.updatedAt;
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
      {/* Térkép */}
      {!loading && filtered.length > 0 && !applicationModal.isOpen && (
        <div className="mb-8">
          <PositionsMap
            positions={filtered}
            userLocation={userLocation}
            onPositionClick={handleApply}
          />
        </div>
      )}

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
        {/* SZŰRŐK */}
        <FilterSidebar
          search={search}
          city={city}
          company={company}
          tagCategory={tagCategory}
          deadlineFilter={deadlineFilter}
          activeOnly={activeOnly}
          selectedTags={selectedTags}
          sortKey={sortKey}
          setSearch={setSearch}
          setCity={setCity}
          setCompany={setCompany}
          setTagCategory={setTagCategory}
          setDeadlineFilter={setDeadlineFilter}
          setActiveOnly={setActiveOnly}
          setSelectedTags={setSelectedTags}
          setSortKey={setSortKey}
          derived={derived}
          onResetFilters={resetFilters}
          onToggleTag={toggleTag}
        />

        {/* KÁRTYÁK */}
        <section className="min-w-0">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              Nincs a szűrési feltételeknek megfelelő pozíció.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {filtered.map((p) => {
                const companyKey = norm(p.company?.id ?? p.companyId ?? p.company?.name);
                const logo = pickLogo(companyKey, { logo1: abcTechLogo, logo2: businessItLogo });

                return (
                  <PositionCard
                    key={String(p.id ?? `${p.company?.name}-${p.title}-${p.city}`)}
                    position={p}
                    logo={logo}
                    onCompanyClick={showCompanyInfo}
                    onApply={handleApply}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>



      {/* Application Modal */}
      {applicationModal.position && (
        <ApplicationModal
          isOpen={applicationModal.isOpen}
          position={{
            id: String(applicationModal.position.id),
            title: applicationModal.position.title || "Pozíció",
            company: applicationModal.position.company,
            city: applicationModal.position.city || (applicationModal.position as any).location?.city,
            address: applicationModal.position.address || (applicationModal.position as any).location?.address,
          }}
          onClose={() => setApplicationModal({ isOpen: false, position: null })}
          onSubmit={handleSubmitApplication}
        />
      )}

      {/* Success Message */}
      {applicationSuccess && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-lg">
            <p className="text-sm font-medium text-green-800">
              ✅ {applicationSuccess}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
