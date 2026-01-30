import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, FileText, Briefcase, Building2, Newspaper, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import type { SearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  loading: boolean;
}

export function SearchModal({ isOpen, onClose, query, setQuery, results, loading }: SearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header / Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            placeholder="Keresés bármire (állások, cégek, oldalak)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 text-dkk-blue animate-spin" />}
            <button 
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded border border-gray-200 mr-2">ESC</kbd>
              <X className="w-5 h-5 inline-block" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        >
          {results.length === 0 && !loading && (
             <div className="py-12 text-center text-gray-500">
               {query ? (
                 <p>Nincs találat erre: "{query}"</p>
               ) : (
                 <p>Írj be valamit a kereséshez...</p>
               )}
             </div>
          )}

          {results.map((result, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-colors group",
                  isSelected ? "bg-dkk-blue/5" : "hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg border shadow-sm transition-colors",
                  isSelected ? "bg-white border-dkk-blue/20 text-dkk-blue" : "bg-white border-gray-100 text-gray-400 group-hover:border-gray-200 group-hover:text-gray-600"
                )}>
                  {getIconForType(result.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium truncate",
                    isSelected ? "text-dkk-blue" : "text-gray-900"
                  )}>
                    {result.title}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </div>
                  )}
                </div>

                <ChevronRight className={cn(
                  "w-4 h-4 transition-opacity",
                  isSelected ? "opacity-100 text-dkk-blue" : "opacity-0"
                )} />
              </button>
            );
          })}
          
          {/* Footer Hint */}
          {results.length > 0 && (
             <div className="px-4 py-2 mt-2 text-xs text-gray-400 border-t border-gray-50 flex justify-between">
                <span>Nyilakkal navigálhatsz</span>
                <span>Enter a kiválasztáshoz</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getIconForType(type: SearchResult['type']) {
  switch (type) {
    case 'page': return <FileText className="w-5 h-5" />;
    case 'position': return <Briefcase className="w-5 h-5" />;
    case 'company': return <Building2 className="w-5 h-5" />;
    case 'news': return <Newspaper className="w-5 h-5" />;
    default: return <Search className="w-5 h-5" />;
  }
}
