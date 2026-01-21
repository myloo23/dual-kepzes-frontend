import { useEffect, useState } from "react";
import { type NewsCreatePayload, type NewsItem, type NewsTargetGroup } from "../../../../lib/api";

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

export default function NewsFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: NewsFormModalProps) {
    const [formData, setFormData] = useState<NewsCreatePayload>(INITIAL_FORM_STATE);
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
                    important: !!initialData.important,
                });
            } else {
                setFormData(INITIAL_FORM_STATE);
            }
        }
    }, [isOpen, initialData]);

    const addTag = (raw: string) => {
        const t = raw.trim();
        if (!t) return;
        if ((formData.tags || []).some((x) => x.toLowerCase() === t.toLowerCase())) return;
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
            const errorMessage = e instanceof Error ? e.message : 'Mentés sikertelen.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
                <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {initialData ? "Hír szerkesztése" : "Új hír létrehozása"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Cím *</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Pl. Félév végi értékelés – határidő"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Szöveg *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                            rows={6}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Hír részletei..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Célközönség</label>
                            <select
                                value={formData.targetGroup}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, targetGroup: e.target.value as NewsTargetGroup }))
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="STUDENT">Hallgatók (STUDENT)</option>
                                <option value="ALL">Mindenki (ALL)</option>
                            </select>
                        </div>

                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!formData.important}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, important: e.target.checked }))
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="font-medium">Fontos kiemelés</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-lg border border-slate-200 p-3 bg-slate-50">
                        <label className="text-xs font-medium text-slate-700 block mb-2">Címkék</label>

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
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    addTag(tagInput);
                                    setTagInput("");
                                }}
                                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition"
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
                            <p className="text-xs text-slate-500 italic">Nincsenek címkék.</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Mégse
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Mentés..." : initialData ? "Módosítások mentése" : "Hír létrehozása"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
