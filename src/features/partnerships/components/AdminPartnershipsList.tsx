import { useState } from "react";
import type {
  Partnership,
  Id,
  UniversityUserProfile,
} from "../../../types/api.types";
import { api } from "../../../lib/api";
import AssignUniversityUserModal from "./modals/AssignUniversityUserModal";

interface AdminPartnershipsListProps {
  partnerships: Partnership[];
  universityUsers: UniversityUserProfile[];
  onRefresh: () => void;
  isLoading: boolean;
}

export default function AdminPartnershipsList({
  partnerships,
  universityUsers,
  onRefresh,
  isLoading,
}: AdminPartnershipsListProps) {
  const [selectedPartnership, setSelectedPartnership] =
    useState<Partnership | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [terminatingId, setTerminatingId] = useState<Id | null>(null);

  const handleOpenAssign = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssign = () => {
    setIsAssignModalOpen(false);
    setSelectedPartnership(null);
  };

  const handleTerminate = async (partnershipId: Id) => {
    if (!window.confirm("Biztosan le szeretné zárni ezt a partnerséget?"))
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

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Betöltés...</div>;
  }

  if (partnerships.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Nincsenek partnerek
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Jelenleg nincs aktív vagy függőben lévő partnerség.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Hallgató
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Cég / Pozíció
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Időszak
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Mentor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Egyetemi Felelős
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Státusz
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Műveletek</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {partnerships.map((partnership) => (
                <tr
                  key={String(partnership.id)}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-3 align-middle">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-sm">
                        {partnership.student?.fullName || "Ismeretlen hallgató"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {partnership.student?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {partnership.position?.company?.name}
                      </div>
                      <div className="text-xs text-slate-600">
                        {partnership.position?.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 w-fit font-medium">
                        {partnership.semester || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">
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
                    {partnership.mentor ? (
                      <div className="text-sm text-slate-700">
                        {partnership.mentor.fullName}
                      </div>
                    ) : (
                      <span className="text-xs italic text-amber-600">
                        Nincs kijelölve
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      {partnership.uniEmployee ? (
                        <span className="text-sm font-medium text-slate-900">
                          {partnership.uniEmployee.fullName}
                        </span>
                      ) : (
                        <span className="text-sm italic text-slate-400">
                          Nincs kijelölve
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenAssign(partnership)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline shrink-0"
                      >
                        {partnership.uniEmployee
                          ? "Szerkesztés"
                          : "+ Hozzárendelés"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        partnership.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : partnership.status === "TERMINATED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {partnership.status === "ACTIVE" && "Aktív"}
                      {partnership.status === "TERMINATED" && "Lezárt"}
                      {partnership.status === "PENDING_MENTOR" &&
                        "Mentor jóváhagyásra vár"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right align-middle">
                    {partnership.status !== "TERMINATED" && (
                      <button
                        onClick={() => handleTerminate(partnership.id)}
                        disabled={terminatingId === partnership.id}
                        className="text-sm font-medium text-slate-400 hover:text-red-600 transition-colors"
                        title="Partnerség lezárása"
                      >
                        Lezárás
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AssignUniversityUserModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssign}
        partnership={selectedPartnership}
        universityUsers={universityUsers}
        onAssignSuccess={onRefresh}
      />
    </>
  );
}
