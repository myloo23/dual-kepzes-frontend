import { useEffect, useState, useMemo } from "react";
import PartnershipFilters from "../../features/partnerships/components/PartnershipFilters";
import AdminPartnershipsList from "../../features/partnerships/components/AdminPartnershipsList";
import { api } from "../../lib/api";
import type {
  Partnership,
  PartnershipStatus,
  UniversityUserProfile,
} from "../../types/api.types";

import ExportButton from "../../components/shared/ExportButton";
import { usePartnershipExport } from "../../features/partnerships/hooks/usePartnershipExport";

export default function AdminPartnerships() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [universityUsers, setUniversityUsers] = useState<
    UniversityUserProfile[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PartnershipStatus | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { handleExport } = usePartnershipExport();

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [partnershipsData, uniUsersData] = await Promise.all([
        api.partnerships.listUniversity(),
        api.universityUsers.list(),
      ]);
      setPartnerships(partnershipsData);
      setUniversityUsers(Array.isArray(uniUsersData) ? uniUsersData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredPartnerships = useMemo(() => {
    const filtered = partnerships.filter((p) => {
      // Status filter
      if (statusFilter !== "ALL" && p.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const studentName = p.student?.fullName?.toLowerCase() || "";
        const companyName = p.position?.company?.name?.toLowerCase() || "";

        return studentName.includes(query) || companyName.includes(query);
      }

      return true;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue = "";
        let bValue = "";

        if (sortConfig.key === "student") {
          aValue = a.student?.fullName ?? "";
          bValue = b.student?.fullName ?? "";
        } else if (sortConfig.key === "company") {
          aValue = a.position?.company?.name ?? "";
          bValue = b.position?.company?.name ?? "";
        } else if (sortConfig.key === "semester") {
          aValue = a.semester ?? "";
          bValue = b.semester ?? "";
        } else if (sortConfig.key === "mentor") {
          aValue = a.mentor?.fullName ?? "";
          bValue = b.mentor?.fullName ?? "";
        } else if (sortConfig.key === "uniEmployee") {
          aValue = a.uniEmployee?.fullName ?? "";
          bValue = b.uniEmployee?.fullName ?? "";
        } else if (sortConfig.key === "status") {
          aValue = a.status ?? "";
          bValue = b.status ?? "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [partnerships, statusFilter, searchQuery, sortConfig]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Partnerkapcsolatok
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A rendszerben lévő összes duális együttműködés kezelése.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
          >
            Frissítés
          </button>
          <ExportButton
            onExport={() => handleExport(filteredPartnerships)}
            disabled={partnerships.length === 0}
            icon="excel"
            label="Excel export"
          />
        </div>
      </div>

      <PartnershipFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <AdminPartnershipsList
        partnerships={filteredPartnerships}
        universityUsers={universityUsers}
        onRefresh={loadData}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
}
