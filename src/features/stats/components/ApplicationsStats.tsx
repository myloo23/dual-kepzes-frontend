import { useApplicationStats } from "../hooks/useStats";
import { cn } from "@/utils/cn";

export function ApplicationsChart() {
  const { data, loading, error } = useApplicationStats();

  if (loading) return <div className="text-sm text-slate-500">Betöltés...</div>;
  if (error) return <div className="text-sm text-red-500">Hiba: {error}</div>;

  if (!data) return null;

  // Calculate total from byStatus array as it is not provided in root
  const total = (data.byStatus || []).reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Jelentkezések állapota
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2 text-sm text-slate-500">
            <span>Összes jelentkezés</span>
            <span className="font-medium text-slate-900">{total}</span>
          </div>
          <div className="flex justify-between border-b pb-2 text-sm text-slate-500">
            <span>Elmúlt 30 nap</span>
            <span className="font-medium text-green-600">
              +{data.lastMonthCount}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2 text-sm text-slate-500">
            <span>Konverziós arány</span>
            <span className="font-medium text-slate-900">
              {(data.conversionRate || 0).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between border-b pb-2 text-sm text-slate-500">
            <span>Átlag jelentkezés / pozíció</span>
            <span className="font-medium text-slate-900">
              {(data.averagePerPosition || 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">
            Státusz megoszlás
          </h4>
          {(data.byStatus || []).map((stat) => {
            const statusMap: Record<string, string> = {
              PENDING: "Elbírálás alatt",
              SUBMITTED: "Benyújtva",
              ACCEPTED: "Elfogadva",
              REJECTED: "Elutasítva",
              INTERVIEW: "Interjú",
              RETRACTED: "Visszavonva",
            };
            return (
              <div
                key={stat.status}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className="w-24 truncate text-slate-500"
                  title={statusMap[stat.status] || stat.status}
                >
                  {statusMap[stat.status] || stat.status}
                </div>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      stat.status === "ACCEPTED"
                        ? "bg-green-500"
                        : stat.status === "REJECTED" ||
                            stat.status === "RETRACTED"
                          ? "bg-red-500"
                          : "bg-blue-500",
                    )}
                    style={{ width: `${(stat.count / (total || 1)) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right font-medium text-slate-900">
                  {stat.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
