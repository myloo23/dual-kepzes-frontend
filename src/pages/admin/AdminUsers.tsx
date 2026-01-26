/**
 * Admin Users Page - Refactored
 * Manages users across different roles (Students, Company Admins, University Users, Inactive Users)
 */

import { useState } from 'react';
import type { StudentProfile } from '../../lib/api';
import { useUserManagement } from '../../features/users/hooks/useUserManagement';
import { useModal } from '../../hooks';
import StudentFormModal from '../../features/users/components/modals/StudentFormModal';
import AdminUserModal from '../../features/users/components/modals/AdminUserModal';
import Button from '../../components/ui/Button';
import {
  PAGE_TITLES,
  PAGE_DESCRIPTIONS,
  USER_TABS,
  USER_TAB_ORDER,
  LABELS,
  CONFIRM_MESSAGES
} from '../../constants';
import type { TabType } from '../../types/ui.types';

export default function AdminUsersPage() {
  const userManagement = useUserManagement();
  const studentModal = useModal<StudentProfile>();
  const genericModal = useModal<any>();
  const [lookupId, setLookupId] = useState('');

  const handleTabChange = (tab: TabType) => {
    userManagement.clearMessages();
    userManagement.setActiveTab(tab);
  };

  const handleOpenItem = (item: any) => {
    userManagement.clearMessages();
    if (userManagement.activeTab === 'STUDENT') {
      studentModal.open(item);
    } else {
      genericModal.open(item);
    }
  };

  const handleLookup = async () => {
    if (!lookupId.trim()) return;

    const item = await userManagement.getById(lookupId.trim());
    if (item) {
      handleOpenItem(item);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm(CONFIRM_MESSAGES.DELETE_USER)) return;

    const success = await userManagement.deleteUser(id);
    if (success) {
      studentModal.close();
      genericModal.close();
    }
  };

  const handleSaveStudent = async (data: Record<string, any>) => {
    if (!studentModal.data) return;

    const success = await userManagement.updateStudent(studentModal.data.id, data);
    if (success) {
      studentModal.close();
    }
  };

  const handleSaveGeneric = async (data: Record<string, any>) => {
    if (!genericModal.data) return;

    const success = await userManagement.updateGeneric(genericModal.data.id, data);
    if (success) {
      genericModal.close();
    }
  };

  const renderColumns = (item: any) => {
    if (userManagement.activeTab === 'STUDENT') {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.fullName ?? item.name ?? 'User'}
          </td>
          <td className="px-4 py-3 text-slate-600">{item.email ?? '-'}</td>
          <td className="px-4 py-3 text-slate-500">{item.neptunCode ?? '-'}</td>
        </>
      );
    } else if (userManagement.activeTab === 'COMPANY_ADMIN') {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.user?.fullName ?? item.fullName ?? item.name ?? 'User'}
          </td>
          <td className="px-4 py-3 text-slate-600">
            {item.user?.email ?? item.email ?? '-'}
          </td>
          <td className="px-4 py-3 text-slate-500">
            Cég ID: {item.companyEmployee?.company?.id ?? '-'}
          </td>
        </>
      );
    } else if (userManagement.activeTab === 'UNIVERSITY_USER') {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.user?.fullName ?? item.fullName ?? item.name ?? 'User'}
          </td>
          <td className="px-4 py-3 text-slate-600">
            {item.user?.email ?? item.email ?? '-'}
          </td>
          <td className="px-4 py-3 text-slate-500">-</td>
        </>
      );
    } else {
      // Inactive Users
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.fullName ?? item.name ?? 'User'}
          </td>
          <td className="px-4 py-3 text-slate-600">{item.email ?? '-'}</td>
          <td className="px-4 py-3 text-slate-500">{item.role ?? '-'}</td>
        </>
      );
    }
  };

  const getColumnHeader = () => {
    if (userManagement.activeTab === 'STUDENT') return 'Neptun';
    if (userManagement.activeTab === 'COMPANY_ADMIN') return 'Cég';
    return 'Egyéb';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-semibold">{PAGE_TITLES.ADMIN_USERS}</h1>
        <p className="text-sm text-slate-600">{PAGE_DESCRIPTIONS.ADMIN_USERS}</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {USER_TAB_ORDER.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${userManagement.activeTab === tab
              ? 'bg-white border border-slate-200 border-b-white text-blue-600 -mb-px'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            {USER_TABS[tab]}
          </button>
        ))}
      </div>

      {/* Feedback Messages */}
      {userManagement.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {userManagement.error}
        </div>
      )}
      {userManagement.message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {userManagement.message}
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-bold text-slate-800">
            {USER_TABS[userManagement.activeTab]}
          </h2>

          <div className="flex gap-2">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder={LABELS.SEARCH_USER_BY_ID}
              className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <Button
              type="button"
              onClick={handleLookup}
              variant="dark"
              size="sm"
            >
              {LABELS.SEARCH}
            </Button>
            <Button
              onClick={userManagement.load}
              variant="outline"
              size="xs"
              className="ml-2"
            >
              {LABELS.REFRESH}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">ID</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Név</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">Email</th>
                <th className="px-4 py-3 text-left font-semibold bg-slate-50">
                  {getColumnHeader()}
                </th>
                <th className="px-4 py-3 text-right font-semibold bg-slate-50">
                  Művelet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userManagement.items.map((item) => (
                <tr key={String(item.id)} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {String(item.id).slice(0, 8)}...
                  </td>

                  {renderColumns(item)}

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {userManagement.activeTab === 'INACTIVE_USER' && (
                        <Button
                          onClick={() => userManagement.reactivateUser(item.id)}
                          variant="success"
                          size="xs"
                        >
                          {LABELS.ACTIVATE}
                        </Button>
                      )}

                      {userManagement.activeTab !== 'INACTIVE_USER' && (
                        <Button
                          onClick={() => handleOpenItem(item)}
                          variant="outlineAccent"
                          size="xs"
                        >
                          {LABELS.EDIT}
                        </Button>
                      )}

                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="danger"
                        size="xs"
                      >
                        {LABELS.DELETE}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!userManagement.loading && userManagement.items.length === 0 && (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-500" colSpan={5}>
                    {LABELS.EMPTY_CATEGORY}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={studentModal.isOpen}
        onClose={studentModal.close}
        onSave={handleSaveStudent}
        initialData={studentModal.data}
      />

      <AdminUserModal
        isOpen={genericModal.isOpen}
        onClose={genericModal.close}
        onSave={handleSaveGeneric}
        initialData={genericModal.data}
        type={
          userManagement.activeTab === 'COMPANY_ADMIN'
            ? 'COMPANY_ADMIN'
            : userManagement.activeTab === 'UNIVERSITY_USER'
              ? 'UNIVERSITY_USER'
              : 'USER'
        }
      />
    </div>
  );
}
