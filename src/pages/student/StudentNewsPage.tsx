import { useEffect, useMemo, useState } from "react";
import { api, type NewsItem } from "../../lib/api";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("ALL");
  const [onlyImportant, setOnlyImportant] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // diákok: students + (ha backend így dönt) all
      const list = await api.news.list("students");
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setErr(e?.message || "Nem sikerült betölteni a híreket.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const n of items) (n.tags || []).forEach((t) => t && set.add(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "hu"));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((n) => {
      if (onlyImportant && !n.important) return false;
      if (tag !== "ALL" && !(n.tags || []).includes(tag)) return false;

      if (!q) return true;
      const hay = `${n.title} ${n.body} ${(n.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search, tag, onlyImportant]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">Hírek</h1>
        <p className="text-sm text-slate-600">
          Admin által kiküldött hírek és értesítések.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="text-xs font-medium text-slate-700">Keresés</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cím, szöveg, címke..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Címke</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">Bármely</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={onlyImportant}
                onChange={(e) => setOnlyImportant(e.target.checked)}
              />
              Csak fontos
            </label>

            <button
              type="button"
              onClick={load}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Frissítés
            </button>
          </div>
        </div>
      </section>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Betöltés...
        </div>
      )}

      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Nincs megjeleníthető hír.
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((n) => (
          <article
            key={String(n.id)}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                {n.title}
              </h2>

              <div className="flex items-center gap-2">
                {n.important && (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 border border-red-100">
                    Fontos
                  </span>
                )}
                {(n.createdAt || n.updatedAt) && (
                  <span className="text-xs text-slate-500">
                    {formatDate(n.updatedAt || n.createdAt)}
                  </span>
                )}
              </div>
            </div>

            {(n.tags || []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(n.tags || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
              {n.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
