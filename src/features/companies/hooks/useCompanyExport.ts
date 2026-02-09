import { useCallback } from "react";
import type { Company } from "../../../lib/api";
import { exportToExcel, getExportFilename } from "../../../utils/export";

export const useCompanyExport = () => {
  const handleExport = useCallback((companies: Company[]) => {
    if (!companies || companies.length === 0) return;

    const columns = [
      { key: "name", label: "Cégnév" },
      { key: "taxId", label: "Adószám" },
      { key: "contactName", label: "Kapcsolattartó neve" },
      { key: "contactEmail", label: "Kapcsolattartó email" },
    ];

    exportToExcel(
      companies,
      getExportFilename("companies", "xlsx"),
      columns as any,
    );
  }, []);

  return { handleExport };
};
