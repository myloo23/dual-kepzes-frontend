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
  currentUniversityUserId?: string | null;
  assigningPartnershipId?: string | null;
  onAssignSelf?: (partnershipId: Partnership["id"]) => void;
}

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

function SortableHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortConfig.key === sortKey;
  const icon = !isActive ? (
    <ChevronUp className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-50" />
  ) : sortConfig.direction === "asc" ? (
    <ChevronUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
  ) : (
    <ChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
  );

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {icon}
      </div>
    </th>
  );
}

export default function UniversityPartnershipsTable({
  partnerships,
  isLoading,
  sortConfig,
  onSort,
  currentUniversityUserId,
  assigningPartnershipId,
  onAssignSelf,
}: UniversityPartnershipsTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Betoltes...
      </div>
    );
  }

  if (partnerships.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center transition-colors">
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-slate-100">
          Nincsenek partnerek
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Jelenleg nincs aktiv vagy fuggoben levo partnerseg.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm dark:shadow-none transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <thead className="bg-slate-50 dark:bg-slate-800/80 transition-colors">
            <tr>
              <SortableHeader
                label="Hallgato"
                sortKey="student"
                sortConfig={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="Ceg / Pozicio"
                sortKey="company"
                sortConfig={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="Idoszak"
                sortKey="semester"
                sortConfig={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="Mentor"
                sortKey="mentor"
                sortConfig={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="Egyetemi Felelos"
                sortKey="uniEmployee"
                sortConfig={sortConfig}
                onSort={onSort}
              />
              <SortableHeader
                label="Statusz"
                sortKey="status"
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-transparent transition-colors">
            {partnerships.map((partnership) => (
              <tr
                key={String(partnership.id)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-3 align-middle">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm transition-colors">
                      {partnership.student?.fullName || "Ismeretlen hallgato"}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                      {partnership.student?.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 align-middle">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {partnership.position?.company?.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 transition-colors">
                      {partnership.position?.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 align-middle">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit font-medium transition-colors">
                      {partnership.semester || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap transition-colors">
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
                    <div className="text-sm text-slate-700 dark:text-slate-300 transition-colors">
                      {partnership.mentor.fullName}
                    </div>
                  ) : (
                    <span className="text-xs italic text-amber-600 dark:text-amber-500 transition-colors">
                      Nincs kijelolve
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    {partnership.uniEmployee ? (
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                        {partnership.uniEmployee.fullName}
                      </span>
                    ) : (
                      <span className="text-sm italic text-slate-400 dark:text-slate-500 transition-colors">
                        Nincs kijelolve
                      </span>
                    )}

                    {onAssignSelf &&
                      partnership.status === "PENDING_UNIVERSITY" &&
                      !partnership.uniEmployee &&
                      currentUniversityUserId && (
                        <button
                          onClick={() => onAssignSelf(partnership.id)}
                          disabled={
                            assigningPartnershipId === String(partnership.id)
                          }
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline shrink-0 transition-colors disabled:opacity-60 disabled:no-underline"
                          title="A partnerkapcsolat hozzarendelese sajat magadhoz"
                        >
                          {assigningPartnershipId === String(partnership.id)
                            ? "Mentes..."
                            : "Magamhoz rendelem"}
                        </button>
                      )}
                  </div>
                </td>
                <td className="px-6 py-3 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      partnership.status === "ACTIVE"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                        : partnership.status === "TERMINATED"
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"
                          : partnership.status === "PENDING_UNIVERSITY"
                            ? "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"
                    }`}
                  >
                    {partnership.status === "ACTIVE" && "Aktiv"}
                    {partnership.status === "TERMINATED" && "Lezart"}
                    {partnership.status === "PENDING_UNIVERSITY" &&
                      "Egyetemi felelosre var"}
                    {partnership.status === "PENDING_MENTOR" &&
                      "Mentor jovahagyasra var"}
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
