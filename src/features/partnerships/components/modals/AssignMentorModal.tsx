import { useState, useEffect } from "react";
import type { Partnership, EmployeeProfile, Id } from "../../../../types/api.types";
import { api } from "../../../../lib/api";

interface AssignMentorModalProps {
    isOpen: boolean;
    onClose: () => void;
    partnership: Partnership | null;
    mentors: EmployeeProfile[];
    onAssignSuccess: () => void;
}

export default function AssignMentorModal({
    isOpen,
    onClose,
    partnership,
    mentors,
    onAssignSuccess,
}: AssignMentorModalProps) {
    const [selectedMentorId, setSelectedMentorId] = useState<Id>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && partnership) {
            setSelectedMentorId(partnership.mentor?.id ? String(partnership.mentor.id) : "");
            setError(null);
        }
    }, [isOpen, partnership]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partnership || !selectedMentorId) return;

        setIsLoading(true);
        setError(null);

        try {
            await api.partnerships.assignMentor(partnership.id, selectedMentorId);
            onAssignSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to assign mentor:", err);
            setError("Hiba történt a mentor hozzárendelésekor.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !partnership) return null;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto">
                <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Mentor Hozzárendelése
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

                    <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Hallgató:</span>
                            <span className="font-medium text-slate-900">{partnership.student?.fullName || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Pozíció:</span>
                            <span className="font-medium text-slate-900">{partnership.position?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Szerződés:</span>
                            <span className="font-medium text-slate-900">{partnership.contractNumber || "-"}</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="mentor" className="block text-sm font-medium text-slate-700 mb-2">
                            Válasszon mentort
                        </label>
                        <select
                            id="mentor"
                            value={selectedMentorId as string}
                            onChange={(e) => setSelectedMentorId(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="">-- Válasszon listából --</option>
                            {mentors.map((m) => (
                                <option key={String(m.id)} value={String(m.id)}>
                                    {m.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Mégse
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !selectedMentorId}
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Mentés..." : "Hozzárendelés Mentése"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
