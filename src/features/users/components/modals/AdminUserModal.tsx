import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AdminUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Record<string, any>) => Promise<void>;
    initialData: any;
    type: "COMPANY_ADMIN" | "UNIVERSITY_USER" | "USER" | null;
}

export default function AdminUserModal({ isOpen, onClose, onSave, initialData, type }: AdminUserModalProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({ ...initialData }); // Clone to avoid mutation
        } else {
            setFormData({});
        }
        setError(null);
    }, [isOpen, initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || "Hiba a mentés során.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const titleMap: Record<string, string> = {
        COMPANY_ADMIN: "Cégadmin szerkesztése",
        UNIVERSITY_USER: "Egyetemi felhasználó szerkesztése",
        USER: "Felhasználó szerkesztése",
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {type ? titleMap[type] : "Szerkesztés"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Common Fields */}
                        {/* Note: In real app, might need to handle nested 'user' object if data structure differs */}
                        {/* For now assuming flat structure or matching what API returns */}

                        {/* Name - try multiple fields */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Név
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName || formData.name || formData.user?.fullName || ""}
                                onChange={(e) => {
                                    // Update generic fields, logic might need adjustment based on specific API payload
                                    handleChange("fullName", e.target.value);
                                    handleChange("name", e.target.value);
                                }}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email - usually read only for reference or editable */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email || formData.user?.email || ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Inactive User Specifics */}
                        {type === "USER" && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700">Státusz:</span>
                                <span className={`text-sm font-semibold ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                    {formData.isActive ? "Aktív" : "Inaktív"}
                                </span>
                            </div>
                        )}

                        {/* Additional fields can be added here based on type */}
                        {/* If we had specific fields for CompanyAdmin like jobTitle, etc. */}

                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Mégse
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Mentés..." : "Mentés"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
