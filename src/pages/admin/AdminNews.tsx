import { useEffect, useMemo, useState } from "react";
import { api, type NewsCreatePayload, type NewsItem } from "../../lib/api";
import NewsFormModal from "../../components/admin/NewsFormModal";

type Id = string | number;
type Tab = "active" | "archived";

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700">
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

  // Helper to extract list from response
  const extractList = (response: any): NewsItem[] => {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    if (response && Array.isArray(response.items)) return response.items;
    if (response && Array.isArray(response.news)) return response.news; // Potential specific key
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
      console.log('Raw active news response:', activesResponse);
      const actives = extractList(activesResponse);
      console.log('Extracted actives:', actives);
      setActiveItems(actives);
    } catch (e: any) {
      console.error("Failed to load active news:", e);
      // We don't block everything if this fails, but we might want to show error
      setErr(prev => prev ? `${prev} Hiba az aktív híreknél.` : "Hiba a hírek betöltésekor.");
    }

    // Load archived news
    try {
      const archivesResponse = await api.news.admin.listArchived();
      console.log('Raw archived news response:', archivesResponse);
      const archives = extractList(archivesResponse);
      console.log('Extracted archives:', archives);
      setArchivedItems(archives);
    } catch (e: any) {
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
    } catch (e: any) {
      setErr(e?.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const onArchive = async (id: Id) => {
    if (!confirm("Biztos archiválod ezt a hírt? Nem fog megjelenni a hallgatóknak.")) return;
    setLoading(true);
    try {
      await api.news.admin.archive(id);
      setMsg("Hír archiválva.");
      await load();
    } catch (e: any) {
      setErr(e.message || "Archiválás sikertelen.");
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
    } catch (e: any) {
      setErr(e.message || "Visszaállítás sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const items = currentTab === "active" ? activeItems : archivedItems;
  const rows = useMemo(() => items ?? [], [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Hírek kezelése</h1>
        <p className="text-sm text-slate-600">
          Új hírek létrehozása, szerkesztése, archiválása és törlése.
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setCurrentTab("active")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Aktív hírek
            </button>
            <button
              onClick={() => setCurrentTab("archived")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentTab === "archived" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Archivált
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={load}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition"
            >
              Frissítés
            </button>
            <button
              onClick={handleCreateNew}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              + Új hír
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-slate-200 max-h-[600px]">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Cím / Részletek</th>
                <th className="px-4 py-3 text-left font-semibold">Címkék</th>
                <th className="px-4 py-3 text-right font-semibold">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((n) => (
                <tr key={String(n.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-top max-w-md">
                    <div className="flex items-start gap-2">
                      <div className="font-semibold text-slate-900">
                        {n.title}
                      </div>
                      {n.important && (
                        <span className="flex-shrink-0 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-100">
                          !
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {n.content}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5">
                      Célközönség: <span className="font-mono bg-slate-100 px-1 rounded">{n.targetGroup || "STUDENT"}</span>
                      {n.createdAt && ` • Létrehozva: ${new Date(n.createdAt).toLocaleDateString()}`}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {(n.tags || []).slice(0, 5).map((t) => (
                        <Chip key={t} text={t} />
                      ))}
                      {(n.tags || []).length > 5 && (
                        <span className="text-xs text-slate-400">
                          +{(n.tags || []).length - 5}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-end gap-2">
                      {currentTab === "active" ? (
                        <>
                          <button
                            onClick={() => startEdit(n)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => onArchive(n.id)}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition"
                            title="Archiválás (eltüntetés a hallgatók elől)"
                          >
                            Archivál
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRestore(n.id)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          Visszaállítás
                        </button>
                      )}

                      <button
                        onClick={() => onDelete(n.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                        title="Végleges törlés"
                      >
                        Törlés
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-500" colSpan={3}>
                    Nincs {currentTab === "active" ? "aktív" : "archivált"} hír.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
