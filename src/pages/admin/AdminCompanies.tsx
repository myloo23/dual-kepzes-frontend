/**
 * Admin Companies Page - Refactored
 * Manages company CRUD operations
 */

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Company } from '../../lib/api';
import { useCRUD, useModal } from '../../hooks';
import CompanyFormModal from '../../features/companies/components/modals/CompanyFormModal';
import {
  PAGE_TITLES,
  PAGE_DESCRIPTIONS,
  LABELS,
  CONFIRM_MESSAGES
} from '../../constants';

export default function AdminCompaniesPage() {
  const companies = useCRUD<Company>({
    listFn: api.companies.list,
    getFn: api.companies.get,
    createFn: api.companies.create,
    updateFn: api.companies.update,
    deleteFn: api.companies.remove,
  });

  const modal = useModal<Company>();
  const [lookupId, setLookupId] = useState('');

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

    // Try to find in local list first to avoid API call and potential missing relations
    const localCompany = companies.items.find((c) => String(c.id) === String(id));
    if (localCompany && localCompany.locations?.length > 0) {
      modal.open(localCompany);
      return;
    }

    // Fallback to fetch
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

  const handleSave = async (data: Omit<Company, 'id'>) => {
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
        <p className="text-sm text-slate-600">{PAGE_DESCRIPTIONS.ADMIN_COMPANIES}</p>
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
            <button
              onClick={handleCreateNew}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              + Új cég
            </button>
          </div>
          <button
            onClick={companies.load}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition"
          >
            {LABELS.REFRESH}
          </button>
        </div>

        {/* Lookup */}
        <div className="flex gap-2 mb-4">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder={LABELS.SEARCH_COMPANY_BY_ID}
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="button"
            onClick={handleLookup}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition shadow-sm"
          >
            {LABELS.SEARCH}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">ID</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Név</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Kapcsolattartó</th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.items.map((company) => (
                <tr key={String(company.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {String(company.id).slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{company.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="text-xs">{company.contactName}</div>
                    <div className="text-[10px] text-slate-400">{company.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(company.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        {LABELS.EDIT}
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        {LABELS.DELETE}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!companies.loading && companies.items.length === 0 && (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-500" colSpan={5}>
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
