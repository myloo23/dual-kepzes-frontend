import { useEffect, useMemo, useState } from "react";
import { api, type NewsCreatePayload, type NewsItem } from "../../lib/api";
import NewsFormModal from "../../features/news/components/modals/NewsFormModal";
import Button from "../../components/ui/Button";
import { ArrowUp, ArrowDown } from "lucide-react";

type Id = string | number;
type Tab = "active" | "archived";

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 transition-colors">
      {text}
    </span>
  );
}

export default function AdminNews() {
  const [activeItems, setActiveItems] = useState<NewsItem[]>([]);
  const [archivedItems, setArchivedItems] = useState<NewsItem[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>("active");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Helper to extract list from response
  const extractList = (response: unknown): NewsItem[] => {
    if (Array.isArray(response)) return response as NewsItem[];
    if (response !== null && typeof response === "object") {
      const r = response as Record<string, unknown>;
      if (Array.isArray(r.data)) return r.data as NewsItem[];
      if (Array.isArray(r.items)) return r.items as NewsItem[];
      if (Array.isArray(r.news)) return r.news as NewsItem[];
    }
    return [];
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);

    // Load active news
    try {
      const activesResponse = await api.news.admin.list();
      const actives = extractList(activesResponse);
      setActiveItems(actives);
    } catch (e: unknown) {
      console.error("Failed to load active news:", e);
      // We don't block everything if this fails, but we might want to show error
      setErr((prev) =>
        prev ? `${prev} Hiba az aktív híreknél.` : "Hiba a hírek betöltésekor.",
      );
    }

    // Load archived news
    try {
      const archivesResponse = await api.news.admin.listArchived();
      const archives = extractList(archivesResponse);
      setArchivedItems(archives);
    } catch (e: unknown) {
      console.error("Failed to load archived news:", e);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
    setMsg(null);
    setErr(null);
  };

  const startEdit = (n: NewsItem) => {
    setMsg(null);
    setErr(null);
    setEditingItem(n);
    setIsModalOpen(true);
  };

  const handleSave = async (data: NewsCreatePayload) => {
    if (editingItem) {
      await api.news.admin.update(editingItem.id, data);
      setMsg("Hír frissítve.");
    } else {
      await api.news.admin.create(data);
      setMsg("Hír létrehozva.");
    }
    await load();
  };

  const onDelete = async (id: Id) => {
    if (!confirm("Biztos törlöd ezt a hírt? Végleges művelet.")) return;
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      await api.news.admin.remove(id);
      setMsg("Hír véglegesen törölve.");
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onArchive = async (id: Id) => {
    if (
      !confirm(
        "Biztos archiválod ezt a hírt? Nem fog megjelenni a hallgatóknak.",
      )
    )
      return;
    setLoading(true);
    try {
      await api.news.admin.archive(id);
      setMsg("Hír archiválva.");
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Archiválás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onRestore = async (id: Id) => {
    setLoading(true);
    try {
      await api.news.admin.unarchive(id);
      setMsg("Hír visszaállítva (aktív).");
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Visszaállítás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  // Sorting Logic
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const items = currentTab === "active" ? activeItems : archivedItems;

  // ... (keep logic above)

  const rows = useMemo(() => {
    const sortableItems = [...(items ?? [])];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // @ts-expect-error - dynamic key access
        const aValue = a[sortConfig.key] ?? "";
        // @ts-expect-error - dynamic key access
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
            Hírek kezelése
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
            Hírek, értesítések és közlemények publikálása a hallgatók számára.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={load} variant="outline" size="sm">
            Frissítés
          </Button>
          <Button onClick={handleCreateNew} variant="primary" size="sm">
            + Új hír létrehozása
          </Button>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-400 transition-colors">
          {msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl transition-colors">
          <button
            onClick={() => setCurrentTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              currentTab === "active"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Aktív hírek
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 transition-colors">
              {activeItems.length}
            </span>
          </button>
          <button
            onClick={() => setCurrentTab("archived")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              currentTab === "archived"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Archivált
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 transition-colors">
              {archivedItems.length}
            </span>
          </button>
        </div>

        {/* Sorting Dropdown (Simplified for List View) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider transition-colors">
            Rendezés:
          </span>
          <select
            className="text-sm border-none bg-transparent dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onChange={(e) => handleSort(e.target.value)}
            value={sortConfig?.key || ""}
          >
            <option value="">Alapértelmezett</option>
            <option value="title">Cím</option>
            <option value="createdAt">Dátum</option>
            <option value="targetGroup">Célcsoport</option>
          </select>
          <button
            onClick={() =>
              setSortConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }
                  : null,
              )
            }
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 transition-colors"
            title="Irány váltása"
          >
            {sortConfig?.direction === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {rows.length === 0 && !loading && (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-slate-500 dark:text-slate-400 transition-colors">
              Nincs megjeleníthető{" "}
              {currentTab === "active" ? "aktív" : "archivált"} hír.
            </p>
          </div>
        )}

        {rows.map((n) => (
          <div
            key={String(n.id)}
            className="group relative flex flex-col sm:flex-row sm:items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200"
          >
            {/* Left Color Bar Indicator for Priority */}
            {n.isImportant && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 dark:bg-red-600 rounded-l-2xl transition-colors" />
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {n.isImportant && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 uppercase tracking-wide transition-colors">
                    Fontos
                  </span>
                )}
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 transition-colors">
                  {formatDate(n.createdAt)}
                </span>
                <span className="text-slate-300 dark:text-slate-600 transition-colors">
                  •
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase transition-colors">
                  {n.targetGroup === "ALL" ? "Mindenkinek" : n.targetGroup}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {n.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed transition-colors">
                {n.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(n.tags || []).map((t) => (
                  <Chip key={t} text={t} />
                ))}
              </div>
            </div>

            {/* Actions Panel - Validated by Hover or Flex layout */}
            <div className="flex sm:flex-col items-center sm:items-end justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0 min-w-[120px] transition-colors">
              {currentTab === "active" ? (
                <>
                  <Button
                    onClick={() => startEdit(n)}
                    variant="outlineAccent"
                    size="sm"
                    className="w-full justify-center"
                  >
                    Szerkesztés
                  </Button>
                  <Button
                    onClick={() => onArchive(n.id)}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  >
                    Archiválás
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => onRestore(n.id)}
                  variant="success"
                  size="sm"
                  className="w-full justify-center"
                >
                  Visszaállítás
                </Button>
              )}

              <Button
                onClick={() => onDelete(n.id)}
                variant="ghost"
                size="sm"
                className="w-full justify-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                Törlés
              </Button>
            </div>
          </div>
        ))}
      </div>

      <NewsFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}
