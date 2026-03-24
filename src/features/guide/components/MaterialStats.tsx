import { useState, useEffect } from "react";
import { materialsApi } from "../services/materialsApi";
import type { MaterialStatistics } from "../types";
import { AVAILABLE_COURSES } from "../data";

export function MaterialStats() {
  const [stats, setStats] = useState<MaterialStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    materialsApi
      .getStatistics()
      .then((data) => {
        if (!mounted) return;
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Hiba a statisztikák betöltésekor.");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none animate-pulse">
        Statisztikák betöltése...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-sm text-red-600 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (stats.length === 0 && AVAILABLE_COURSES.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none dark:text-slate-400">
        Nincsenek elérhető tananyagok a rendszerben.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {AVAILABLE_COURSES.map((courseDef) => {
        const stat = stats.find((s) => s.materialId === courseDef.id);
        const title = courseDef.title;
        const completions = stat?.completions || 0;
        const averageRating = stat?.averageRating ? Number(stat.averageRating) : 0;

        return (
          <div
            key={courseDef.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"
          >
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-6 line-clamp-2 leading-snug h-10" title={title}>
              {title}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 focus-within:ring-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Elvégzések
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 block">
                  {completions}
                </span>
              </div>
              <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Értékelés
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {averageRating.toFixed(1)}
                  </span>
                  <svg className={`w-5 h-5 mb-0.5 ${averageRating > 0 ? "text-amber-500 drop-shadow-sm" : "text-slate-300 dark:text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
