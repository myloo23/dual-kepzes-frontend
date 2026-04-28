import { useCallback } from "react";
import type { Position } from "../../../lib/api";
import { exportToExcel, getExportFilename } from "../../../utils/export";

type FlatPosition = {
  title: string;
  companyName: string;
  city: string;
  status: string;
  deadline: string;
  createdAt: string;
};

export const usePositionExport = () => {
  const handleExport = useCallback((positions: Position[]) => {
    if (!positions || positions.length === 0) return;

    const columns: { key: keyof FlatPosition; label: string }[] = [
      { key: "title", label: "Megnevezés" },
      { key: "companyName", label: "Cég" },
      { key: "city", label: "Város" },
      { key: "status", label: "Státusz" },
      { key: "deadline", label: "Határidő" },
      { key: "createdAt", label: "Létrehozva" },
    ];

    const flatData: FlatPosition[] = positions.map((item) => ({
      title: item.title,
      companyName: item.company?.name || "-",
      city: item.location?.city || "-",
      status: item.isActive ? "Aktív" : "Inaktív",
      deadline: item.deadline
        ? new Date(item.deadline).toLocaleDateString("hu-HU")
        : "-",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("hu-HU")
        : "-",
    }));

    exportToExcel(
      flatData,
      getExportFilename("positions", "xlsx"),
      columns,
    );
  }, []);

  return { handleExport };
};
