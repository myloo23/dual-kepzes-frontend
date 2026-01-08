import { useEffect, useState } from "react";
import { api, type StudentProfile } from "../../lib/api";

type Id = string | number;

export default function AdminUsers() {
  const [items, setItems] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [selected, setSelected] = useState<StudentProfile | null>(null);
  const [lookupId, setLookupId] = useState("");

  const [patchJson, setPatchJson] = useState<string>("{}");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.students.list();
      setItems(res);
    } catch (e: any) {
      setErr(e.message || "Hiba a hallgatók lekérésénél.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openById = async (id: Id) => {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const s = await api.students.get(id);
      setSelected(s);
      setPatchJson("{}");
      setMsg("Hallgató betöltve.");
    } catch (e: any) {
      setErr(e.message || "Nem sikerült betölteni.");
    } finally {
      setLoading(false);
    }
  };

  const onLookup = async () => {
    if (!lookupId.trim()) return;
    await openById(lookupId.trim());
  };

  const onDelete = async (id: Id) => {
    if (!confirm("Biztos törlöd ezt a hallgatót?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await api.students.remove(id);
      setMsg("Hallgató törölve.");
      setSelected(null);
      await load();
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!selected) return;
    setErr(null);
    setMsg(null);

    let patch: any = null;
    try {
      patch = JSON.parse(patchJson || "{}");
    } catch {
      return setErr("A patch JSON érvénytelen.");
    }

    setLoading(true);
    try {
      const updated = await api.students.update(selected.id, patch);
      setSelected(updated);
      setMsg("Hallgató frissítve.");
      await load();
    } catch (e: any) {
      setErr(e.message || "Módosítás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Hallgatók</h1>
        <p className="text-sm text-slate-600">Hallgatói profilok: lista / lekérés / módosítás / törlés.</p>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Összes hallgató</h2>
            <button onClick={load} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
              Frissítés
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Hallgató ID..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={onLookup}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Lekérés
            </button>
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Név / Email</th>
                  <th className="px-3 py-2 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={String(s.id)} className="border-t">
                    <td className="px-3 py-2">{String(s.id)}</td>
                    <td className="px-3 py-2 font-medium">
                      {s.fullName ?? s.name ?? s.email ?? `User #${s.id}`}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openById(s.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                          Megnyitás
                        </button>
                        <button onClick={() => onDelete(s.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
                          Törlés
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-slate-500" colSpan={3}>
                      Nincs adat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold mb-3">Kijelölt hallgató</h2>

          {!selected ? (
            <div className="text-sm text-slate-600">Válassz egy hallgatót a listából.</div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs overflow-auto">
                <pre>{JSON.stringify(selected, null, 2)}</pre>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">PATCH JSON (csak a módosítandó mezők)</label>
                <textarea
                  value={patchJson}
                  onChange={(e) => setPatchJson(e.target.value)}
                  className="w-full min-h-[140px] rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Példa: {"{ \"currentMajor\": \"Mérnökinformatikus BSc\" }"}
                </p>
              </div>

              <button
                disabled={loading}
                onClick={onUpdate}
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Módosítás mentése
              </button>

              <button
                disabled={loading}
                onClick={() => onDelete(selected.id)}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                Hallgató törlése
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
