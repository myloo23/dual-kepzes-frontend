import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => Promise<void>;
}

export function CreateAlbumModal({
  isOpen,
  onClose,
  onCreate,
}: CreateAlbumModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setDescription("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Az album neve kötelező.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCreate(name.trim(), description.trim() || undefined);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba az album létrehozásakor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Új album létrehozása
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Album neve <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="pl. Rendezvény 2026"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Leírás{" "}
              <span className="font-normal text-slate-400">(opcionális)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rövid leírás az albumról..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Létrehozás...
                </>
              ) : (
                "Létrehozás"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
