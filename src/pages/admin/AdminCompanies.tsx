import { useEffect, useMemo, useState } from "react";
import { api, type Company } from "../../lib/api";
import CompanyFormModal from "../../components/admin/CompanyFormModal";

type Id = string | number;

const ensureCompanyId = (id: Id | null) => {
  const s = String(id ?? "").trim();
  if (!s) throw new Error("Hiányzó companyId (nincs kiválasztott cég / üres ID).");
  return s;
};

export default function AdminCompanies() {
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // ID alapú lekéréshez
  const [lookupId, setLookupId] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.companies.list();
      setItems(res);
    } catch (e: any) {
      setErr(e.message || "Hiba a cégek lekérésénél.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateNew = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
    setMsg(null);
    setErr(null);
  };

  const onEdit = async (id: Id) => {
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const c = await api.companies.get(id);
      setEditingCompany(c);
      setIsModalOpen(true);
    } catch (e: any) {
      setErr(e.message || "Nem sikerült betölteni a céget.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: Id) => {
    if (!confirm("Biztos törlöd ezt a céget?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await api.companies.remove(id);
      setMsg("Cég törölve.");
      await load();
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Omit<Company, "id">) => {
    if (editingCompany) {
      const safeId = ensureCompanyId(editingCompany.id);
      await api.companies.update(safeId, data);
      setMsg("Cég frissítve.");
    } else {
      await api.companies.create(data);
      setMsg("Cég létrehozva.");
    }
    await load();
  };

  const onLookup = async () => {
    setErr(null);
    setMsg(null);
    if (!lookupId.trim()) return;

    setLoading(true);
    try {
      const c = await api.companies.get(lookupId.trim());
      setMsg(`Lekért cég: ${c.name}`);
      await onEdit(c.id);
    } catch (e: any) {
      setErr(e.message || "Nincs ilyen cég / hiba.");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => items ?? [], [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Cégek</h1>
        <p className="text-sm text-slate-600">Összes cég, cég létrehozás / módosítás / törlés.</p>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">Összes cég</h2>
            <button
              onClick={handleCreateNew}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              + Új cég
            </button>
          </div>
          <button
            onClick={load}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition"
          >
            Frissítés
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Cég keresése ID alapján..."
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="button"
            onClick={onLookup}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition shadow-sm"
          >
            Lekérés
          </button>
        </div>

        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">ID</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Név</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Kapcsolattartó</th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={String(c.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{String(c.id).slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="text-xs">{c.contactName}</div>
                    <div className="text-[10px] text-slate-400">{c.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(c.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        Törlés
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-500" colSpan={5}>
                    Nincs adat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCompany}
      />
    </div>
  );
}
