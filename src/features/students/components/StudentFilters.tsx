import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

export interface StudentFiltersState {
  search: string;
  type: "ALL" | "HIGH_SCHOOL" | "UNIVERSITY";
  isAvailable: boolean;
  hasLanguageCert: boolean;
}

interface StudentFiltersProps {
  filters: StudentFiltersState;
  onFilterChange: (filters: StudentFiltersState) => void;
}

export const StudentFilters = ({
  filters,
  onFilterChange,
}: StudentFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof StudentFiltersState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      type: "ALL",
      isAvailable: false,
      hasLanguageCert: false,
    });
  };

  const activeFiltersCount = [
    filters.type !== "ALL",
    filters.isAvailable,
    filters.hasLanguageCert,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Keresés név vagy email alapján..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-dkk-blue focus:ring-1 focus:ring-dkk-blue outline-none transition-all placeholder:text-slate-400 text-sm"
          />
        </div>

        {/* Filter Toggle Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Szűrők
          {activeFiltersCount > 0 && (
            <span className="bg-dkk-blue text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Desktop Filters / Mobile Collapsible */}
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-4 items-start md:items-center`}
        >
          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-dkk-blue focus:ring-1 focus:ring-dkk-blue cursor-pointer"
          >
            <option value="ALL">Minden diák</option>
            <option value="HIGH_SCHOOL">Középiskolás</option>
            <option value="UNIVERSITY">Egyetemista</option>
          </select>

          {/* Toggles */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.isAvailable}
              onChange={(e) => updateFilter("isAvailable", e.target.checked)}
              className="rounded border-slate-300 text-dkk-blue focus:ring-dkk-blue h-4 w-4"
            />
            <span className="text-sm text-slate-700">Elérhető</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.hasLanguageCert}
              onChange={(e) =>
                updateFilter("hasLanguageCert", e.target.checked)
              }
              className="rounded border-slate-300 text-dkk-blue focus:ring-dkk-blue h-4 w-4"
            />
            <span className="text-sm text-slate-700">Nyelvvizsga</span>
          </label>

          {/* Clear Button */}
          {(filters.search || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Törlés
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
