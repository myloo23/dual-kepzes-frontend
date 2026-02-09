import type { PartnershipStatus } from "../../../types/api.types";

interface PartnershipFiltersProps {
  statusFilter: PartnershipStatus | "ALL";
  onStatusFilterChange: (status: PartnershipStatus | "ALL") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export default function PartnershipFilters({
  statusFilter = "ALL",
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: PartnershipFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Keresés név vagy email alapján..."
          className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="status-filter"
          className="text-sm font-medium text-slate-700"
        >
          Státusz:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as PartnershipStatus | "ALL")
          }
          className="rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="ALL">Összes</option>
          <option value="PENDING_MENTOR">Mentor jóváhagyásra vár</option>
          <option value="ACTIVE">Aktív</option>
          <option value="TERMINATED">Lezárt</option>
        </select>
      </div>
    </div>
  );
}
