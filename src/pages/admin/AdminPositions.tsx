/**
 * Admin Positions Page - Refactored
 * Manages position CRUD operations
 */

import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { api } from '../../lib/api';
import type { Position, Company } from '../../lib/api';
import { useCRUD, useModal } from '../../hooks';
import PositionFormModal from '../../features/positions/components/modals/PositionFormModal';
import {
  PAGE_TITLES,
  LABELS,
  CONFIRM_MESSAGES
} from '../../constants';

export default function AdminPositionsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const positions = useCRUD<Position>({
    listFn: api.positions.list,
    getFn: api.positions.get,
    createFn: api.positions.create,
    updateFn: api.positions.update,
    deleteFn: api.positions.remove,
  });

  const modal = useModal<Position>();
  const [lookupId, setLookupId] = useState('');

  // Load positions on mount
  useEffect(() => {
    positions.load();
  }, []);

  // Load companies for the dropdown
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await api.companies.list();
        setCompanies(data);
      } catch (err) {
        console.error('Failed to load companies:', err);
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
    const localPosition = positions.items.find((p) => String(p.id) === String(id));
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
      positions.setMessage('Pozíció deaktiválva.');
      await positions.load();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Deaktiválás sikertelen.';
      positions.setError(errorMsg);
    }
  };

  const handleSave = async (data: Omit<Position, 'id'>) => {
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
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Inaktív
        </span>
      );
    }

    const deadline = position.deadline ? new Date(position.deadline) : null;
    const isExpired = deadline && deadline < new Date();

    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
          Lejárt
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        Aktív
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-semibold">{PAGE_TITLES.ADMIN_POSITIONS}</h1>
        <p className="text-sm text-slate-600">Összes pozíció kezelése.</p>
      </div>

      {/* Feedback Messages */}
      {positions.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {positions.error}
        </div>
      )}
      {positions.message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {positions.message}
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">Összes pozíció</h2>
            <button
              onClick={handleCreateNew}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              + Új pozíció
            </button>
          </div>
          <button
            onClick={positions.load}
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
            placeholder="Pozíció keresése ID alapján..."
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
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Cím</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Város</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Státusz</th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions.items.map((position) => (
                <tr key={String(position.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {String(position.id).slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{position.title}</td>
                  <td className="px-4 py-3 text-slate-600">{position.location?.city || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 items-center">
                      {getStatusBadge(position)}
                      {!position.isDual && (
                        <span title="Full-time" className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Briefcase size={12} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(position.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        {LABELS.EDIT}
                      </button>
                      {position.isActive && (
                        <button
                          onClick={() => handleDeactivate(position.id)}
                          className="rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 transition"
                        >
                          {LABELS.DEACTIVATE}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        {LABELS.DELETE}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!positions.loading && positions.items.length === 0 && (
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
