import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SearchResult {
  id: string | number;
  type: 'position' | 'company' | 'news';
  title: string;
  subtitle?: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'dkk-recent-searches';
const MAX_RECENT = 5;

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      // TODO: Replace with actual API call
      // For now, mock search results
      const mockResults: SearchResult[] = [
        {
          id: 1,
          type: 'position',
          title: `Software Developer - ${query}`,
          subtitle: 'Mercedes-Benz Manufacturing Hungary',
          url: '/positions'
        },
        {
          id: 2,
          type: 'company',
          title: `${query} Company`,
          subtitle: 'Kecskemét',
          url: '/companies/2'
        },
        {
          id: 3,
          type: 'news',
          title: `News about ${query}`,
          subtitle: '2 days ago',
          url: '/student/news'
        }
      ];

      setResults(mockResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    onClose();
    setQuery('');
  };

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  if (!isOpen) return null;

  const typeIcons = {
    position: '💼',
    company: '🏢',
    news: '📰'
  };

  const typeLabels = {
    position: 'Pozíció',
    company: 'Cég',
    news: 'Hír'
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keresés pozíciók, cégek, hírek között..."
              className="flex-1 outline-none text-lg"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
            <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching && (
              <div className="p-8 text-center text-slate-500">
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
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {!isSearching && query && results.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <p>Nincs találat a(z) "{query}" keresésre</p>
              </div>
            )}

            {!isSearching && results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3',
                      index === selectedIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-slate-50'
                    )}
                  >
                    <span className="text-2xl">{typeIcons[result.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-sm text-slate-500 truncate">
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
          <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">↓</kbd>
                  navigálás
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">↵</kbd>
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
