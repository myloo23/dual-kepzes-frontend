import { useEffect, useMemo, useState } from "react";
import { api, type Company, type Position } from "../../lib/api";

type Id = string | number;

function positionLabel(p: Position) {
  return p.title ?? p.name ?? `Position #${p.id}`;
}

export default function AdminPositions() {
  const [items, setItems] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<Id | null>(null);

  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState<string>("");
  const [city, setCity] = useState("");
  const [deadline, setDeadline] = useState(""); // YYYY-MM-DD
  const [acceptsSenior, setAcceptsSenior] = useState(false);

  const [lookupId, setLookupId] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCompanyId("");
    setCity("");
    setDeadline("");
    setAcceptsSenior(false);
  };

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [pos, comps] = await Promise.all([api.positions.list(), api.companies.list()]);
      setItems(pos);
      setCompanies(comps);
    } catch (e: any) {
      setErr(e.message || "Hiba a pozíciók lekérésénél.");
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
      setTitle(p.title ?? p.name ?? "");
      setCompanyId(String(p.companyId ?? p.company?.id ?? ""));
      setCity(p.city ?? p.locationCity ?? "");
      setDeadline((p.deadline ?? p.applicationDeadline ?? "").slice?.(0, 10) || "");
      setAcceptsSenior(!!(p.acceptsSenior ?? p.isSeniorAllowed));
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

    if (!title.trim()) return setErr("A pozíció megnevezése kötelező.");
    if (!companyId.trim()) return setErr("A companyId kötelező (válassz céget).");

    const payload: Partial<Position> = {
      title: title.trim(),
      companyId: companyId.trim(),
      city: city.trim() || undefined,
      deadline: deadline || undefined,
      acceptsSenior: !!acceptsSenior,
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
    setErr(null);
    setMsg(null);
    if (!lookupId.trim()) return;

    setLoading(true);
    try {
      const p = await api.positions.get(lookupId.trim());
      setMsg(`Lekért pozíció: ${positionLabel(p)}`);
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
        <p className="text-sm text-slate-600">Összes pozíció + CRUD.</p>
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
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Pozíció ID..."
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
                  <th className="px-3 py-2 text-left">Megnevezés</th>
                  <th className="px-3 py-2 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={String(p.id)} className="border-t">
                    <td className="px-3 py-2">{String(p.id)}</td>
                    <td className="px-3 py-2 font-medium">{positionLabel(p)}</td>
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">
              {editingId != null ? `Pozíció módosítása (ID: ${editingId})` : "Pozíció létrehozása"}
            </h2>
            {editingId != null && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                Mégse
              </button>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Megnevezés *</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Cég *</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                <option value="">Válassz céget...</option>
                {companies.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {(c.name ?? c.companyName ?? `#${c.id}`) as string}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">Ha a backend mást vár (pl. company_id), később api.ts-ben igazítjuk.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Város</label>
                <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={city} onChange={(e) => setCity(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Határidő</label>
                <input type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={acceptsSenior} onChange={(e) => setAcceptsSenior(e.target.checked)} />
              Felsőbb évest fogad
            </label>

            <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {editingId != null ? "Módosítás mentése" : "Pozíció létrehozása"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
