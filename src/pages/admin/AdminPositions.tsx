/**
 * Admin Positions Page - Refactored
 * Manages position CRUD operations
 */

import { useState, useEffect, useMemo } from "react";
import { Briefcase, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { api } from "../../lib/api";
import { companyApi } from "../../features/companies/services/companyApi";
import type { Position, Company } from "../../lib/api";
import { useCRUD, useModal } from "../../hooks";
import PositionFormModal from "../../features/positions/components/modals/PositionFormModal";
import Button from "../../components/ui/Button";
import { PAGE_TITLES, LABELS, CONFIRM_MESSAGES } from "../../constants";
import { usePositionExport } from "../../features/positions/hooks/usePositionExport";
import ExportButton from "../../components/shared/ExportButton";

export default function AdminPositionsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { handleExport } = usePositionExport();

  const positions = useCRUD<Position>({
    listFn: () => api.positions.list({ limit: 1000 }),
    getFn: api.positions.get,
    createFn: api.positions.create,
    updateFn: api.positions.update,
    deleteFn: api.positions.remove,
  });

  const modal = useModal<Position>();
  const [lookupId, setLookupId] = useState("");

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Load positions on mount
  useEffect(() => {
    positions.load();
  }, []);

  // Load companies for the dropdown
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await companyApi.list();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to load companies:", err);
      }
    };
    loadCompanies();
  }, []);

  const handleCreateNew = () => {
    positions.clearMessages();
    modal.open();
  };

  const handleEdit = async (id: string | number) => {
    positions.clearMessages();

    // Try to find in local list first to avoid API call and potential missing relations
    const localPosition = positions.items.find(
      (p) => String(p.id) === String(id),
    );
    if (localPosition && localPosition.location) {
      modal.open(localPosition);
      return;
    }

    const position = await positions.get(id);
    if (position) {
      modal.open(position);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm(CONFIRM_MESSAGES.DELETE_POSITION)) return;

    const success = await positions.remove(id);
    if (success) {
      modal.close();
    }
  };

  const handleDeactivate = async (id: string | number) => {
    if (!confirm(CONFIRM_MESSAGES.DEACTIVATE_POSITION)) return;

    positions.clearMessages();
    try {
      await api.positions.deactivate(id);
      positions.setMessage("Pozíció deaktiválva.");
      await positions.load();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Deaktiválás sikertelen.";
      positions.setError(errorMsg);
    }
  };

  const handleSave = async (data: Omit<Position, "id">) => {
    let success = false;

    if (modal.data) {
      // Update existing
      const updated = await positions.update(modal.data.id, data);
      success = updated !== null;
    } else {
      // Create new
      const created = await positions.create(data);
      success = created !== null;
    }

    if (success) {
      modal.close();
    }
  };

  const handleLookup = async () => {
    if (!lookupId.trim()) return;

    const position = await positions.get(lookupId.trim());
    if (position) {
      modal.open(position);
    }
  };

  const getStatusBadge = (position: Position) => {
    if (!position.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 transition-colors">
          Inaktív
        </span>
      );
    }

    const deadline = position.deadline ? new Date(position.deadline) : null;
    const isExpired = deadline && deadline < new Date();

    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 transition-colors">
          Lejárt
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-emerald-900/30 text-green-800 dark:text-emerald-400 transition-colors">
        Aktív
      </span>
    );
  };

  // Sorting Logic
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortValue = (item: Position, key: string) => {
    if (key === "city") {
      return item.location?.city ?? "";
    }
    if (key === "status") {
      // Status sorting is tricky because it's derived.
      // We can sort by isActive, then deadline.
      // For simplicity, let's sort by isActive boolean for now, or just not support it fully if complexity is high.
      // User asked for "upper parts e.g. name or id", so simple fields are priority.
      return item.isActive ? "1" : "0";
    }
    // @ts-ignore
    return item[key] ?? "";
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...positions.items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [positions.items, sortConfig]);

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
      className="px-4 py-3 text-left font-semibold bg-slate-50 dark:bg-slate-900/80 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group text-slate-700 dark:text-slate-300"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(sortKey)}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          {PAGE_TITLES.ADMIN_POSITIONS}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Összes pozíció kezelése.
        </p>
      </div>

      {/* Feedback Messages */}
      {positions.error && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
          {positions.error}
        </div>
      )}
      {positions.message && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-400 transition-colors">
          {positions.message}
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none transition-colors">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 transition-colors">
              Összes pozíció
            </h2>
            <Button onClick={handleCreateNew} variant="primary" size="xs">
              + Új pozíció
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={positions.load} variant="outline" size="xs">
              {LABELS.REFRESH}
            </Button>
            <ExportButton
              onExport={() => handleExport(positions.items)}
              disabled={positions.items.length === 0}
              icon="excel"
              label="Excel export"
            />
          </div>
        </div>

        {/* Lookup */}
        <div className="flex gap-2 mb-4">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Pozíció keresése ID alapján..."
            className="w-full max-w-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <Button type="button" onClick={handleLookup} variant="dark" size="sm">
            {LABELS.SEARCH}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 sticky top-0 z-10 shadow-sm transition-colors">
              <tr>
                {renderHeader("ID", "id")}
                {renderHeader("Cím", "title")}
                {renderHeader("Város", "city")}
                {renderHeader("Státusz", "status")}
                <th className="px-4 py-3 text-right font-semibold bg-slate-50 dark:bg-slate-900/80 transition-colors">
                  Művelet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 transition-colors">
              {sortedItems.map((position) => (
                <tr
                  key={String(position.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs transition-colors">
                    {String(position.id).slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                    {position.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 transition-colors">
                    {position.location?.city || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 items-center">
                      {getStatusBadge(position)}
                      <span
                        className={[
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors",
                          position.type === "DUAL"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50"
                            : position.type === "PROFESSIONAL_PRACTICE"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                        ].join(" ")}
                      >
                        <Briefcase size={10} />
                        {position.type === "DUAL"
                          ? "Duális"
                          : position.type === "PROFESSIONAL_PRACTICE"
                            ? "Szakmai gyak."
                            : "Rendes állás"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleEdit(position.id)}
                        variant="outlineAccent"
                        size="xs"
                      >
                        {LABELS.EDIT}
                      </Button>
                      {position.isActive && (
                        <Button
                          onClick={() => handleDeactivate(position.id)}
                          variant="caution"
                          size="xs"
                        >
                          {LABELS.DEACTIVATE}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(position.id)}
                        variant="danger"
                        size="xs"
                      >
                        {LABELS.DELETE}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!positions.loading && positions.items.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-12 text-center text-slate-500 dark:text-slate-400 transition-colors"
                    colSpan={5}
                  >
                    {LABELS.NO_DATA}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PositionFormModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSave={handleSave}
        companies={companies}
        initialData={modal.data}
      />
    </div>
  );
}
