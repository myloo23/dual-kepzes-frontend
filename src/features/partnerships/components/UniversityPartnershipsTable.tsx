import type { Partnership } from "../../../types/api.types";

import { ChevronDown, ChevronUp } from "lucide-react";

type SortKey =
  | "student"
  | "company"
  | "semester"
  | "mentor"
  | "uniEmployee"
  | "status";

export type SortConfig = {
  key: SortKey;
  direction: "asc" | "desc";
};

interface UniversityPartnershipsTableProps {
  partnerships: Partnership[];
  isLoading: boolean;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

export default function UniversityPartnershipsTable({
  partnerships,
  isLoading,
  sortConfig,
  onSort,
}: UniversityPartnershipsTableProps) {
  const renderSortIcon = (columnKey: SortKey) => {
    if (sortConfig.key !== columnKey)
      return <ChevronUp className="w-3 h-3 text-slate-300 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-600" />
    );
  };

  const SortableHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: SortKey;
  }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {renderSortIcon(sortKey)}
      </div>
    </th>
  );

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Betöltés...</div>;
  }

  if (partnerships.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Nincsenek partnerek
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Jelenleg nincs aktív vagy függőben lévő partnerség.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortableHeader label="Hallgató" sortKey="student" />
              <SortableHeader label="Cég / Pozíció" sortKey="company" />
              <SortableHeader label="Időszak" sortKey="semester" />
              <SortableHeader label="Mentor" sortKey="mentor" />
              <SortableHeader label="Egyetemi Felelős" sortKey="uniEmployee" />
              <SortableHeader label="Státusz" sortKey="status" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {partnerships.map((partnership) => (
              <tr
                key={String(partnership.id)}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-3 align-middle">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm">
                      {partnership.student?.fullName || "Ismeretlen hallgató"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {partnership.student?.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 align-middle">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {partnership.position?.company?.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {partnership.position?.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 align-middle">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 w-fit font-medium">
                      {partnership.semester || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      {partnership.startDate
                        ? new Date(partnership.startDate).toLocaleDateString()
                        : "?"}{" "}
                      -
                      {partnership.endDate
                        ? new Date(partnership.endDate).toLocaleDateString()
                        : "?"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 align-middle">
                  {partnership.mentor ? (
                    <div className="text-sm text-slate-700">
                      {partnership.mentor.fullName}
                    </div>
                  ) : (
                    <span className="text-xs italic text-amber-600">
                      Nincs kijelölve
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 align-middle">
                  {partnership.uniEmployee ? (
                    <span className="text-sm font-medium text-slate-900">
                      {partnership.uniEmployee.fullName}
                    </span>
                  ) : (
                    <span className="text-sm italic text-slate-400">
                      Nincs kijelölve
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      partnership.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : partnership.status === "TERMINATED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {partnership.status === "ACTIVE" && "Aktív"}
                    {partnership.status === "TERMINATED" && "Lezárt"}
                    {partnership.status === "PENDING_MENTOR" &&
                      "Mentor jóváhagyásra vár"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
