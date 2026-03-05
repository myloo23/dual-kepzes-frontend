import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "../../utils/cn";

interface ParsedOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: (string | ParsedOption)[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Válassz...",
  searchPlaceholder = "Keresés...",
  emptyMessage = "Nincs találat.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label } format
  const parsedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search) return parsedOptions;
    const lowerSearch = search.toLowerCase();
    return parsedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lowerSearch),
    );
  }, [parsedOptions, search]);

  const selectedOption = parsedOptions.find((opt) => opt.value === value);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-none ring-offset-white dark:ring-offset-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        <span
          className={cn(
            "block truncate",
            !value && "text-slate-500 dark:text-slate-400",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 dark:text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md dark:shadow-none animate-in fade-in-0 zoom-in-95 transition-colors">
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-3 transition-colors">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-slate-400" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-[200px] overflow-auto p-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors">
                {emptyMessage}
              </div>
            ) : (
              <ul>
                {filteredOptions.slice(0, 50).map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 text-slate-700 dark:text-slate-300 transition-colors",
                      value === option.value &&
                        "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </li>
                ))}
                {filteredOptions.length > 50 && (
                  <li className="px-2 py-2 text-xs text-center text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 mt-1 transition-colors">
                    További {filteredOptions.length - 50} találat...
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
