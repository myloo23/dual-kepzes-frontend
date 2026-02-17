// src/components/student/NewsFilter.tsx

interface NewsFilterProps {
  search: string;
  tag: string;
  onlyImportant: boolean;
  allTags: string[];
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onImportantChange: (value: boolean) => void;
  onRefresh: () => void;
}

export default function NewsFilter({
  search,
  tag,
  onlyImportant,
  allTags,
  onSearchChange,
  onTagChange,
  onImportantChange,
  onRefresh,
}: NewsFilterProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-4 items-end">
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Keresés
          </label>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cím, tartalom, címke..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Címke
          </label>
          <div className="relative">
            <select
              value={tag}
              onChange={(e) => onTagChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Összes címke</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={onlyImportant}
                onChange={(e) => onImportantChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 transition-all peer-checked:bg-red-500 peer-focus:ring-2 peer-focus:ring-red-500/20"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5 shadow-sm"></div>
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
              Csak fontos
            </span>
          </label>

          <button
            type="button"
            onClick={onRefresh}
            className="ml-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-slate-900/20 active:scale-95"
          >
            Frissítés
          </button>
        </div>
      </div>
    </section>
  );
}
