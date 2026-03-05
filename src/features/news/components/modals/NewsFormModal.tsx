import { useEffect, useState } from "react";
import {
  type NewsCreatePayload,
  type NewsItem,
  type NewsTargetGroup,
} from "../../../../lib/api";
import { Modal } from "../../../../components/ui/Modal";

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewsCreatePayload) => Promise<void>;
  initialData?: NewsItem | null;
}

const INITIAL_FORM_STATE: NewsCreatePayload = {
  title: "",
  content: "",
  tags: [],
  targetGroup: "STUDENT",
  isImportant: false,
};

function Chip({ text, onRemove }: { text: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 transition-colors">
      {text}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full px-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Eltávolítás"
        >
          ×
        </button>
      )}
    </span>
  );
}

export default function NewsFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: NewsFormModalProps) {
  const [formData, setFormData] =
    useState<NewsCreatePayload>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setTagInput("");
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          content: initialData.content || "",
          tags: initialData.tags || [],
          targetGroup: initialData.targetGroup || "STUDENT",
          isImportant: !!initialData.isImportant,
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
    }
  }, [isOpen, initialData]);

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if ((formData.tags || []).some((x) => x.toLowerCase() === t.toLowerCase()))
      return;
    setFormData((p) => ({ ...p, tags: [...(p.tags || []), t] }));
  };

  const removeTag = (t: string) => {
    setFormData((p) => ({ ...p, tags: (p.tags || []).filter((x) => x !== t) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("A cím kötelező.");
      return;
    }
    if (!formData.content.trim()) {
      setError("A szöveg kötelező.");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Mentés sikertelen.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Hír szerkesztése" : "Új hír létrehozása"}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Cím *
          </label>
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400 transition-colors"
            placeholder="Pl. Félév végi értékelés – határidő"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Szöveg *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((p) => ({ ...p, content: e.target.value }))
            }
            rows={6}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400 transition-colors"
            placeholder="Hír részletei..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Célközönség
            </label>
            <select
              value={formData.targetGroup}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  targetGroup: e.target.value as NewsTargetGroup,
                }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            >
              <option value="STUDENT">Hallgatók (STUDENT)</option>
              <option value="COMPANY_ADMIN">
                Céges adminisztrátorok (COMPANY_ADMIN)
              </option>
              <option value="UNIVERSITY_USER">
                Egyetemi felhasználók (UNIVERSITY_USER)
              </option>
              <option value="SYSTEM_ADMIN">
                Rendszergazdák (SYSTEM_ADMIN)
              </option>
              <option value="MENTOR">Mentorok (MENTOR)</option>
              <option value="ALL">Mindenki (ALL)</option>
            </select>
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!formData.isImportant}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isImportant: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-medium">Fontos kiemelés</span>
            </label>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/50 transition-colors">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2 transition-colors">
            Címkék
          </label>

          <div className="flex gap-2 mb-2">
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
              placeholder='Pl. "fontos", "vizsga"...'
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                addTag(tagInput);
                setTagInput("");
              }}
              className="rounded-lg bg-slate-800 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
            >
              + Hozzáad
            </button>
          </div>

          {(formData.tags || []).length > 0 ? (
            <div className="flex flex-wrap gap-1.5 p-1">
              {(formData.tags || []).map((t) => (
                <Chip key={t} text={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic transition-colors">
              Nincsenek címkék.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors"
          >
            Mégse
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {loading
              ? "Mentés..."
              : initialData
                ? "Módosítások mentése"
                : "Hír létrehozása"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
