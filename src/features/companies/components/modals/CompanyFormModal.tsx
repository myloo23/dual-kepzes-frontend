import { useEffect, useState } from "react";
import { type Company } from "../../lib/api";

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
    hqCountry: string;
    hqZipCode: string;
    hqCity: string;
    hqAddress: string;
    contactName: string;
    contactEmail: string;
    description: string;
    website: string;
    logoUrl: string;
}

const INITIAL_FORM_STATE: CompanyFormData = {
    name: "",
    taxId: "",
    hqCountry: "",
    hqZipCode: "",
    hqCity: "",
    hqAddress: "",
    contactName: "",
    contactEmail: "",
    description: "",
    website: "",
    logoUrl: ""
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
                const hqLocation = initialData.locations?.[0];
                setFormData({
                    name: initialData.name,
                    taxId: initialData.taxId,
                    hqCountry: hqLocation?.country || "",
                    hqZipCode: String(hqLocation?.zipCode || ""),
                    hqCity: hqLocation?.city || "",
                    hqAddress: hqLocation?.address || "",
                    contactName: initialData.contactName,
                    contactEmail: initialData.contactEmail,
                    description: initialData.description || "",
                    website: initialData.website || "",
                    logoUrl: initialData.logoUrl || ""
                });
            } else {
                setFormData(INITIAL_FORM_STATE);
            }
        }
    }, [isOpen, initialData]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                locations: [{
                    country: formData.hqCountry,
                    zipCode: formData.hqZipCode ? Number(formData.hqZipCode) : 0,
                    city: formData.hqCity,
                    address: formData.hqAddress
                }]
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
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

                        {/* Location */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Ország *</label>
                            <input
                                name="hqCountry"
                                value={formData.hqCountry}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Irányítószám *</label>
                            <input
                                name="hqZipCode"
                                value={formData.hqZipCode}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Város *</label>
                            <input
                                name="hqCity"
                                value={formData.hqCity}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-medium text-slate-700">Cím (utca, házszám) *</label>
                            <input
                                name="hqAddress"
                                value={formData.hqAddress}
                                onChange={handleFormChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
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
