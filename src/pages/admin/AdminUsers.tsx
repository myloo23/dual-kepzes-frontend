/**
 * Admin Users Page - Refactored
 * Manages users across different roles (Students, Company Admins, University Users, Inactive Users)
 */

import { useState, useMemo } from "react";
import type { StudentProfile } from "../../lib/api";
import { useUserManagement } from "../../features/users/hooks/useUserManagement";
import { useModal } from "../../hooks";
import StudentFormModal from "../../features/users/components/modals/StudentFormModal";
import AdminUserModal from "../../features/users/components/modals/AdminUserModal";
import Button from "../../components/ui/Button";
import ExportButton from "../../components/shared/ExportButton";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { useUserExport } from "../../features/users/hooks/useUserExport";
import {
  PAGE_TITLES,
  PAGE_DESCRIPTIONS,
  USER_TABS,
  USER_TAB_ORDER,
  LABELS,
  CONFIRM_MESSAGES,
} from "../../constants";
import type { TabType } from "../../types/ui.types";

export default function AdminUsersPage() {
  const userManagement = useUserManagement();
  const studentModal = useModal<StudentProfile>();
  const genericModal = useModal<any>();
  const [lookupId, setLookupId] = useState("");
  const { handleExport } = useUserExport();

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleTabChange = (tab: TabType) => {
    userManagement.clearMessages();
    userManagement.setActiveTab(tab);
    setSortConfig(null); // Reset sorting when changing tabs
  };

  const handleOpenItem = (item: any) => {
    userManagement.clearMessages();
    if (userManagement.activeTab === "STUDENT") {
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

    const success = await userManagement.updateStudent(
      studentModal.data.id,
      data,
    );
    if (success) {
      studentModal.close();
    }
  };

  const handleSaveGeneric = async (data: Record<string, any>) => {
    if (!genericModal.data) return;

    const success = await userManagement.updateGeneric(
      genericModal.data.id,
      data,
    );
    if (success) {
      genericModal.close();
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

  const getSortValue = (item: any, key: string) => {
    if (userManagement.activeTab === "STUDENT") {
      const neptun = item.neptunCode ?? item.studentProfile?.neptunCode;
      if (key === "neptunCode") return neptun ?? "";
      if (key === "type") return neptun ? "Egyetemista" : "Középiskolás";
    }
    if (userManagement.activeTab === "COMPANY_ADMIN") {
      if (key === "company") return item.companyEmployee?.company?.id ?? "";
      if (key === "name")
        return item.user?.fullName ?? item.fullName ?? item.name ?? "";
      if (key === "email") return item.user?.email ?? item.email ?? "";
    }
    if (userManagement.activeTab === "UNIVERSITY_USER") {
      if (key === "name")
        return item.user?.fullName ?? item.fullName ?? item.name ?? "";
      if (key === "email") return item.user?.email ?? item.email ?? "";
    }
    // Default / Inactive
    if (key === "name") return item.fullName ?? item.name ?? "";
    return item[key] ?? "";
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...userManagement.items];
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
  }, [userManagement.items, sortConfig, userManagement.activeTab]);

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-slate-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 text-blue-600" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-blue-600" />
    );
  };

  const renderHeader = (label: string, sortKey: string) => (
    <th
      className="px-4 py-3 text-left font-semibold bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(sortKey)}
      </div>
    </th>
  );

  const renderColumns = (item: any) => {
    if (userManagement.activeTab === "STUDENT") {
      const neptun = item.neptunCode ?? item.studentProfile?.neptunCode;
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.fullName ?? item.name ?? "User"}
          </td>
          <td className="px-4 py-3 text-slate-600">{item.email ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">{neptun ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">
            {neptun ? (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Egyetemista
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                Középiskolás
              </span>
            )}
          </td>
        </>
      );
    } else if (userManagement.activeTab === "COMPANY_ADMIN") {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.user?.fullName ?? item.fullName ?? item.name ?? "User"}
          </td>
          <td className="px-4 py-3 text-slate-600">
            {item.user?.email ?? item.email ?? "-"}
          </td>
          <td className="px-4 py-3 text-slate-500">
            Cég ID: {item.companyEmployee?.company?.id ?? "-"}
          </td>
        </>
      );
    } else if (userManagement.activeTab === "UNIVERSITY_USER") {
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.user?.fullName ?? item.fullName ?? item.name ?? "User"}
          </td>
          <td className="px-4 py-3 text-slate-600">
            {item.user?.email ?? item.email ?? "-"}
          </td>
          <td className="px-4 py-3 text-slate-500">-</td>
        </>
      );
    } else {
      // Inactive Users
      return (
        <>
          <td className="px-4 py-3 font-medium text-slate-900">
            {item.fullName ?? item.name ?? "User"}
          </td>
          <td className="px-4 py-3 text-slate-600">{item.email ?? "-"}</td>
          <td className="px-4 py-3 text-slate-500">{item.role ?? "-"}</td>
        </>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-semibold">{PAGE_TITLES.ADMIN_USERS}</h1>
        <p className="text-sm text-slate-600">
          {PAGE_DESCRIPTIONS.ADMIN_USERS}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {USER_TAB_ORDER.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              userManagement.activeTab === tab
                ? "bg-white border border-slate-200 border-b-white text-blue-600 -mb-px"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
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
            <ExportButton
              onExport={() =>
                handleExport(userManagement.items, userManagement.activeTab)
              }
              disabled={userManagement.items.length === 0}
              icon="excel"
              label="Excel export"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm relative">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                {renderHeader("ID", "id")}
                {renderHeader("Név", "name")}
                {renderHeader("Email", "email")}

                {/* Conditional Headers */}
                {userManagement.activeTab === "STUDENT" && (
                  <>
                    {renderHeader("Neptun", "neptunCode")}
                    {renderHeader("Típus", "type")}
                  </>
                )}
                {userManagement.activeTab === "COMPANY_ADMIN" &&
                  renderHeader("Cég", "company")}
                {userManagement.activeTab === "UNIVERSITY_USER" &&
                  renderHeader("Egyéb", "other")}
                {userManagement.activeTab === "INACTIVE_USER" &&
                  renderHeader("Szerepkör", "role")}

                <th className="px-4 py-3 text-right font-semibold bg-slate-50">
                  Művelet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedItems.map((item) => (
                <tr
                  key={String(item.id)}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {String(item.id).slice(0, 8)}...
                  </td>

                  {renderColumns(item)}

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {userManagement.activeTab === "INACTIVE_USER" && (
                        <Button
                          onClick={() => userManagement.reactivateUser(item.id)}
                          variant="success"
                          size="xs"
                        >
                          {LABELS.ACTIVATE}
                        </Button>
                      )}

                      {userManagement.activeTab !== "INACTIVE_USER" && (
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
                  <td
                    className="px-4 py-12 text-center text-slate-500"
                    colSpan={6}
                  >
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
          userManagement.activeTab === "COMPANY_ADMIN"
            ? "COMPANY_ADMIN"
            : userManagement.activeTab === "UNIVERSITY_USER"
              ? "UNIVERSITY_USER"
              : "USER"
        }
      />
    </div>
  );
}
