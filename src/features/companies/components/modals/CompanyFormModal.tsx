import { useEffect, useState } from "react";
import { type Company, type Location } from "../../../../lib/api";

interface CompanyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Company, "id">) => Promise<void>;
    initialData?: Company | null;
}

// Internal form state interface to handle flat inputs before transforming to nested output
interface CompanyFormData {
    name: string;
    taxId: string;
    locations: Partial<Location>[];
    contactName: string;
    contactEmail: string;
    description: string;
    website: string;
    logoUrl: string;
    hasOwnApplication: boolean;
}

const INITIAL_FORM_STATE: CompanyFormData = {
    name: "",
    taxId: "",
    locations: [{ country: "Magyarország", zipCode: "", city: "", address: "" }], // Default one empty location
    contactName: "",
    contactEmail: "",
    description: "",
    website: "",
    logoUrl: "",
    hasOwnApplication: false,
};

export default function CompanyFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: CompanyFormModalProps) {
    const [formData, setFormData] = useState<CompanyFormData>(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    taxId: initialData.taxId,
                    locations: initialData.locations && initialData.locations.length > 0
                        ? initialData.locations
                        : [{ country: "Magyarország", zipCode: "", city: "", address: "" }],
                    contactName: initialData.contactName,
                    contactEmail: initialData.contactEmail,
                    description: initialData.description || "",
                    website: initialData.website || "",
                    logoUrl: initialData.logoUrl || "",
                    hasOwnApplication: initialData.hasOwnApplication || false,
                });
            } else {
                setFormData(INITIAL_FORM_STATE);
            }
        }
    }, [isOpen, initialData]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
             const checked = (e.target as HTMLInputElement).checked;
             setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
             setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleLocationChange = (index: number, field: keyof Location, value: string | number) => {
        setFormData((prev) => {
            const newLocations = [...prev.locations];
            newLocations[index] = { ...newLocations[index], [field]: value };
            return { ...prev, locations: newLocations };
        });
    };

    const addLocation = () => {
        setFormData((prev) => ({
            ...prev,
            locations: [...prev.locations, { country: "Magyarország", zipCode: "", city: "", address: "" }]
        }));
    };

    const removeLocation = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!formData.name.trim()) {
            setError("A cég neve kötelező.");
            return;
        }
        if (!formData.taxId.trim()) {
            setError("Az adószám kötelező.");
            return;
        }
        if (formData.locations.length === 0) {
            setError("Legalább egy cím megadása kötelező.");
            return;
        }

        if (formData.hasOwnApplication && !formData.website.trim()) {
            setError("Külső jelentkezési felület használata esetén a Weboldal megadása kötelező.");
            return;
        }
        
        // Validate each location
        for (let i = 0; i < formData.locations.length; i++) {
            const loc = formData.locations[i];
            if (!loc.zipCode || !loc.city || !loc.address) {
                setError(`A(z) ${i + 1}. cím hiányos (irányítószám, város és utca kötelező).`);
                return;
            }
        }

        setLoading(true);
        try {
            // Transform flat form data to API expected structure
            const payload: Omit<Company, 'id'> = {
                name: formData.name,
                taxId: formData.taxId,
                contactName: formData.contactName,
                contactEmail: formData.contactEmail,
                website: formData.website?.trim() || undefined,
                logoUrl: formData.logoUrl?.trim() || undefined,
                description: formData.description?.trim() || undefined,
                locations: formData.locations as Location[],
                hasOwnApplication: formData.hasOwnApplication,
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8">
                <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {initialData ? "Cég szerkesztése" : "Új cég létrehozása"}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* General Info */}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-medium text-slate-700">Cég neve *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Hivatalos cégnév"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Adószám *</label>
                            <input
                                name="taxId"
                                value={formData.taxId}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="xxxxxxxx-x-xx"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Weboldal</label>
                            <input
                                name="website"
                                value={formData.website || ""}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-3 pt-2 border-t border-slate-100">
                             <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="hasOwnApplication"
                                    name="hasOwnApplication"
                                    checked={formData.hasOwnApplication}
                                    onChange={handleFormChange}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="hasOwnApplication" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                                    Saját jelentkezési felület használata
                                </label>
                             </div>
                             
                             {formData.hasOwnApplication && (
                                <div className="space-y-1">
                                    <p className="text-[11px] text-slate-500 bg-blue-50 p-2 rounded border border-blue-100">
                                        Bekapcsolt állapotban a "Jelentkezés" gomb a fent megadott <strong>Weboldal</strong> linkre fog átirányítani. Kérjük győződjön meg róla, hogy a Weboldal mező helyesen van kitöltve!
                                    </p>
                                </div>
                             )}
                        </div>

                        {/* Locations */}
                        <div className="md:col-span-2 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                                <h3 className="text-sm font-semibold text-slate-800">Címek, telephelyek ({formData.locations.length})</h3>
                                <button
                                    type="button"
                                    onClick={addLocation}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Cím hozzáadása
                                </button>
                            </div>
                            
                            {formData.locations.map((loc, index) => (
                                <div key={index} className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative group">
                                    {formData.locations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLocation(index)}
                                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Cím törlése"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Ország</label>
                                            <input
                                                value={loc.country || ""}
                                                onChange={(e) => handleLocationChange(index, 'country', e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-1 space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Irányítószám *</label>
                                            <input
                                                value={loc.zipCode || ""}
                                                onChange={(e) => handleLocationChange(index, 'zipCode', e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-1 space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Város *</label>
                                            <input
                                                value={loc.city || ""}
                                                onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Cím (utca, hsz) *</label>
                                            <input
                                                value={loc.address || ""}
                                                onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact */}
                        <div className="md:col-span-2 border-t border-slate-100 pt-2 mt-2">
                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Kapcsolattartó</h3>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Név *</label>
                            <input
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">E-mail *</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-1 mt-2">
                            <label className="text-xs font-medium text-slate-700">Leírás / Bemutatkozás</label>
                            <textarea
                                name="description"
                                value={formData.description || ""}
                                onChange={handleFormChange}
                                rows={4}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Rövid leírás a cégről..."
                            />
                        </div>
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
                            {loading ? "Mentés..." : initialData ? "Módosítások mentése" : "Cég létrehozása"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
