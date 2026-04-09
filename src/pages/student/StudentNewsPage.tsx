import { useEffect, useMemo, useState } from "react";
import { api, type NewsItem } from "../../lib/api";
import NewsCard from "../../features/news/components/NewsCard";
import NewsFilter from "../../features/news/components/NewsFilter";
import { Modal } from "../../components/ui/Modal";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function getNewsSortDate(news: NewsItem): number {
  return (
    new Date(news.createdAt || news.updatedAt || 0).getTime() || Number.MIN_SAFE_INTEGER
  );
}

export default function StudentNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("ALL");
  const [onlyImportant, setOnlyImportant] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [hasAutoOpenedImportant, setHasAutoOpenedImportant] = useState(false);

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

  useEffect(() => {
    if (loading || hasAutoOpenedImportant || selectedNews) return;
    const latestImportant = items
      .filter((n) => n.isImportant)
      .sort((a, b) => getNewsSortDate(b) - getNewsSortDate(a))[0];
    if (latestImportant) {
      setSelectedNews(latestImportant);
      setHasAutoOpenedImportant(true);
    }
  }, [items, loading, hasAutoOpenedImportant, selectedNews]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const n of items) (n.tags || []).forEach((t) => t && set.add(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "hu"));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((n) => {
      if (onlyImportant && !n.isImportant) return false;
      if (tag !== "ALL" && !(n.tags || []).includes(tag)) return false;

      if (!q) return true;
      const hay =
        `${n.title} ${n.content} ${(n.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search, tag, onlyImportant]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Hírek
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Betöltés...
        </div>
      )}

      {err && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 transition-colors">
          {err}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Nincs megjeleníthető hír.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
        {filtered.map((n) => (
          <NewsCard key={String(n.id)} news={n} onOpen={setSelectedNews} />
        ))}
      </div>

      <Modal
        isOpen={Boolean(selectedNews)}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title || "Hir"}
        size="2xl"
        description={
          selectedNews?.isImportant
            ? "Kiemelt hirkent lett megjelolve."
            : undefined
        }
      >
        {selectedNews && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(selectedNews.createdAt || selectedNews.updatedAt)}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">
              {selectedNews.content}
            </div>
            {(selectedNews.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {(selectedNews.tags || []).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 text-xs text-slate-600 dark:text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
