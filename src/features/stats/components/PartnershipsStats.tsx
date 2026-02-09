import { usePartnershipStats } from "../hooks/useStats";

export function PartnershipsStats() {
  const { data, loading, error } = usePartnershipStats();

  if (loading) return <div className="text-sm text-slate-500">Betöltés...</div>;
  if (error) return <div className="text-sm text-red-500">Hiba: {error}</div>;

  if (!data) return null;

  // Calculate generic stats locally
  const activeCount =
    (data.byStatus || []).find((s) => s.status === "ACTIVE")?.count || 0;
  const totalCount = (data.byStatus || []).reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Partnerségek áttekintése
      </h3>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 rounded-xl bg-blue-50 p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{activeCount}</div>
          <div className="text-xs text-blue-600 uppercase tracking-wide font-semibold">
            Aktív
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{totalCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
            Összes
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">
            {data.averageDurationDays} nap
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
            Átlagos hossz
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">
          Féléves bontás
        </h4>
        <div className="space-y-3">
          {(data.bySemester || []).map((stat) => (
            <div key={stat.semester} className="flex items-center gap-3">
              <span className="w-20 text-sm font-medium text-slate-600">
                {stat.semester}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{
                    width: `${(stat.count / Math.max(...(data.bySemester || []).map((s) => s.count), 1)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {stat.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
