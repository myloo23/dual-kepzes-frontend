import { useState, useEffect } from "react";
import type {
  Partnership,
  UniversityUserProfile,
  Id,
} from "../../../../types/api.types";
import { api } from "../../../../lib/api";
import { Modal } from "../../../../components/ui/Modal";

interface AssignUniversityUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnership: Partnership | null;
  universityUsers: UniversityUserProfile[];
  onAssignSuccess: () => void;
}

export default function AssignUniversityUserModal({
  isOpen,
  onClose,
  partnership,
  universityUsers,
  onAssignSuccess,
}: AssignUniversityUserModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<Id>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignedUniEmployeeId = partnership?.uniEmployee?.id
    ? String(partnership.uniEmployee.id)
    : "";

  const normalizedUniversityUsers = partnership?.uniEmployee
    ? [
        partnership.uniEmployee,
        ...universityUsers.filter(
          (user) => String(user.id) !== String(partnership.uniEmployee?.id),
        ),
      ]
    : universityUsers;

  const getUserLabel = (user: UniversityUserProfile) =>
    user.fullName || user.user?.fullName || user.email || user.user?.email || "-";

  // Reset state when modal opens or partnership changes
  useEffect(() => {
    if (isOpen && partnership) {
      setSelectedUserId(
        partnership.uniEmployee?.id ? String(partnership.uniEmployee.id) : "",
      );
      setError(null);
    }
  }, [isOpen, partnership]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnership || !selectedUserId) return;

    if (partnership.status !== "PENDING_UNIVERSITY") {
      setError(
        "A hozzárendelés csak PENDING_UNIVERSITY státuszban engedélyezett. Előbb mentor hozzárendelés szükséges.",
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.partnerships.assignUniversityUser(
        partnership.id,
        selectedUserId,
      );
      onAssignSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to assign university user:", err);
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Hiba történt a hozzárendelés során.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!partnership) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Egyetemi referens ellenőrzése"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
            {error}
          </div>
        )}

        {partnership.status !== "PENDING_UNIVERSITY" && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-400 transition-colors">
            Ez a partnerség még nem rendelhető egyetemi referenshez. Előbb a
            céges mentort kell kijelölni.
          </div>
        )}

        {assignedUniEmployeeId && (
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-300 transition-colors">
            A referens mező automatikusan ki lett töltve a szak és cég alapján.
            Ellenőrizze, és csak szükség esetén módosítsa.
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
            <span className="text-slate-500 dark:text-slate-400">Cég:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {partnership.position?.company?.name || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Pozíció:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {partnership.position?.title || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Mentor:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {partnership.mentor?.fullName || "-"}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="uniUser"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors"
          >
            Egyetemi referens
          </label>
          <select
            id="uniUser"
            value={selectedUserId as string}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            required
          >
            <option value="">-- Válasszon listából --</option>
            {normalizedUniversityUsers.map((user) => (
              <option key={String(user.id)} value={String(user.id)}>
                {getUserLabel(user)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 transition-colors">
            A kiválasztott referens látni fogja ezt a partnerséget a saját
            felületén.
          </p>
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
            disabled={
              isLoading ||
              !selectedUserId ||
              partnership.status !== "PENDING_UNIVERSITY"
            }
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mentés..." : "Hozzárendelés mentése"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
