import { useEffect, useMemo, useState } from "react";
import { api, type Company } from "../../lib/api";

type Id = string | number;

// The initial state for the form, matching the new Company shape (excluding id)
const INITIAL_FORM_STATE: Omit<Company, "id"> = {
  name: "",
  taxId: "",
  hqCountry: "",
  hqZipCode: "",
  hqCity: "",
  hqAddress: "",
  contactName: "",
  contactEmail: "",
};

export default function AdminCompanies() {
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // ID alapú lekéréshez
  const [lookupId, setLookupId] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

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

  const onEdit = async (id: Id) => {
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const c = await api.companies.get(id);
      setEditingId(id);
      // Populate form with all fields from the fetched company
      setFormData({
        name: c.name,
        taxId: c.taxId,
        hqCountry: c.hqCountry,
        hqZipCode: c.hqZipCode,
        hqCity: c.hqCity,
        hqAddress: c.hqAddress,
        contactName: c.contactName,
        contactEmail: c.contactEmail,
      });
      setMsg("Betöltve szerkesztéshez.");
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

    if (!formData.name.trim()) return setErr("A cég neve kötelező.");
    if (!formData.taxId.trim()) return setErr("Az adószám kötelező.");

    const payload = { ...formData };

    setLoading(true);
    try {
      if (editingId != null) {
        await api.companies.update(editingId, payload);
        setMsg("Cég frissítve.");
      } else {
        await api.companies.create(payload);
        setMsg("Cég létrehozva.");
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bal: lista */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Összes cég</h2>
            <button
              onClick={load}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
            >
              Frissítés
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Cég ID..."
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
                  <th className="px-3 py-2 text-left">Név</th>
                  <th className="px-3 py-2 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={String(c.id)} className="border-t">
                    <td className="px-3 py-2">{String(c.id)}</td>
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(c.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Szerkesztés
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Törlés
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
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

        {/* Jobb: create/edit */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">
              {editingId != null ? `Cég módosítása (ID: ${editingId})` : "Cég létrehozása"}
            </h2>
            {editingId != null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
              >
                Mégse
              </button>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">Cég neve *</label>
                <input name="name" value={formData.name} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Adószám *</label>
                <input name="taxId" value={formData.taxId} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Ország</label>
                <input name="hqCountry" value={formData.hqCountry} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Irányítószám</label>
                <input name="hqZipCode" value={formData.hqZipCode} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Város</label>
                <input name="hqCity" value={formData.hqCity} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-700">Cím</label>
                <input name="hqAddress" value={formData.hqAddress} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Kapcsolattartó neve</label>
                <input name="contactName" value={formData.contactName} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Kapcsolattartó e-mail</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleFormChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {editingId != null ? "Módosítás mentése" : "Cég létrehozása"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
