import { useTrendStats } from "../hooks/useStats";

export function TrendsChart() {
  const { data, loading, error } = useTrendStats();

  if (loading) return <div className="text-sm text-slate-500">Betöltés...</div>;
  if (error) return <div className="text-sm text-red-500">Hiba: {error}</div>;

  if (!data) return null;

  // Extract counts for chart
  const regCounts = (data.registrationsPerMonth || []).map((d) => d.count);
  const appCounts = (data.applicationsPerMonth || []).map((d) => d.count);
  const partnerCounts = (data.partnershipsPerMonth || []).map((d) => d.count);

  // Extract months from one of the arrays (assuming they align)
  const months = (data.registrationsPerMonth || []).map((d) =>
    d.month.slice(5),
  ); // "2026-02" -> "02"

  // Calculate max value for scaling
  const allValues = [...regCounts, ...appCounts, ...partnerCounts];
  const maxValue = Math.max(...allValues, 1);

  // Helper to generate SVG path
  const generatePath = (values: number[], color: string) => {
    const safeValues = values || [];
    if (safeValues.length === 0) return null;

    const points = safeValues.map((val, index) => {
      const x = (index / (safeValues.length - 1)) * 100;
      const y = 100 - (val / maxValue) * 100;
      return `${x},${y}`;
    });
    return (
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        points={points.join(" ")}
        vectorEffect="non-scaling-stroke"
      />
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Trendek (elmúlt 6 hónap)
      </h3>

      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-slate-600">Regisztrációk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-slate-600">Jelentkezések</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-500" />
          <span className="text-slate-600">Partnerségek</span>
        </div>
      </div>

      <div className="relative h-64 w-full">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
          {[100, 75, 50, 25, 0].map((pct) => (
            <div
              key={pct}
              className="flex items-center border-b border-slate-100 last:border-0 h-6"
            >
              <span className="w-8">{Math.round((maxValue * pct) / 100)}</span>
              <div className="flex-1 border-t border-dashed border-slate-200 ml-2"></div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="absolute inset-0 left-10 top-3 bottom-6 right-0">
          <svg
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {generatePath(regCounts, "#3b82f6")}
            {generatePath(appCounts, "#22c55e")}
            {generatePath(partnerCounts, "#a855f7")}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-slate-500">
          {(months || []).map((month, i) => (
            <div key={i} className="text-center w-8">
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
