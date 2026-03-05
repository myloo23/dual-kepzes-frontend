import {
  StatsOverview,
  ApplicationsChart,
  PartnershipsStats,
  PositionsStats,
  TrendsChart,
} from "../../features/stats";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Rendszer Statisztikák
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Áttekintés a rendszer fő mutatóiról és aktivitásáról.
        </p>
      </header>

      {/* 1. Rendszerszintű áttekintés */}
      <section>
        <StatsOverview />
      </section>

      {/* 2. Részletes statisztikák grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationsChart />
        <PartnershipsStats />
      </div>

      {/* 3. További részletek */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PositionsStats />
        <TrendsChart />
      </div>
    </div>
  );
}
