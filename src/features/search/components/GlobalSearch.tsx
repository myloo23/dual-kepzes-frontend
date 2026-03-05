import { Search } from "lucide-react";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { SearchModal } from "./SearchModal";

export function GlobalSearch() {
  const { query, setQuery, results, loading, open, setOpen } =
    useGlobalSearch();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex h-10 w-full items-center justify-start gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 text-slate-500 dark:text-slate-400 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700 hover:text-dkk-blue dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900"
        aria-label="Keresés"
      >
        <Search className="h-4 w-4" />
        <span className="inline text-sm">Keresés...</span>
      </button>

      <SearchModal
        isOpen={open}
        onClose={() => setOpen(false)}
        query={query}
        setQuery={setQuery}
        results={results}
        loading={loading}
      />
    </>
  );
}
