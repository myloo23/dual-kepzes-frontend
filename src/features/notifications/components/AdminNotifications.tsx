import { useState, useMemo, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationFilters } from './NotificationFilters';
import { NotificationList } from './NotificationList';

export function AdminNotifications() {
  const { 
    active, 
    archived, 
    loading, 
    loadActive, 
    loadArchived, 
    markRead, 
    archive, 
    unarchive, 
    remove 
  } = useNotifications();

  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [filters, setFilters] = useState({ role: '', type: '' });

  useEffect(() => {
    if (tab === 'active') {
      loadActive();
    } else {
      loadArchived();
    }
  }, [tab, loadActive, loadArchived]);

  const filteredNotifications = useMemo(() => {
    const list = tab === 'active' ? active : archived;
    return list.filter(item => {
      // Role filtering
      if (filters.role) {
        if (item.senderRole) {
          if (item.senderRole !== filters.role) return false;
        } else {
          // Fallback logic for items with missing senderRole
          // If filtering for Company, show Partnership requests as they usually come from companies
          if (item.type === 'PARTNERSHIP_PENDING_UNIVERSITY' && filters.role === 'ROLE_COMPANY_ADMIN') {
            // keep it
          } else {
             return false;
          }
        }
      }

      // Type filtering
      if (filters.type && item.type !== filters.type) return false;
      return true;
    });
  }, [active, archived, tab, filters]);

  const handleFilterChange = (key: 'role' | 'type', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Értesítések</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'active' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Aktív
          </button>
          <button
            onClick={() => setTab('archived')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'archived' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Archivált
          </button>
        </div>
      </div>

      <NotificationFilters filters={filters} onFilterChange={handleFilterChange} />

      <NotificationList 
        notifications={filteredNotifications}
        onMarkRead={markRead}
        onArchive={tab === 'active' ? archive : unarchive}
        onDelete={remove}
        isLoading={loading}
      />
    </div>
  );
}
