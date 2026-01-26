import { useState } from "react";
import type { Partnership, Id, EmployeeProfile } from "../../../types/api.types";
import { api } from "../../../lib/api";

interface PartnershipsListProps {
    partnerships: Partnership[];
    mentors: EmployeeProfile[];
    onRefresh: () => void;
    isLoading: boolean;
}

export default function PartnershipsList({ partnerships, mentors, onRefresh, isLoading }: PartnershipsListProps) {
    const [assigningMentorId, setAssigningMentorId] = useState<Id | null>(null);
    const [mentorIdInput, setMentorIdInput] = useState("");
    const [terminatingId, setTerminatingId] = useState<Id | null>(null);

    const handleAssignMentor = async (partnershipId: Id) => {
        if (!mentorIdInput.trim()) return;
        try {
            await api.partnerships.assignMentor(partnershipId, mentorIdInput);
            setAssigningMentorId(null);
            setMentorIdInput("");
            onRefresh();
        } catch (error) {
            console.error("Failed to assign mentor:", error);
            alert("Hiba történt a mentor hozzárendelésekor.");
        }
    };

    const handleTerminate = async (partnershipId: Id) => {
        if (!window.confirm("Biztosan le szeretné zárni ezt a partnerséget?")) return;
        try {
            setTerminatingId(partnershipId);
            await api.partnerships.terminate(partnershipId);
            onRefresh();
        } catch (error) {
            console.error("Failed to terminate partnership:", error);
            alert("Hiba történt a partnerség lezárásakor.");
        } finally {
            setTerminatingId(null);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Betöltés...</div>;
    }

    if (partnerships.length === 0) {
        return (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Nincsenek partnerek</h3>
                <p className="mt-1 text-sm text-gray-500">Jelenleg nincs aktív vagy függőben lévő partnerség.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Hallgató
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Pozíció
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Mentor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Egyetemi Felelős
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Státusz
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Dátumok
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Műveletek</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {partnerships.map((partnership) => (
                            <tr key={String(partnership.id)}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="font-medium text-slate-900">
                                                {partnership.student?.fullName || "Ismeretlen hallgató"}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {partnership.student?.email}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {partnership.contractNumber}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                    <div className="font-medium">{partnership.position?.title || "-"}</div>
                                    <div className="text-xs text-slate-500">{partnership.position?.company?.name}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                    {/* Temporary simple mentor assignment UI for MVP */}
                                    {partnership.mentor ? (
                                        <div>
                                            <div className="font-medium">{partnership.mentor.fullName}</div>
                                            <div className="text-xs text-slate-500">{partnership.mentor.email}</div>
                                        </div>
                                    ) : (
                                        <div className="text-amber-600 italic text-xs">Nincs mentor</div>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                    {partnership.uniEmployee ? (
                                        <div>
                                            <div className="font-medium">{partnership.uniEmployee.fullName}</div>
                                            <div className="text-xs text-slate-500">{partnership.uniEmployee.email}</div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 italic text-xs">-</div>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${partnership.status === "ACTIVE"
                                            ? "bg-green-100 text-green-800"
                                            : partnership.status === "TERMINATED"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {partnership.status === "ACTIVE" && "Aktív"}
                                        {partnership.status === "TERMINATED" && "Lezárt"}
                                        {partnership.status === "PENDING_MENTOR" && "Mentor jóváhagyásra vár"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                    {partnership.startDate && <div>Kezdet: {new Date(partnership.startDate).toLocaleDateString()}</div>}
                                    {partnership.endDate && <div>Vége: {new Date(partnership.endDate).toLocaleDateString()}</div>}
                                    {partnership.semester && <div className="text-xs text-slate-400 mt-1">{partnership.semester}</div>}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {partnership.status !== "TERMINATED" && (
                                            <>
                                                {assigningMentorId === partnership.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            className="w-48 text-xs border rounded p-1"
                                                            value={mentorIdInput}
                                                            onChange={(e) => setMentorIdInput(e.target.value)}
                                                        >
                                                            <option value="">Válasszon mentort...</option>
                                                            {mentors.map((m) => (
                                                                <option key={String(m.id)} value={String(m.id)}>
                                                                    {m.fullName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAssignMentor(partnership.id)}
                                                            className="text-green-600 hover:text-green-900 text-xs"
                                                            disabled={!mentorIdInput}
                                                        >
                                                            Mentés
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAssigningMentorId(null);
                                                                setMentorIdInput("");
                                                            }}
                                                            className="text-slate-600 hover:text-slate-900 text-xs"
                                                        >
                                                            Mégse
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAssigningMentorId(partnership.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Mentor kezelése
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleTerminate(partnership.id)}
                                                    disabled={terminatingId === partnership.id}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                >
                                                    Lezárás
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
