import { useState, useEffect } from "react";
import type {
  Partnership,
  EmployeeProfile,
  Id,
} from "../../../../types/api.types";
import { api } from "../../../../lib/api";
import { Modal } from "../../../../components/ui/Modal";

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
      setSelectedMentorId(
        partnership.mentor?.id ? String(partnership.mentor.id) : "",
      );
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

  if (!partnership) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mentor Hozzárendelése"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-sm transition-colors">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Hallgató:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {partnership.student?.fullName || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Pozíció:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {partnership.position?.title || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Szerződés:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {partnership.contractNumber || "-"}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="mentor"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors"
          >
            Válasszon mentort
          </label>
          <select
            id="mentor"
            value={selectedMentorId as string}
            onChange={(e) => setSelectedMentorId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
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

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
    </Modal>
  );
}
