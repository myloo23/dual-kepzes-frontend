import { useEffect, useState } from "react";
import { type Position, type Tag, type Location } from "../../../../lib/api";
import { api } from "../../../../lib/api";
import { Modal } from "../../../../components/ui/Modal";

interface PositionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Position, "id">) => Promise<void>;
    companies: { id: string | number; name: string }[];
    initialData?: Position | null;
}

const INITIAL_FORM_STATE: Omit<Position, "id"> = {
    companyId: "",
    title: "",
    description: "",
    location: {
        zipCode: "",
        city: "",
        address: "",
    },
    deadline: "",
    isDual: false,
    tags: [],
};

// Helper to format ISO string for datetime-local input
const formatDeadlineForInput = (iso: string) => (iso ? iso.slice(0, 16) : "");

// Helper to format local datetime string to UTC ISO string
const formatDeadlineForApi = (local: string) =>
    local ? new Date(local).toISOString() : "";

export default function PositionFormModal({
    isOpen,
    onClose,
    onSave,
    companies,
    initialData,
}: PositionFormModalProps) {
    const [formData, setFormData] = useState<Omit<Position, "id">>(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableLocations, setAvailableLocations] = useState<Location[]>([]);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (initialData) {
                setFormData({
                    ...initialData,
                    companyId: initialData.companyId || (companies.length === 1 ? String(companies[0].id) : ""),
                    deadline: formatDeadlineForInput(initialData.deadline),
                    tags: initialData.tags || [],
                });
            } else {
                setFormData({
                    ...INITIAL_FORM_STATE,
                    companyId: companies.length === 1 ? String(companies[0].id) : "",
                });
            }
        }
    }, [isOpen, initialData, companies]);

    // Fetch company locations when companyId changes
    useEffect(() => {
        const fetchCompanyLocations = async () => {
            if (!formData.companyId) {
                setAvailableLocations([]);
                return;
            }

            try {
                const company = await api.companies.get(formData.companyId);
                if (company && company.locations) {
                    setAvailableLocations(company.locations);
                } else {
                    setAvailableLocations([]);
                }
            } catch (err) {
                console.error("Failed to fetch company locations:", err);
                // Don't show error to user as this is a background enhancement
                setAvailableLocations([]);
            }
        };

        fetchCompanyLocations();
    }, [formData.companyId]);

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === "zipCode" || name === "city" || name === "address") {
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location!,
                    [name]: value
                }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
    };

    const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = parseInt(e.target.value);
        if (index >= 0 && index < availableLocations.length) {
            const loc = availableLocations[index];
            setFormData((prev) => ({
                ...prev,
                location: {
                    country: loc.country,
                    zipCode: loc.zipCode,
                    city: loc.city,
                    address: loc.address
                }
            }));
        }
    };

    const handleTagChange = (index: number, field: keyof Tag, value: string) => {
        const newTags = [...formData.tags];
        newTags[index] = { ...newTags[index], [field]: value };
        setFormData((prev) => ({ ...prev, tags: newTags }));
    };

    const addTag = () => {
        setFormData((prev) => ({
            ...prev,
            tags: [...prev.tags, { name: "", category: "" }],
        }));
    };

    const removeTag = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError("A pozíció megnevezése kötelező.");
            return;
        }
        if (!formData.companyId.trim()) {
            setError("A cég kiválasztása kötelező.");
            return;
        }

        setLoading(true);
        try {
            const payload: Omit<Position, 'id'> = {
                ...formData,
                deadline: formatDeadlineForApi(formData.deadline),
                tags: formData.tags
                    .map((tag) => ({
                        name: tag.name.trim(),
                        category: tag.category?.trim() || undefined,
                    }))
                    .filter((tag) => tag.name),
            };
            await onSave(payload);
            onClose();
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Mentés sikertelen.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? `Pozíció szerkesztése` : "Új pozíció létrehozása"}
            size="3xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Cég *</label>
                        <select
                            name="companyId"
                            value={formData.companyId}
                            onChange={handleFormChange}
                            disabled={companies.length === 1}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                        >
                            <option value="">Válassz céget...</option>
                            {companies.map((c) => (
                                <option key={String(c.id)} value={String(c.id)}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Megnevezés *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Leírás *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows={5}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                    
                {/* Location Section */}
                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">Munkavégzés helye</h3>
                            {availableLocations.length > 0 && (
                                <select
                                    onChange={handleLocationSelect}
                                    className="text-xs border-slate-300 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500"
                                    value=""
                                >
                                    <option value="" disabled>Válassz a cég címei közül...</option>
                                    {availableLocations.map((loc, index) => (
                                        <option key={index} value={index}>
                                            {loc.city}, {loc.address}
                                        </option>
                                    ))}
                                </select>
                            )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Irányítószám *</label>
                            <input
                                name="zipCode"
                                value={formData.location?.zipCode || ""}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Város *</label>
                            <input
                                name="city"
                                value={formData.location?.city || ""}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Cím *</label>
                        <input
                            name="address"
                            value={formData.location?.address || ""}
                            onChange={handleFormChange}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Jelentkezési határidő *</label>
                    <input
                        type="datetime-local"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="space-y-2 rounded-lg border border-slate-200 p-3 bg-white">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isDual"
                            checked={formData.isDual || false}
                            onChange={handleFormChange}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-slate-900">Duális képzés pozíció</span>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Ha nincs bejelölve, akkor rendes teljes munkaidős állásként jelenik meg a főoldalon.
                            </p>
                        </div>
                    </label>
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 p-4 bg-white">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-800">Címkék</label>
                        <button
                            type="button"
                            onClick={addTag}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                            + Címke
                        </button>
                    </div>
                    {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                placeholder="Név (pl. React)"
                                value={tag.name}
                                onChange={(e) => handleTagChange(index, "name", e.target.value)}
                                className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                            />
                            <input
                                placeholder="Kategória (opcionális)"
                                value={tag.category}
                                onChange={(e) => handleTagChange(index, "category", e.target.value)}
                                className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {formData.tags.length === 0 && (
                        <p className="text-center text-xs text-slate-500 py-2">
                            Nincsenek címkék hozzáadva.
                        </p>
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
                        {loading ? "Mentés..." : initialData ? "Módosítások mentése" : "Pozíció létrehozása"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
