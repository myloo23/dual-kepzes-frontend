import { Search } from "lucide-react";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { SearchModal } from "./SearchModal";

interface GlobalSearchProps {
  variant?: "default" | "icon";
}

export function GlobalSearch({ variant = "default" }: GlobalSearchProps) {
  const { query, setQuery, results, loading, open, setOpen } =
    useGlobalSearch();

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-200 focus:outline-none"
          aria-label="Keresés"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-10 w-full items-center justify-start gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 text-slate-500 dark:text-slate-400 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700 hover:text-dkk-blue dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900"
          aria-label="Keresés"
        >
          <Search className="h-4 w-4" />
          <span className="inline text-sm">Keresés...</span>
        </button>
      )}

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
