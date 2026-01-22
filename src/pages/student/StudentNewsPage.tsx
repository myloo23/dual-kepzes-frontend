import { useEffect, useMemo, useState } from "react";
import { api, type NewsItem } from "../../lib/api";
import NewsCard from "../../features/news/components/NewsCard";
import NewsFilter from "../../features/news/components/NewsFilter";

export default function StudentNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("ALL");
  const [onlyImportant, setOnlyImportant] = useState(false);

  const extractList = (response: unknown): NewsItem[] => {
    if (Array.isArray(response)) return response;
    if (!response || typeof response !== "object") return [];
    const payload = response as {
      data?: NewsItem[];
      items?: NewsItem[];
      news?: NewsItem[];
    };
    return payload.data || payload.items || payload.news || [];
  };

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const list = await api.news.list();
      const extracted = extractList(list);
      setItems(extracted);
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
      const hay = `${n.title} ${n.content} ${(n.tags || []).join(" ")}`.toLowerCase();
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

      <NewsFilter
        search={search}
        tag={tag}
        onlyImportant={onlyImportant}
        allTags={allTags}
        onSearchChange={setSearch}
        onTagChange={setTag}
        onImportantChange={setOnlyImportant}
        onRefresh={load}
      />

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
          <NewsCard key={String(n.id)} news={n} />
        ))}
      </div>
    </div>
  );
}
