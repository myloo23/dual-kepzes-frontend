// src/components/positions/FilterSidebar.tsx
import ChipButton from "../shared/ChipButton";
import { lower } from "../../lib/positions-utils";

type SortKey = "NEWEST" | "DEADLINE_ASC" | "DEADLINE_DESC" | "TITLE_ASC";
type DeadlineFilter = "ALL" | "7D" | "30D" | "90D" | "NO_DEADLINE";

interface DerivedData {
    cities: string[];
    companies: string[];
    tags: string[];
    categories: string[];
    showCityChips: boolean;
    showCompanyChips: boolean;
}

interface FilterSidebarProps {
    // Filter states
    search: string;
    city: string;
    company: string;
    tagCategory: string;
    deadlineFilter: DeadlineFilter;
    activeOnly: boolean;
    selectedTags: string[];
    sortKey: SortKey;

    // Filter setters
    setSearch: (value: string) => void;
    setCity: (value: string) => void;
    setCompany: (value: string) => void;
    setTagCategory: (value: string) => void;
    setDeadlineFilter: (value: DeadlineFilter) => void;
    setActiveOnly: (value: boolean | ((prev: boolean) => boolean)) => void;
    setSelectedTags: (value: string[] | ((prev: string[]) => string[])) => void;
    setSortKey: (value: SortKey) => void;

    // Derived data
    derived: DerivedData;

    // Handlers
    onResetFilters: () => void;
    onToggleTag: (name: string) => void;
}

export default function FilterSidebar({
    search,
    city,
    company,
    tagCategory,
    deadlineFilter,
    activeOnly,
    selectedTags,
    sortKey,
    setSearch,
    setCity,
    setCompany,
    setTagCategory,
    setDeadlineFilter,
    setActiveOnly,
    setSelectedTags,
    setSortKey,
    derived,
    onResetFilters,
    onToggleTag,
}: FilterSidebarProps) {
    return (
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Szűrők</div>
                <button type="button" onClick={onResetFilters} className="text-xs text-blue-600 hover:underline">
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
                                <ChipButton key={t} active={active} onClick={() => onToggleTag(t)}>
                                    {t}
                                </ChipButton>
                            );
                        })}
                    </div>
                )}

                <div className="text-[11px] text-slate-500">Tipp: több címke is kiválasztható (AND).</div>
            </div>
        </aside>
    );
}
