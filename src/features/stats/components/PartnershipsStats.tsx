import { usePartnershipStats } from "../hooks/useStats";

export function PartnershipsStats() {
  const { data, loading, error } = usePartnershipStats();

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

  // Calculate generic stats locally
  const activeCount =
    (data.byStatus || []).find((s) => s.status === "ACTIVE")?.count || 0;
  const totalCount = (data.byStatus || []).reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-none transition-colors">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
        Partnerségek áttekintése
      </h3>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {activeCount}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-500 uppercase tracking-wide font-semibold">
            Aktív
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {totalCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">
            Összes
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {data.averageDurationDays} nap
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">
            Átlagos hossz
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 transition-colors">
          Féléves bontás
        </h4>
        <div className="space-y-3">
          {(data.bySemester || []).map((stat) => (
            <div key={stat.semester} className="flex items-center gap-3">
              <span className="w-20 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
                {stat.semester}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden transition-colors">
                <div
                  className="h-full bg-indigo-500 dark:bg-indigo-600"
                  style={{
                    width: `${(stat.count / Math.max(...(data.bySemester || []).map((s) => s.count), 1)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors">
                {stat.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
