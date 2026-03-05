// src/components/positions/FilterSidebar.tsx
import ChipButton from "../../../components/shared/ChipButton";
import { lower } from "../utils/positions.utils";
import { Combobox } from "../../../components/ui/Combobox";

type SortKey =
  | "NEWEST"
  | "DEADLINE_ASC"
  | "DEADLINE_DESC"
  | "TITLE_ASC"
  | "RANDOM";
type DeadlineFilter = "ALL" | "7D" | "30D" | "90D" | "NO_DEADLINE";

interface DerivedData {
  cities: string[];
  companies: string[];
  tags: string[];
  showCityChips: boolean;
  showCompanyChips: boolean;
}

import { type PositionTypeFilter } from "../hooks/usePositionsFilters";

interface FilterSidebarProps {
  // Filter states
  search: string;
  city: string;
  company: string;
  deadlineFilter: DeadlineFilter;
  positionType: PositionTypeFilter;
  activeOnly: boolean;
  selectedTags: string[];
  sortKey: SortKey;

  // Filter setters
  setSearch: (value: string) => void;
  setCity: (value: string) => void;
  setCompany: (value: string) => void;
  setDeadlineFilter: (value: DeadlineFilter) => void;
  setPositionType: (value: PositionTypeFilter) => void;
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
  deadlineFilter,
  positionType,
  activeOnly,
  selectedTags,
  sortKey,
  setSearch,
  setCity,
  setCompany,
  setDeadlineFilter,
  setPositionType,
  setActiveOnly,
  setSelectedTags,
  setSortKey,
  derived,
  onResetFilters,
  onToggleTag,
}: FilterSidebarProps) {
  // Map cities to Combobox options
  const cityOptions = [
    { value: "ALL", label: "Bármely" },
    ...derived.cities.map((c) => ({ value: c, label: c })),
  ];

  // Map companies to Combobox options
  const companyOptions = [
    { value: "ALL", label: "Bármely" },
    ...derived.companies.map((c) => ({ value: c, label: c })),
  ];

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none space-y-5 transition-colors scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Szűrők
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-blue-600 hover:underline"
        >
          Alaphelyzet
        </button>
      </div>

      {/* 1. Keresés */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
          Keresés cím vagy cég alapján
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pl. szoftverfejlesztő, rendszer…"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* 2. Város (Scalable Combobox) */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
          Képzés helyszíne
        </div>
        <Combobox
          options={cityOptions}
          value={city === "ALL" ? "" : city}
          onChange={(val) => setCity(val || "ALL")}
          placeholder="Válassz várost vagy Bármely"
          searchPlaceholder="Város keresése..."
          className="w-full"
        />
      </div>

      {/* 3. Cég neve (Scalable Combobox) */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
          Cég neve
        </div>
        <Combobox
          options={companyOptions}
          value={company === "ALL" ? "" : company}
          onChange={(val) => setCompany(val || "ALL")}
          placeholder="Válassz céget vagy Bármely"
          searchPlaceholder="Cég keresése..."
          className="w-full"
        />
      </div>

      {/* 4. Jelentkezési határidő (Active Only inside here or separate?) */}
      {/* Kept Active Only separate near top of sections or just before filters that care about it?
          Request order: City -> Company -> Deadline -> Position Type -> Category -> Tags.
          I'll place 'Active Only' toggle here as a utility before detailed properties.
       */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 transition-colors">
        <div>
          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 transition-colors">
            Csak aktív
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
            Lejárt határidő ne látszódjon
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveOnly((p) => !p)}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition",
            activeOnly ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600",
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

      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
          Jelentkezési határidő
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ChipButton
            active={deadlineFilter === "ALL"}
            onClick={() => setDeadlineFilter("ALL")}
          >
            Bármely
          </ChipButton>
          <ChipButton
            active={deadlineFilter === "7D"}
            onClick={() => setDeadlineFilter("7D")}
          >
            7 napon belül
          </ChipButton>
          <ChipButton
            active={deadlineFilter === "30D"}
            onClick={() => setDeadlineFilter("30D")}
          >
            30 napon belül
          </ChipButton>
          <ChipButton
            active={deadlineFilter === "90D"}
            onClick={() => setDeadlineFilter("90D")}
          >
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

      {/* 5. Pozíció típusa */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
          Pozíció típusa
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ChipButton
            active={positionType === "ALL"}
            onClick={() => setPositionType("ALL")}
          >
            Mind
          </ChipButton>
          <ChipButton
            active={positionType === "DUAL"}
            onClick={() => setPositionType("DUAL")}
          >
            Duális képzés
          </ChipButton>
          <ChipButton
            active={positionType === "FULL_TIME"}
            onClick={() => setPositionType("FULL_TIME")}
          >
            Teljes munkaidős
          </ChipButton>
        </div>
      </div>

      {/* 7. Címkék (multi AND) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Címkék
          </div>
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
          <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
            Nincsenek címkék.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {derived.tags.map((t) => {
              const active = selectedTags.some((x) => lower(x) === lower(t));
              return (
                <ChipButton
                  key={t}
                  active={active}
                  onClick={() => onToggleTag(t)}
                >
                  {t}
                </ChipButton>
              );
            })}
          </div>
        )}

        <div className="text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
          Tipp: több címke is kiválasztható (AND).
        </div>
      </div>

      {/* Rendezés (kept at bottom or move to top? kept at bottom for now as it affects the list) */}
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
          Rendezés
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value="RANDOM">Véletlenszerű</option>
          <option value="NEWEST">Legújabb elöl</option>
          <option value="DEADLINE_ASC">Határidő (hamarabb)</option>
          <option value="DEADLINE_DESC">Határidő (később)</option>
          <option value="TITLE_ASC">Cím (A–Z)</option>
        </select>
      </div>
    </aside>
  );
}
