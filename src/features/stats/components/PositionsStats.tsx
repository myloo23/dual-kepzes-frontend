import { usePositionStats } from "../hooks/useStats";

export function PositionsStats() {
  const { data, loading, error } = usePositionStats();

  if (loading)
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
        Betöltés...
      </div>
    );
  if (error)
    return (
      <div className="text-sm text-red-500 dark:text-red-400 transition-colors">
        Hiba: {error}
      </div>
    );

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-none transition-colors">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
        Pozíciók állapota
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-orange-100 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 p-4 transition-colors">
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
            {data.expiringIn7Days}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-500">
            Lejár 7 napon belül
          </div>
        </div>
        <div className="rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 transition-colors">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">
            {data.withNoApplications}
          </div>
          <div className="text-sm text-red-600 dark:text-red-500">
            Jelentkezés nélkül
          </div>
        </div>
      </div>

      {/* Sector stats removed as they are not provided by the backend currently */}
    </div>
  );
}
