import { useEffect, useState, useMemo } from "react";
import { api, type ReferentsCompaniesStatsResponse } from "@/lib/api";
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Search,
  Mail,
  Globe,
  Loader2,
  AlertCircle,
  Building
} from "lucide-react";

export default function ReferentsCompaniesPage() {
  const [data, setData] = useState<ReferentsCompaniesStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering states
  const [searchReferent, setSearchReferent] = useState("");
  const [searchCompany, setSearchCompany] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.stats.getAllReferentsCompanies();
      setData(res);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Hiba történt az adatok betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // Filtered referents and their companies
  const filteredReferents = useMemo(() => {
    if (!data || !data.referents) return [];

    return data.referents
      .map((ref) => {
        // Filter companies of this referent by company search query
        const filteredCompanies = ref.companies.filter((c) =>
          c.name.toLowerCase().includes(searchCompany.toLowerCase())
        );

        return {
          ...ref,
          companies: filteredCompanies,
        };
      })
      .filter((ref) => {
        // Keep referent if their name matches the referent search query
        const matchesReferent = ref.fullName
          .toLowerCase()
          .includes(searchReferent.toLowerCase());
        
        // Also keep referent if company filter is active and they have companies matching that filter
        const hasMatchingCompanies = searchCompany === "" || ref.companies.length > 0;

        return matchesReferent && hasMatchingCompanies;
      });
  }, [data, searchReferent, searchCompany]);

  const totalAssignedCompaniesCount = useMemo(() => {
    if (!data || !data.referents) return 0;
    const allIds = new Set<string>();
    data.referents.forEach((ref) => {
      ref.companies.forEach((c) => allIds.add(c.id));
    });
    return allIds.size;
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          Referensi adatok és statisztikák betöltése...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl mt-12 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-6 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Sikertelen betöltés
        </h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
        <button
          onClick={() => void fetchData()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Újrapróbálkozás
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm dark:shadow-none transition-all duration-300">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Kari Referensek Cégei
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Tekintsd át az egyetemi társreferensekhez rendelt vállalatokat, pozíciókat, aktív partnerkapcsolatokat, valamint a teljes rendszerszintű lefedettséget.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Registered Companies */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Regisztrált cégek</span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{data?.totalCompaniesCount ?? 0}</span>
            <span className="text-xs text-slate-450 dark:text-slate-500">összesen</span>
          </div>
        </div>

        {/* Card 2: Active Companies */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Aktív cégek</span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-2 text-emerald-600 dark:text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{data?.activeCompaniesCount ?? 0}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {data && data.totalCompaniesCount
                ? `${Math.round((data.activeCompaniesCount / data.totalCompaniesCount) * 100)}%`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Card 3: Assigned Companies Coverage */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Referenshez rendelt cégek</span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 p-2 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalAssignedCompaniesCount}</span>
            <span className="text-xs text-slate-450 dark:text-slate-500">különböző cég</span>
          </div>
        </div>

        {/* Card 4: Total Referents */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Aktív kari referensek</span>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{data?.referents?.length ?? 0}</span>
            <span className="text-xs text-slate-450 dark:text-slate-500">munkatárs</span>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Referens keresése..."
              value={searchReferent}
              onChange={(e) => setSearchReferent(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cég keresése..."
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          {(searchReferent || searchCompany) && (
            <button
              onClick={() => {
                setSearchReferent("");
                setSearchCompany("");
              }}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
            >
              Szűrők törlése
            </button>
          )}
        </div>
      </div>

      {/* Referents and Companies Grid */}
      {filteredReferents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center transition-colors">
          <Building2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">
            Nincs találat
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A megadott szűrőknek megfelelő referens vagy cég nem található.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReferents.map((referent) => (
            <div
              key={referent.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Referent Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold">
                    {referent.fullName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {referent.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kari referens</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${referent.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {referent.email}
                  </a>
                </div>
              </div>

              {/* Assigned Companies list */}
              <div className="p-6">
                {referent.companies.length === 0 ? (
                  <p className="text-sm italic text-slate-450 dark:text-slate-500 py-2">
                    Ehhez a referenshez jelenleg nincs hozzárendelve cég.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {referent.companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex flex-col rounded-xl border border-slate-150 dark:border-slate-850 p-4 transition-all hover:bg-slate-50/40 dark:hover:bg-slate-900/40"
                      >
                        {/* Company Title */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {company.name}
                          </h4>
                          {company.website && (
                            <a
                              href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-blue-500 transition-colors"
                              title="Honlap megnyitása"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>

                        {/* Description */}
                        <p className="mt-2 text-xs text-slate-550 dark:text-slate-400 line-clamp-2 min-h-[2rem]">
                          {company.description || "Nincs elérhető cégleírás."}
                        </p>

                        {/* Badges / Stats details */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                            <span>{company.activePositionsCount} pozíció</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="h-4 w-4 text-indigo-500" />
                            <span>{company.activePartnershipsCount} hallgató</span>
                          </div>
                        </div>

                        {/* Active / Inactive Badge */}
                        <div className="mt-3 flex justify-end">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              company.isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-400"
                            }`}
                          >
                            {company.isActive ? "Aktív" : "Inaktív"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
