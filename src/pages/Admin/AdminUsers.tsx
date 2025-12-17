const mockUsers = [
  { id: 1, email: "student1@mail.com", role: "STUDENT", active: true },
  { id: 2, email: "company@mail.com", role: "COMPANY", active: true },
  { id: 3, email: "mentor@mail.com", role: "MENTOR", active: false },
];

function AdminUsers() {
  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Felhasználók</h1>
          <p className="text-sm text-slate-600">
            Felhasználók listája (mock). Később: API + keresés + tiltás.
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Új felhasználó
        </button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Szerepkör</th>
              <th className="text-left p-3">Státusz</th>
              <th className="text-right p-3">Művelet</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id} className="border-t border-slate-200">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs border ${
                      u.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {u.active ? "Aktív" : "Inaktív"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button className="text-blue-600 hover:underline mr-3">
                    Szerkesztés
                  </button>
                  <button className="text-red-600 hover:underline">
                    Tiltás
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
