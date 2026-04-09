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

const statusConfig = {
  ACTIVE: {
    label: "Aktív",
    className:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400",
  },
  TERMINATED: {
    label: "Lezárt",
    className:
      "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400",
  },
  FINISHED: {
    label: "Befejezve",
    className:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
  },
  PENDING_MENTOR: {
    label: "Mentor jóváhagyásra vár",
    className:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
  },
} as const;

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
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 animate-pulse transition-colors"
          />
        ))}
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
      <div className="space-y-2">
        {partnerships.map((partnership) => {
          const status =
            statusConfig[partnership.status as keyof typeof statusConfig];
          const isTerminating = terminatingId === partnership.id;
          const isCompleting = completingId === partnership.id;
          const canAct =
            partnership.status !== "TERMINATED" &&
            partnership.status !== "FINISHED";

          return (
            <div
              key={String(partnership.id)}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {/* Student info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 transition-colors truncate">
                    {partnership.student?.fullName || "Ismeretlen hallgató"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors truncate">
                    {partnership.student?.email}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                  {partnership.position?.title && (
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {partnership.position.title}
                    </span>
                  )}
                  {partnership.semester && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {partnership.semester}
                    </span>
                  )}
                  <span>
                    Mentor:{" "}
                    {partnership.mentor?.fullName ?? (
                      <span className="italic text-amber-600 dark:text-amber-400">
                        Nincs kijelölve
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${status?.className ?? "bg-slate-100 text-slate-600"}`}
                >
                  {status?.label ?? partnership.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenAssign(partnership)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  {partnership.mentor ? "Mentor módosítás" : "+ Mentor"}
                </button>
                {partnership.status === "ACTIVE" && (
                  <button
                    onClick={() => handleComplete(partnership.id)}
                    disabled={isCompleting}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                  >
                    Befejezés
                  </button>
                )}
                {canAct && (
                  <button
                    onClick={() => handleTerminate(partnership.id)}
                    disabled={isTerminating}
                    className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    Lezárás
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
