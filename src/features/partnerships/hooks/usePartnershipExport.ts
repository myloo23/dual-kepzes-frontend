import { useCallback } from "react";
import type { Partnership } from "../../../types/api.types";
import { exportToExcel, getExportFilename } from "../../../utils/export";

export const usePartnershipExport = () => {
  const handleExport = useCallback((partnerships: Partnership[]) => {
    if (!partnerships || partnerships.length === 0) return;

    const columns = [
      { key: "studentName", label: "Hallgató" },
      { key: "companyName", label: "Cég" },
      { key: "status", label: "Státusz" },
      { key: "semester", label: "Szemeszter" },
      { key: "startDate", label: "Kezdés" },
      { key: "endDate", label: "Vége" },
    ];

    const flatData = partnerships.map((p) => ({
      studentName: p.student?.fullName || "-",
      companyName: p.position?.company?.name || "-",
      status: p.status,
      semester: p.semester || "-",
      startDate: p.startDate
        ? new Date(p.startDate).toLocaleDateString("hu-HU")
        : "-",
      endDate: p.endDate
        ? new Date(p.endDate).toLocaleDateString("hu-HU")
        : "-",
    }));

    exportToExcel(
      flatData,
      getExportFilename("partnerships", "xlsx"),
      columns as any,
    );
  }, []);

  return { handleExport };
};
