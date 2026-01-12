import { useEffect, useMemo, useState } from "react";
import { api, type Company, type Position, type Tag } from "../../lib/api";

type Id = string | number;

const INITIAL_FORM_STATE: Omit<Position, "id"> = {
  companyId: "",
  title: "",
  description: "",
  zipCode: "",
  city: "",
  address: "",
  deadline: "",
  tags: [],
};

// Helper to format ISO string for datetime-local input
// from "2024-08-15T10:00:00.000Z" to "2024-08-15T10:00"
const formatDeadlineForInput = (iso: string) => (iso ? iso.slice(0, 16) : "");

// Helper to format local datetime string to UTC ISO string
// from "2024-08-15T10:00" to "2024-08-15T10:00:00Z"
const formatDeadlineForApi = (local: string) =>
  local ? new Date(local).toISOString() : "";

export default function AdminPositions() {
  const [items, setItems] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [formData, setFormData] = useState<Omit<Position, "id">>(INITIAL_FORM_STATE);
  const [lookupId, setLookupId] = useState("");

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index: number, field: keyof Tag, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = { ...newTags[index], [field]: value };
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, { name: "", category: "" }],
    }));
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

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

  const onEdit = async (id: Id) => {
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const p = await api.positions.get(id);
      setEditingId(id);
      setFormData({
        ...p,
        deadline: formatDeadlineForInput(p.deadline),
        tags: p.tags || [],
      });
      setMsg("Betöltve szerkesztéshez.");
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
      if (editingId === id) resetForm();
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!formData.title.trim()) return setErr("A pozíció megnevezése kötelező.");
    if (!formData.companyId.trim()) return setErr("A cég kiválasztása kötelező.");

    const payload: Omit<Position, "id"> = {
      ...formData,
      deadline: formatDeadlineForApi(formData.deadline),
      tags: formData.tags
        .map((tag) => ({
          name: tag.name.trim(),
          category: tag.category?.trim() || undefined,
        }))
        .filter((tag) => tag.name), // Only include tags that have a name
    };

    setLoading(true);
    try {
      if (editingId != null) {
        await api.positions.update(editingId, payload);
        setMsg("Pozíció frissítve.");
      } else {
        await api.positions.create(payload);
        setMsg("Pozíció létrehozva.");
      }
      await load();
      resetForm();
    } catch (e: any) {
      setErr(e.message || "Mentés sikertelen.");
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

  const rows = useMemo(() => items ?? [], [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Pozíciók</h1>
        <p className="text-sm text-slate-600">Összes pozíció, létrehozás, módosítás, törlés.</p>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Összes pozíció</h2>
            <button onClick={load} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
              Frissítés
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="Pozíció ID..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={onLookup} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
              Lekérés
            </button>
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Megnevezés</th>
                  <th className="px-3 py-2 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={String(p.id)} className="border-t">
                    <td className="px-3 py-2">{String(p.id)}</td>
                    <td className="px-3 py-2 font-medium">{p.title}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEdit(p.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                          Szerkesztés
                        </button>
                        <button onClick={() => onDelete(p.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
                          Törlés
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-slate-500" colSpan={3}>Nincs adat.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">{editingId != null ? `Pozíció módosítása (ID: ${editingId})` : "Új pozíció"}</h2>
            {editingId != null && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">Mégse</button>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Cég *</label>
              <select name="companyId" value={formData.companyId} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="">Válassz céget...</option>
                {companies.map((c) => (<option key={String(c.id)} value={String(c.id)}>{c.name}</option>))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Megnevezés *</label>
              <input name="title" value={formData.title} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Leírás*</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Irányítószám*</label>
                <input name="zipCode" value={formData.zipCode} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Város*</label>
                <input name="city" value={formData.city} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Cím*</label>
              <input name="address" value={formData.address} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Jelentkezési határidő*</label>
              <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div className="space-y-3 rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">Címkék</label>
                <button type="button" onClick={addTag} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">
                  + Címke
                </button>
              </div>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input placeholder="Név (pl. React)" value={tag.name} onChange={(e) => handleTagChange(index, "name", e.target.value)} className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
                  <input placeholder="Kategória (opcionális)" value={tag.category} onChange={(e) => handleTagChange(index, "category", e.target.value)} className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
                  <button type="button" onClick={() => removeTag(index)} className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              ))}
              {formData.tags.length === 0 && <p className="text-center text-xs text-slate-500 py-2">Nincsenek címkék hozzáadva.</p>}
            </div>

            <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {editingId != null ? "Módosítás mentése" : "Pozíció létrehozása"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
