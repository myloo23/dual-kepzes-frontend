import { useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  Loader2,
  FileText,
  Briefcase,
  Building2,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/cn";
import type { SearchResult } from "../types";
import { Modal } from "../../../components/ui/Modal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  loading: boolean;
  error?: string | null;
}

export function SearchModal({
  isOpen,
  onClose,
  query,
  setQuery,
  results,
  loading,
  error,
}: SearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const clampedSelectedIndex =
    results.length > 0 ? Math.min(selectedIndex, results.length - 1) : -1;

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(
          (prev) => (prev - 1 + results.length) % results.length,
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (clampedSelectedIndex >= 0 && results[clampedSelectedIndex]) {
        handleSelect(results[clampedSelectedIndex]);
      }
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.link);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keresés"
      hideHeader={true}
      align="top"
      size="2xl"
      className="overflow-hidden flex flex-col max-h-[70vh]"
    >
      {/* Header / Input */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 transition-colors"
          placeholder="Keresés bármire (állások, cégek, oldalak)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 text-dkk-blue animate-spin" />
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 mr-2 transition-colors">
              ESC
            </kbd>
            <X className="w-5 h-5 inline-block" />
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 p-2 space-y-1 bg-white dark:bg-slate-900 transition-colors">
        {error && !loading && (
          <div className="py-12 text-center text-red-500 dark:text-red-400 transition-colors">
            <p>{error}</p>
          </div>
        )}

        {!error && results.length === 0 && !loading && (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 transition-colors">
            {query && query.trim().length >= 2 ? (
              <p>Nincs találat.</p>
            ) : query && query.trim().length < 2 ? (
              <p>Legalább 2 karaktert írj be a kereséshez.</p>
            ) : (
              <p>Írj be valamit a kereséshez...</p>
            )}
          </div>
        )}

        {results.map((result, index) => {
          const isSelected = index === clampedSelectedIndex;
          return (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-colors group",
                isSelected
                  ? "bg-dkk-blue/5 dark:bg-blue-500/10"
                  : "hover:bg-gray-50 dark:hover:bg-slate-800/50",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg border shadow-sm transition-colors",
                  isSelected
                    ? "bg-white dark:bg-slate-800 border-dkk-blue/20 dark:border-blue-500/30 text-dkk-blue dark:text-blue-400"
                    : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 group-hover:border-gray-200 dark:group-hover:border-slate-600 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                )}
              >
                {getIconForType(result.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "font-medium truncate transition-colors",
                    isSelected
                      ? "text-dkk-blue dark:text-blue-400"
                      : "text-gray-900 dark:text-slate-100",
                  )}
                >
                  {result.title}
                </div>
                {result.subtitle && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate transition-colors">
                    {result.subtitle}
                  </div>
                )}
              </div>

              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-all duration-200",
                  isSelected
                    ? "opacity-100 text-dkk-blue dark:text-blue-400 translate-x-1"
                    : "opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-50 dark:text-gray-500 text-gray-400",
                )}
              />
            </button>
          );
        })}

        {/* Footer Hint */}
        {results.length > 0 && (
          <div className="px-4 py-2 mt-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-slate-800 flex justify-between transition-colors">
            <span>Nyilakkal navigálhatsz</span>
            <span>Enter a kiválasztáshoz</span>
          </div>
        )}
      </div>
    </Modal>
  );
}

function getIconForType(type: SearchResult["type"]) {
  switch (type) {
    case "page":
      return <FileText className="w-5 h-5" />;
    case "position":
      return <Briefcase className="w-5 h-5" />;
    case "company":
      return <Building2 className="w-5 h-5" />;
    case "news":
      return <Newspaper className="w-5 h-5" />;
    default:
      return <Search className="w-5 h-5" />;
  }
}
