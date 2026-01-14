import { useEffect, useMemo, useState } from "react";
import { api, type NewsCreatePayload, type NewsItem, type NewsAudience } from "../../lib/api";

type Id = string | number;

const INITIAL: NewsCreatePayload = {
  title: "",
  body: "",
  tags: [],
  audience: "students",
  important: false,
};

function Chip({ text, onRemove }: { text: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700">
      {text}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full px-1 text-slate-500 hover:text-slate-900"
          aria-label="Eltávolítás"
        >
          ×
        </button>
      )}
    </span>
  );
}

export default function AdminNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [form, setForm] = useState<NewsCreatePayload>(INITIAL);

  const [tagInput, setTagInput] = useState("");

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.news.list(); // admin: mindet
      setItems(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setErr(e?.message || "Hiba a hírek lekérésénél.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(INITIAL);
    setTagInput("");
  };

  const startEdit = (n: NewsItem) => {
    setMsg(null);
    setErr(null);
    setEditingId(n.id);
    setForm({
      title: n.title || "",
      body: n.body || "",
      tags: Array.isArray(n.tags) ? n.tags : [],
      audience: (n.audience || "students") as NewsAudience,
      important: !!n.important,
    });
    setTagInput("");
  };

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if ((form.tags || []).some((x) => x.toLowerCase() === t.toLowerCase())) return;
    setForm((p) => ({ ...p, tags: [...(p.tags || []), t] }));
  };

  const removeTag = (t: string) => {
    setForm((p) => ({ ...p, tags: (p.tags || []).filter((x) => x !== t) }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!form.title.trim()) return setErr("A cím kötelező.");
    if (!form.body.trim()) return setErr("A szöveg kötelező.");

    setLoading(true);
    try {
      if (editingId != null) {
        await api.news.update(editingId, form);
        setMsg("Hír frissítve.");
      } else {
        await api.news.create(form);
        setMsg("Hír létrehozva.");
      }
      await load();
      resetForm();
    } catch (e: any) {
      setErr(e?.message || "Mentés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: Id) => {
    if (!confirm("Biztos törlöd ezt a hírt?")) return;
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      await api.news.remove(id);
      setMsg("Hír törölve.");
      await load();
      if (editingId === id) resetForm();
    } catch (e: any) {
      setErr(e?.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => items ?? [], [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Hírek</h1>
        <p className="text-sm text-slate-600">
          Hír létrehozás / módosítás / törlés, címkékkel.
        </p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bal: lista */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Kiküldött hírek</h2>
            <button
              onClick={load}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
            >
              Frissítés
            </button>
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Cím</th>
                  <th className="px-3 py-2 text-left">Címkék</th>
                  <th className="px-3 py-2 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((n) => (
                  <tr key={String(n.id)} className="border-t align-top">
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-900">
                        {n.title}
                        {n.important && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 border border-red-100">
                            fontos
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        audience: {n.audience || "students"}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(n.tags || []).slice(0, 6).map((t) => (
                          <Chip key={t} text={t} />
                        ))}
                        {(n.tags || []).length > 6 && (
                          <span className="text-xs text-slate-500">
                            +{(n.tags || []).length - 6}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(n)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Szerkesztés
                        </button>
                        <button
                          onClick={() => onDelete(n.id)}
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
              {editingId != null ? `Hír módosítása (ID: ${editingId})` : "Új hír létrehozása"}
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
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Cím *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Pl. Félév végi értékelés – határidő"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Szöveg *</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                className="w-full min-h-[140px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Hír részletei..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Célközönség</label>
                <select
                  value={form.audience}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, audience: e.target.value as NewsAudience }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="students">students</option>
                  <option value="all">all</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!form.important}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, important: e.target.checked }))
                    }
                  />
                  Fontos
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Címkék</label>

              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                      setTagInput("");
                    }
                  }}
                  placeholder='Pl. "fontos", "félév záró értékelés"...'
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    addTag(tagInput);
                    setTagInput("");
                  }}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  + Add
                </button>
              </div>

              {(form.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(form.tags || []).map((t) => (
                    <Chip key={t} text={t} onRemove={() => removeTag(t)} />
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {editingId != null ? "Módosítás mentése" : "Hír létrehozása"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
