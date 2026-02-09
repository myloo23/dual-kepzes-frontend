import { useSystemStats } from "../hooks/useStats";

function StatCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: string | number | undefined;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">
        {loading ? "..." : (value ?? "—")}
      </div>
    </div>
  );
}

export function StatsOverview() {
  const { data, loading, error } = useSystemStats();

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Hiba a rendszerszintű statisztikák betöltésekor: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Felhasználók"
        value={data?.totals?.users}
        loading={loading}
      />
      <StatCard
        title="Partnercégek"
        value={data?.totals?.companies}
        loading={loading}
      />
      <StatCard
        title="Nyitott pozíciók"
        value={data?.totals?.positions}
        loading={loading}
      />
      <StatCard
        title="Aktív együttműködések"
        value={data?.totals?.activePartnerships}
        loading={loading}
      />
    </div>
  );
}
