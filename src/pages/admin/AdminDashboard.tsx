import { useEffect, useMemo, useState } from "react";
import { api, type StatsResponse } from "../../lib/api";

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    STUDENT: "Hallgató",
    TEACHER: "Oktató",
    MENTOR: "Mentor",
    COMPANY_ADMIN: "Céges admin",
    SYSTEM_ADMIN: "Rendszeradmin",
    UNIVERSITY_USER: "Egyetemi felhasználó",
  };
  return map[role] ?? role;
}

export default function AdminDashboard() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.stats.get();
      setData(res);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Nem sikerült betölteni a statisztikákat.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const maxRoleCount = useMemo(() => {
    if (!data?.usersByRole?.length) return 0;
    return Math.max(...data.usersByRole.map((x) => x.count ?? 0));
  }, [data]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Áttekintés a rendszer fő adatairól (API-ról betöltve).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Frissítés
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Totals */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Felhasználók"
          value={loading ? "…" : data?.totals?.users ?? "—"}
        />
        <StatCard
          title="Cégek"
          value={loading ? "…" : data?.totals?.companies ?? "—"}
        />
        <StatCard
          title="Pozíciók"
          value={loading ? "…" : data?.totals?.positions ?? "—"}
        />
        <StatCard
          title="Jelentkezések"
          value={loading ? "…" : data?.totals?.applications ?? "—"}
        />
        <StatCard
          title="Aktív együttműködések"
          value={loading ? "…" : data?.totals?.activePartnerships ?? "—"}
          hint="(hallgató–cég kapcsolatok)"
        />
      </div>

      {/* Users by role */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Felhasználók szerepkör szerint
            </div>
            <div className="text-xs text-slate-500">
              A role-ok megjelenítése a backend válasza alapján.
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-slate-600">Betöltés…</div>
        ) : !data?.usersByRole?.length ? (
          <div className="text-sm text-slate-600">Nincs adat.</div>
        ) : (
          <div className="space-y-2">
            {data.usersByRole
              .slice()
              .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
              .map((r) => {
                const pct =
                  maxRoleCount > 0 ? Math.round((r.count / maxRoleCount) * 100) : 0;

                return (
                  <div
                    key={r.role}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-slate-900">
                        {roleLabel(r.role)}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {r.count}
                      </div>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500">
                      {pct}%
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Teendők */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900 mb-2">Teendők</div>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>Role alapú route védelem (SYSTEM_ADMIN)</li>
          <li>Jelentkezések statisztika (ha lesz endpoint)</li>
          <li>Aktív együttműködések definíció és megjelenítés</li>
        </ul>
      </div>
    </div>
  );
}
