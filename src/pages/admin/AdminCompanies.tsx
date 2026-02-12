/**
 * Admin Companies Page - Refactored
 * Manages company CRUD operations
 */

import { useState, useEffect } from "react";
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
export default function AdminCompaniesPage() {
  const companies = useCRUD<Company>({
    listFn: companyApi.list,
    getFn: companyApi.get,
    createFn: companyApi.create,
    updateFn: companyApi.update,
    deleteFn: companyApi.remove,
  });

  const modal = useModal<Company>();
  const [lookupId, setLookupId] = useState("");
  const { handleExport } = useCompanyExport();

  // Load companies on mount
  useEffect(() => {
    companies.load();
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-semibold">{PAGE_TITLES.ADMIN_COMPANIES}</h1>
        <p className="text-sm text-slate-600">
          {PAGE_DESCRIPTIONS.ADMIN_COMPANIES}
        </p>
      </div>

      {/* Feedback Messages */}
      {companies.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {companies.error}
        </div>
      )}
      {companies.message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {companies.message}
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">Összes cég</h2>
            <Button onClick={handleCreateNew} variant="primary" size="xs">
              + Új cég
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={companies.load} variant="outline" size="xs">
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
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <Button type="button" onClick={handleLookup} variant="dark" size="sm">
            {LABELS.SEARCH}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">
                  Név
                </th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">
                  Kapcsolattartó
                </th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">
                  Művelet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.items.map((company) => (
                <tr
                  key={String(company.id)}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {String(company.id).slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {company.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="text-xs">{company.contactName}</div>
                    <div className="text-[10px] text-slate-400">
                      {company.contactEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
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
                    </div>
                  </td>
                </tr>
              ))}
              {!companies.loading && companies.items.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-12 text-center text-slate-500"
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
