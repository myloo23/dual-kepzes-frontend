import { usePositionStats } from "../hooks/useStats";

export function PositionsStats() {
  const { data, loading, error } = usePositionStats();

  if (loading) return <div className="text-sm text-slate-500">Betöltés...</div>;
  if (error) return <div className="text-sm text-red-500">Hiba: {error}</div>;

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Pozíciók állapota
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
          <div className="text-2xl font-bold text-orange-700">
            {data.expiringIn7Days}
          </div>
          <div className="text-sm text-orange-600">Lejár 7 napon belül</div>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="text-2xl font-bold text-red-700">
            {data.withNoApplications}
          </div>
          <div className="text-sm text-red-600">Jelentkezés nélkül</div>
        </div>
      </div>

      {/* Sector stats removed as they are not provided by the backend currently */}
    </div>
  );
}
