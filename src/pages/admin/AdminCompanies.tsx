/**
 * Admin Companies Page - Refactored
 * Manages company CRUD operations
 */

import { useState, useEffect, useMemo } from "react";
import { companyApi } from "../../features/companies/services/companyApi";
import type { Company } from "../../lib/api";
import { useCRUD, useModal } from "../../hooks";
import CompanyFormModal from "../../features/companies/components/modals/CompanyFormModal";
import Button from "../../components/ui/Button";
import {
  PAGE_TITLES,
  PAGE_DESCRIPTIONS,
  LABELS,
  CONFIRM_MESSAGES,
} from "../../constants";
import { useCompanyExport } from "../../features/companies/hooks/useCompanyExport";
import ExportButton from "../../components/shared/ExportButton";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminCompaniesPage() {
  const companies = useCRUD<Company>({
    listFn: companyApi.list,
    getFn: companyApi.get,
    createFn: companyApi.create,
    updateFn: companyApi.update,
    deleteFn: companyApi.remove,
  });

  const pendingCompanies = useCRUD<Company>({
    listFn: companyApi.listPending,
  });

  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");

  const modal = useModal<Company>();
  const [lookupId, setLookupId] = useState("");
  const { handleExport } = useCompanyExport();

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Load companies on mount
  useEffect(() => {
    companies.load();
    pendingCompanies.load();
  }, []);

  const handleCreateNew = () => {
    companies.clearMessages();
    modal.open();
  };

  const handleEdit = async (id: string | number) => {
    companies.clearMessages();

    // Always fetch fresh data to ensure we have all fields (including detailed profile and new settings)
    const company = await companies.get(id);
    if (company) {
      modal.open(company);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm(CONFIRM_MESSAGES.DELETE_COMPANY)) return;

    const success = await companies.remove(id);
    if (success) {
      modal.close();
    }
  };

  const handleSave = async (data: Omit<Company, "id">) => {
    let success = false;

    if (modal.data) {
      // Update existing
      const updated = await companies.update(modal.data.id, data);
      success = updated !== null;
    } else {
      // Create new
      const created = await companies.create(data);
      success = created !== null;
    }

    if (success) {
      modal.close();
    }
  };

  const handleLookup = async () => {
    if (!lookupId.trim()) return;

    const company = await companies.get(lookupId.trim());
    if (company) {
      modal.open(company);
    }
  };

  const handleApprove = async (id: string | number) => {
    if (!confirm("Biztosan jóváhagyod a cég regisztrációját?")) return;
    try {
      await companyApi.approve(id.toString());
      pendingCompanies.setMessage("Cég regisztrációja sikeresen jóváhagyva.");
      await Promise.all([companies.load(), pendingCompanies.load()]);
    } catch (err: unknown) {
      pendingCompanies.setError(
        err instanceof Error ? err.message : "Hiba történt a jóváhagyás során."
      );
    }
  };

  const handleReject = async (id: string | number) => {
    if (!confirm("Biztosan elutasítod a cég regisztrációját?")) return;
    try {
      await companyApi.reject(id.toString());
      pendingCompanies.setMessage("Cég regisztrációja sikeresen elutasítva.");
      await pendingCompanies.load();
    } catch (err: unknown) {
      pendingCompanies.setError(
        err instanceof Error ? err.message : "Hiba történt az elutasítás során."
      );
    }
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

  const currentItems = activeTab === "active" ? companies.items : pendingCompanies.items;

  const sortedItems = useMemo(() => {
    const sortableItems = [...currentItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // @ts-expect-error - dynamic sorting
        const aValue = a[sortConfig.key] ?? "";
        // @ts-expect-error - dynamic sorting
        const bValue = b[sortConfig.key] ?? "";

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
  }, [currentItems, sortConfig]);

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
          {PAGE_TITLES.ADMIN_COMPANIES}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          {PAGE_DESCRIPTIONS.ADMIN_COMPANIES}
        </p>
      </div>

      {/* Feedback Messages */}
      {(companies.error || pendingCompanies.error) && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
          {companies.error || pendingCompanies.error}
        </div>
      )}
      {(companies.message || pendingCompanies.message) && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-400 transition-colors">
          {companies.message || pendingCompanies.message}
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none transition-colors">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "active"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Aktív cégek
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === "pending"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Jóváhagyásra váró
            {pendingCompanies.items.length > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-amber-500 rounded-full">
                {pendingCompanies.items.length}
              </span>
            )}
            {activeTab === "pending" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 transition-colors">
              {activeTab === "active" ? "Összes cég" : "Jóváhagyásra váró cégek"}
            </h2>
            {activeTab === "active" && (
              <Button onClick={handleCreateNew} variant="primary" size="xs">
                + Új cég
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { activeTab === "active" ? companies.load() : pendingCompanies.load(); }} variant="outline" size="xs">
              {LABELS.REFRESH}
            </Button>
            <ExportButton
              onExport={() => handleExport(companies.items)}
              disabled={companies.items.length === 0}
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
            placeholder={LABELS.SEARCH_COMPANY_BY_ID}
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
                {renderHeader("Név", "name")}
                {renderHeader("Kapcsolattartó", "contactName")}
                <th className="px-4 py-3 text-right font-semibold bg-slate-50 dark:bg-slate-900/80 transition-colors">
                  Művelet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 transition-colors">
              {sortedItems.map((company) => (
                <tr
                  key={String(company.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs transition-colors">
                    {String(company.id).slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                    {company.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 transition-colors">
                    <div className="text-xs">{company.contactName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 transition-colors">
                      {company.contactEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {activeTab === "active" ? (
                        <>
                          <Button
                            onClick={() => handleEdit(company.id)}
                            variant="outlineAccent"
                            size="xs"
                          >
                            {LABELS.EDIT}
                          </Button>
                          <Button
                            onClick={() => handleDelete(company.id)}
                            variant="danger"
                            size="xs"
                          >
                            {LABELS.DELETE}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleApprove(company.id)}
                            variant="primary"
                            size="xs"
                          >
                            Jóváhagyás
                          </Button>
                          <Button
                            onClick={() => handleReject(company.id)}
                            variant="danger"
                            size="xs"
                          >
                            Elutasítás
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!(activeTab === "active" ? companies.loading : pendingCompanies.loading) && currentItems.length === 0 && (
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
      <CompanyFormModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSave={handleSave}
        initialData={modal.data}
      />
    </div>
  );
}
