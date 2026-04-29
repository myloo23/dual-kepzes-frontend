import { useState } from "react";
import type {
  Partnership,
  Id,
  UniversityUserProfile,
} from "../../../types/api.types";
import { api } from "../../../lib/api";
import AssignUniversityUserModal from "./modals/AssignUniversityUserModal";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../components/shared/ToastContainer";

interface AdminPartnershipsListProps {
  partnerships: Partnership[];
  universityUsers: UniversityUserProfile[];
  onRefresh: () => void;
  isLoading: boolean;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string) => void;
}

export default function AdminPartnershipsList({
  partnerships,
  universityUsers,
  onRefresh,
  isLoading,
  sortConfig,
  onSort,
}: AdminPartnershipsListProps) {
  const { toasts, showError, removeToast } = useToast();
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
      showError("Hiba történt a partnerség lezárásakor.");
    } finally {
      setTerminatingId(null);
    }
  };

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <ArrowUpDown className="ml-1 h-3 w-3 text-slate-400 dark:text-slate-500 transition-colors" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 text-blue-600 dark:text-blue-400 transition-colors" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-blue-600 dark:text-blue-400 transition-colors" />
    );
  };

  const renderHeader = (label: string, sortKey: string) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(sortKey)}
      </div>
    </th>
  );

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Betöltés...</div>;
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
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm dark:shadow-none transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800/50 transition-colors">
            <thead className="bg-slate-50 dark:bg-slate-800/80 transition-colors">
              <tr>
                {renderHeader("Hallgató", "student")}
                {renderHeader("Cég / Pozíció", "company")}
                {renderHeader("Időszak", "semester")}
                {renderHeader("Mentor", "mentor")}
                {renderHeader("Egyetemi Felelős", "uniEmployee")}
                {renderHeader("Státusz", "status")}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Műveletek</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 bg-white dark:bg-transparent transition-colors">
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
                        {partnership.position?.company?.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 transition-colors">
                        {partnership.position?.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit font-medium transition-colors">
                        {partnership.semester || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap transition-colors">
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
                      <div className="text-sm text-slate-700 dark:text-slate-300 transition-colors">
                        {partnership.mentor.fullName}
                      </div>
                    ) : (
                      <span className="text-xs italic text-amber-600 dark:text-amber-500 transition-colors">
                        Nincs kijelölve
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      {partnership.uniEmployee ? (
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                          {partnership.uniEmployee.fullName}
                        </span>
                      ) : (
                        <span className="text-sm italic text-slate-400 dark:text-slate-500 transition-colors">
                          Nincs kijelölve
                        </span>
                      )}

                      {partnership.status === "PENDING_UNIVERSITY" ? (
                        <button
                          onClick={() => handleOpenAssign(partnership)}
                          title="Egyetemi referens ellenőrzése vagy módosítása"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline shrink-0 transition-colors"
                        >
                          {partnership.uniEmployee
                            ? "Ellenőrzés / módosítás"
                            : "+ Hozzárendelés"}
                        </button>
                      ) : partnership.status === "PENDING_MENTOR" ? (
                        <span
                          title="A cégnek először mentort kell hozzárendelnie ehhez a partnerséghez."
                          className="text-xs italic text-amber-600 dark:text-amber-500 cursor-help"
                        >
                          Mentor szükséges
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                        partnership.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                          : partnership.status === "PENDING_UNIVERSITY"
                            ? "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-400"
                          : partnership.status === "TERMINATED"
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"
                      }`}
                    >
                      {partnership.status === "ACTIVE" && "Aktív"}
                      {partnership.status === "PENDING_UNIVERSITY" &&
                        "Egyetemi felelosre var"}
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
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
