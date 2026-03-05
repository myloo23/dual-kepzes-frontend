import { useState } from "react";
import type {
  Partnership,
  Id,
  EmployeeProfile,
} from "../../../types/api.types";
import { api } from "../../../lib/api";
import AssignMentorModal from "./modals/AssignMentorModal";

interface PartnershipsListProps {
  partnerships: Partnership[];
  mentors: EmployeeProfile[];
  onRefresh: () => void;
  isLoading: boolean;
}

export default function PartnershipsList({
  partnerships,
  mentors,
  onRefresh,
  isLoading,
}: PartnershipsListProps) {
  const [selectedPartnership, setSelectedPartnership] =
    useState<Partnership | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [terminatingId, setTerminatingId] = useState<Id | null>(null);
  const [completingId, setCompletingId] = useState<Id | null>(null);

  const handleOpenAssign = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssign = () => {
    setIsAssignModalOpen(false);
    setSelectedPartnership(null);
  };

  const handleTerminate = async (partnershipId: Id) => {
    if (
      !window.confirm(
        "Biztosan le szeretné zárni ezt a partnerséget? Ez megszakítást jelent (TERMINATED állapot).",
      )
    )
      return;
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

  const handleComplete = async (partnershipId: Id) => {
    if (
      !window.confirm(
        "Biztosan be szeretné fejezni ezt a partnerséget? Ez sikeres teljesítést jelent (FINISHED állapot).",
      )
    )
      return;
    try {
      setCompletingId(partnershipId);
      await api.partnerships.complete(partnershipId);
      onRefresh();
    } catch (error) {
      console.error("Failed to complete partnership:", error);
      alert("Hiba történt a partnerség befejezésekor.");
    } finally {
      setCompletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
        Betöltés...
      </div>
    );
  }

  if (partnerships.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-slate-100 transition-colors">
          Nincsenek partnerek
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">
          Jelenleg nincs aktív vagy függőben lévő partnerség.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Hallgató
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Pozíció
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Időszak
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Mentor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Egyetemi Felelős
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Státusz
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Műveletek</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {partnerships.map((partnership) => (
                <tr
                  key={String(partnership.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-3 align-middle">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm transition-colors">
                        {partnership.student?.fullName || "Ismeretlen hallgató"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                        {partnership.student?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                        {partnership.position?.title || "-"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                        {partnership.contractNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit font-medium transition-colors">
                        {partnership.semester || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap transition-colors">
                        {partnership.startDate
                          ? new Date(partnership.startDate).toLocaleDateString()
                          : "?"}{" "}
                        -
                        {partnership.endDate
                          ? new Date(partnership.endDate).toLocaleDateString()
                          : "?"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      {partnership.mentor ? (
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                          {partnership.mentor.fullName}
                        </div>
                      ) : (
                        <span className="text-sm italic text-amber-600 dark:text-amber-400 transition-colors">
                          Nincs kijelölve
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenAssign(partnership)}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline shrink-0 transition-colors"
                      >
                        {partnership.mentor ? "Módosítás" : "+ Hozzárendelés"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    {partnership.uniEmployee ? (
                      <div className="text-sm text-slate-700 dark:text-slate-300 transition-colors">
                        {partnership.uniEmployee.fullName}
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400 dark:text-slate-500 transition-colors">
                        Nincs kijelölve
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        partnership.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                          : partnership.status === "TERMINATED"
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"
                            : partnership.status === "FINISHED"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"
                      } transition-colors`}
                    >
                      {partnership.status === "ACTIVE" && "Aktív"}
                      {partnership.status === "TERMINATED" && "Lezárt"}
                      {partnership.status === "FINISHED" && "Befejezve"}
                      {partnership.status === "PENDING_MENTOR" &&
                        "Mentor jóváhagyásra vár"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right align-middle">
                    <div className="flex justify-end gap-2">
                      {partnership.status === "ACTIVE" && (
                        <>
                          <button
                            onClick={() => handleComplete(partnership.id)}
                            disabled={completingId === partnership.id}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            title="Partnerség sikeres befejezése"
                          >
                            Befejezés
                          </button>
                          <span className="text-slate-300">|</span>
                        </>
                      )}
                      {partnership.status !== "TERMINATED" &&
                        partnership.status !== "FINISHED" && (
                          <button
                            onClick={() => handleTerminate(partnership.id)}
                            disabled={terminatingId === partnership.id}
                            className="text-sm font-medium text-slate-400 hover:text-red-600 transition-colors"
                            title="Partnerség megszakítása"
                          >
                            Lezárás
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AssignMentorModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssign}
        partnership={selectedPartnership}
        mentors={mentors}
        onAssignSuccess={onRefresh}
      />
    </>
  );
}
