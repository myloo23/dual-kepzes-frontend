function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Áttekintés a rendszer fő adatairól (most még mock).
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Felhasználók" value="—" />
        <StatCard title="Cégek" value="—" />
        <StatCard title="Pozíciók" value="—" />
        <StatCard title="Jelentkezések" value="—" />
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="text-sm font-semibold text-slate-900 mb-2">
          Teendők
        </div>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>Backend bekötése után: statisztikák betöltése API-ról</li>
          <li>CRUD műveletek: cégek, pozíciók, tag-ek</li>
          <li>Jogosultság kezelés: csak admin férjen hozzá</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
