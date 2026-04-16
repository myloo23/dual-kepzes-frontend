import { useEffect, useState } from "react";
import { api, type Position, type CompanyAdminProfile } from "../../../lib/api";
import PositionFormModal from "./modals/PositionFormModal";

interface CompanyPositionListProps {
  companyAdmin: CompanyAdminProfile | null;
}

export default function CompanyPositionList({
  companyAdmin,
}: CompanyPositionListProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  const loadPositions = async () => {
    setLoading(true);
    setError(null);
    try {
      let admin = companyAdmin;
      if (!admin) {
        admin = await api.companyAdmins.me.get();
      }

      if (admin?.companyEmployee?.company?.id) {
        const list = await api.positions.listByCompany(
          admin.companyEmployee.company.id,
        );
        setPositions(Array.isArray(list) ? list : []);
      } else {
        setError("Nem sikerült azonosítani a céget.");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Hiba az álláshirdetések betöltésekor.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
  }, [companyAdmin]);

  const handleCreate = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Omit<Position, "id">) => {
    try {
      if (editingPosition) {
        await api.positions.update(editingPosition.id, data);
      } else {
        await api.positions.create(data);
      }
      await loadPositions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save position", err);
      throw err; // FormModal catches this to show error
    }
  };

  // Extract company for the modal
  const currentCompany = companyAdmin?.companyEmployee?.company;
  const companiesForModal = currentCompany ? [currentCompany] : [];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
            Álláshirdetések
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Saját céghez tartozó pozíciók.
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={!currentCompany}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          + Új pozíció
        </button>
      </div>

      {loading && (
        <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Betöltés...
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
          {error}
        </div>
      )}
      {!loading && !error && positions.length === 0 && (
        <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Nincs megjeleníthető pozíció.
        </div>
      )}
      <div className="grid gap-3">
        {positions.map((position) => (
          <div
            key={String(position.id)}
            className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">
                {position.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                  {position.location?.city ?? "Ismeretlen város"}
                </span>
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
                    position.type === "DUAL"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50"
                      : position.type === "PROFESSIONAL_PRACTICE"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                  ].join(" ")}
                >
                  {position.type === "DUAL"
                    ? "Duális"
                    : position.type === "PROFESSIONAL_PRACTICE"
                      ? "Szakmai gyakorlat"
                      : "Rendes állás"}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleEdit(position)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Szerkesztés
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <PositionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          companies={companiesForModal}
          initialData={editingPosition}
        />
      )}
    </div>
  );
}
