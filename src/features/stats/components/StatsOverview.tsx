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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm dark:shadow-none transition-colors">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
        {title}
      </div>
      <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
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
        title="Van duális hallgató a cégnél"
        value={data?.totals?.activePartnerships}
        loading={loading}
      />
    </div>
  );
}
