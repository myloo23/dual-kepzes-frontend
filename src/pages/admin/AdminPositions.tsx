import { useEffect, useMemo, useState } from "react";
import { api, type Company, type Position } from "../../lib/api";
import PositionFormModal from "../../components/admin/PositionFormModal";

type Id = string | number;

export default function AdminPositions() {
  const [items, setItems] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  const [lookupId, setLookupId] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [pos, comps] = await Promise.all([api.positions.list(), api.companies.list()]);
      setItems(pos);
      setCompanies(comps);
    } catch (e: any) {
      setErr(e.message || "Hiba az adatok lekérésénél.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateNew = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
    setMsg(null);
    setErr(null);
  };

  const onEdit = async (id: Id) => {
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const p = await api.positions.get(id);
      setEditingPosition(p);
      setIsModalOpen(true);
    } catch (e: any) {
      setErr(e.message || "Nem sikerült betölteni a pozíciót.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: Id) => {
    if (!confirm("Biztos törlöd ezt a pozíciót?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await api.positions.remove(id);
      setMsg("Pozíció törölve.");
      await load();
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onDeactivate = async (id: Id) => {
    if (!confirm("Biztosan deaktiválod ezt a pozíciót?\n\nA pozíció nem törlödik, csak inaktívvá válik.")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await api.positions.deactivate(id);
      setMsg("Pozíció sikeresen deaktiválva.");
      await load();
    } catch (e: any) {
      setErr(e.message || "Deaktiválás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onLookup = async () => {
    if (!lookupId.trim()) return;
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const p = await api.positions.get(lookupId.trim());
      setMsg(`Lekért pozíció: ${p.title}`);
      await onEdit(p.id);
    } catch (e: any) {
      setErr(e.message || "Nincs ilyen pozíció / hiba.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Omit<Position, "id">) => {
    if (editingPosition) {
      await api.positions.update(editingPosition.id, data);
      setMsg("Pozíció frissítve.");
    } else {
      await api.positions.create(data);
      setMsg("Pozíció létrehozva.");
    }
    await load();
  };

  const rows = useMemo(() => items ?? [], [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Pozíciók</h1>
        <p className="text-sm text-slate-600">Összes pozíció, létrehozás, módosítás, törlés.</p>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">Összes pozíció</h2>
            <button
              onClick={handleCreateNew}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              + Új pozíció
            </button>
          </div>
          <button onClick={load} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition-colors">
            Frissítés
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="Keresés ID alapján..." className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
          <button type="button" onClick={onLookup} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition shadow-sm">
            Lekérés
          </button>
        </div>

        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm divide-y divide-slate-200 relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">ID</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Megnevezés</th>
                <th className="px-4 py-3 text-center font-semibold bg-slate-50">Státusz</th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">Művelet</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={String(p.id)} className={`hover:bg-slate-50 transition-colors ${p.isActive === false ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{String(p.id).slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {p.isDual === false && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
                          💼
                        </span>
                      )}
                      {p.isActive === false ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                          Inaktív
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Aktív
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(p.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        Szerkesztés
                      </button>
                      {p.isActive !== false && (
                        <button onClick={() => onDeactivate(p.id)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                          Deaktiválás
                        </button>
                      )}
                      <button onClick={() => onDelete(p.id)} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                        Törlés
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-500" colSpan={4}>Nincs adat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PositionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        companies={companies}
        initialData={editingPosition}
      />
    </div>
  );
}
