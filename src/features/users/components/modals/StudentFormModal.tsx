import { useEffect, useState } from "react";
import { type StudentProfile } from "../../../../lib/api";

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Record<string, any>) => Promise<void>;
    initialData?: StudentProfile | null;
}

const INITIAL_FORM_STATE = {
    // Personal
    fullName: "",
    email: "",
    phoneNumber: "",
    mothersName: "",
    dateOfBirth: "",

    // Address
    country: "",
    zipCode: "",
    city: "",
    streetAddress: "",

    // Education
    highSchool: "",
    graduationYear: "",
    neptunCode: "",
    currentMajor: "",
    studyMode: "NAPPALI",
    hasLanguageCert: false,
};

export default function StudentFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: StudentFormModalProps) {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (initialData) {
                // Flatten the structure if needed, or mapping directly if the API returns a flat object
                // Based on the loose type Record<string, any>, we try to extract known fields.
                // If data is inside a 'profile' sub-object, we might need to check that too, 
                // but AdminUsers.tsx was just dumping the object. I'll assume flat or top-level mainly.
                // If the backend returns 'profile' nested, we might need to adjust. 
                // However, StudentRegisterPayload suggests a flat structure for registration.
                // Let's assume broad compatibility.

                const d = initialData as any;
                // Check if there is a nested profile object (common in some architectures)
                // Also check for studentProfile as seen in some backend responses
                const p = d.profile || d.studentProfile || {};
                const source = { ...d, ...p };

                // Handle location data which is nested in studentProfile.location or just location
                const loc = (p as any).location || d.location || {};

                setFormData({
                    fullName: source.fullName || "",
                    email: source.email || "",
                    phoneNumber: source.phoneNumber || "",
                    mothersName: source.mothersName || "",
                    dateOfBirth: source.dateOfBirth ? String(source.dateOfBirth).split('T')[0] : "", // Handle potential ISO string
                    country: loc.country || source.country || "",
                    zipCode: loc.zipCode || source.zipCode || "",
                    city: loc.city || source.city || "",
                    streetAddress: loc.address || source.streetAddress || "", // Note: API uses 'address', form uses 'streetAddress'
                    highSchool: source.highSchool || "",
                    graduationYear: source.graduationYear || "",
                    neptunCode: source.neptunCode || "",
                    currentMajor: source.currentMajor || "",
                    studyMode: source.studyMode || "NAPPALI",
                    hasLanguageCert: !!source.hasLanguageCert
                });
            } else {
                setFormData(INITIAL_FORM_STATE);
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                ...formData,
                // Convert numeric types
                zipCode: formData.zipCode ? Number(formData.zipCode) : undefined,
                graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
                // sanitize empty strings to undefined if needed, or keep as is.
                // For updates, typically we send what changed or everything.
            };
            await onSave(payload);
            onClose();
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Mentés sikertelen';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl my-8">
                <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {initialData ? "Hallgató adatainak szerkesztése" : "Új hallgató"}
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Szekciók */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Személyes adatok */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Személyes adatok</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Teljes név</label>
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                                    <input name="email" value={formData.email} onChange={handleChange} disabled className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed" title="Email nem módosítható innen" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Telefonszám</label>
                                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Anyja neve</label>
                                    <input name="mothersName" value={formData.mothersName} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Születési dátum</label>
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Lakcím */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Lakcím</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Ország</label>
                                    <input name="country" value={formData.country} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Irsz.</label>
                                        <input name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Város</label>
                                        <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Cím (utca, hsz.)</label>
                                    <input name="streetAddress" value={formData.streetAddress} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Tanulmányok */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Tanulmányok</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Középiskola</label>
                                    <input name="highSchool" value={formData.highSchool} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Érettségi éve</label>
                                    <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Neptun kód</label>
                                    <input name="neptunCode" value={formData.neptunCode} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Jelenlegi szak</label>
                                    <input name="currentMajor" value={formData.currentMajor} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Munkarend</label>
                                    <select name="studyMode" value={formData.studyMode} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                        <option value="NAPPALI">Nappali</option>
                                        <option value="LEVELEZŐ">Levelező</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="hasLanguageCert" checked={formData.hasLanguageCert} onChange={handleChange} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm text-slate-700">Van nyelvvizsgája</span>
                                    </label>
                                </div>
                            </div>
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
                            {loading ? "Mentés..." : "Módosítások mentése"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
