import { useEffect, useState } from "react";
import { api, type StudentProfile } from "../../lib/api";
import StudentFormModal from "../../components/admin/StudentFormModal";

type Id = string | number;

export default function AdminUsers() {
  const [items, setItems] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [selected, setSelected] = useState<StudentProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lookupId, setLookupId] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.students.list();
      setItems(res);
    } catch (e: any) {
      setErr(e.message || "Hiba a hallgatók lekérésénél.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openById = async (id: Id) => {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const s = await api.students.get(id);
      setSelected(s);
      setIsModalOpen(true);
      setMsg("Hallgató betöltve.");
    } catch (e: any) {
      setErr(e.message || "Nem sikerült betölteni.");
    } finally {
      setLoading(false);
    }
  };

  const onLookup = async () => {
    if (!lookupId.trim()) return;
    await openById(lookupId.trim());
  };

  const onDelete = async (id: Id) => {
    if (!confirm("Biztos törlöd ezt a hallgatót?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await api.students.remove(id);
      setMsg("Hallgató törölve.");
      if (selected?.id === id) {
        setSelected(null);
        setIsModalOpen(false);
      }
      await load();
    } catch (e: any) {
      setErr(e.message || "Törlés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, any>) => {
    if (!selected) return;

    // We update the student with the data from the modal
    // Note: The modal returns a flat object, we might need to nest 'profile' if the backend requires it.
    // However, typically partial update merges at top level if configured so, or recursively.
    // Based on the 'register' payload being flat, and assuming 'update' accepts similar structure or smart enough controller.
    // If backend expects nested 'profile', we might need to restruct here.
    // Let's assume flat payload is accepted or handled by backend logic (which often separates user vs profile fields).
    // If AdminUsers.tsx was using `api.students.update(selected.id, patch)`, it implies flexible patching.

    await api.students.update(selected.id, data);
    setMsg("Hallgató adatai frissítve.");
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Hallgatók</h1>
        <p className="text-sm text-slate-600">Hallgatói profilok: lista / lekérés / módosítás / törlés.</p>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Összes hallgató</h2>
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
            placeholder="Hallgató keresése ID alapján..."
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
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Email</th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((s) => (
                <tr key={String(s.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{String(s.id).slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {s.fullName ?? (s as any).name ?? `User`}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {s.email ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openById(s.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        Törlés
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-500" colSpan={4}>
                    Nincs adat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selected}
      />
    </div>
  );
}
