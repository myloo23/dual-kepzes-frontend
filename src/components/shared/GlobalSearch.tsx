import { useEffect, useState, useCallback, useRef } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { api } from "../../lib/api";
import type { Position, Company } from "../../lib/api";

interface SearchResult {
  id: string | number;
  type: "position" | "company";
  title: string;
  subtitle?: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = "dkk-recent-searches";
const MAX_RECENT = 5;

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await api.search(trimmed);

        const positionResults: SearchResult[] = (data.positions ?? []).map(
          (p: Position) => ({
            id: p.id,
            type: "position" as const,
            title: p.title,
            subtitle: p.company?.name ?? "Ismeretlen cég",
            url: `/positions?id=${p.id}`,
          }),
        );

        const companyResults: SearchResult[] = (data.companies ?? []).map(
          (c: Company) => ({
            id: c.id,
            type: "company" as const,
            title: c.name,
            subtitle: c.website ?? "Cég profilja",
            url: `/companies/${c.id}`,
          }),
        );

        setResults([...positionResults, ...companyResults]);
      } catch {
        setSearchError("A keresés nem sikerült. Próbáld újra később.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    onClose();
    setQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  if (!isOpen) return null;

  const typeIcons = {
    position: "💼",
    company: "🏢",
  };

  const typeLabels = {
    position: "Pozíció",
    company: "Cég",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none">
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keresés pozíciók, cégek, hírek között..."
              className="flex-1 outline-none text-lg bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
            <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <div className="animate-spin h-6 w-6 border-2 border-dkk-blue border-t-transparent rounded-full mx-auto" />
                <p className="mt-2 text-sm">Keresés...</p>
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  <Clock className="h-4 w-4" />
                  Legutóbbi keresések
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {!isSearching && searchError && (
              <div className="p-8 text-center text-red-500 dark:text-red-400">
                <p>{searchError}</p>
              </div>
            )}

            {!isSearching && !searchError && query && results.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>Nincs találat.</p>
              </div>
            )}

            {!isSearching && results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3",
                      index === selectedIndex
                        ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800",
                    )}
                  >
                    <span className="text-2xl">{typeIcons[result.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 uppercase">
                      {typeLabels[result.type]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                    ↓
                  </kbd>
                  navigálás
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                    ↵
                  </kbd>
                  kiválasztás
                </span>
              </div>
              <span>Ctrl+K a megnyitáshoz</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
