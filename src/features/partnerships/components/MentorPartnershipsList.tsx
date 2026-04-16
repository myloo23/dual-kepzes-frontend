import type { Partnership } from "../../../types/api.types";

interface MentorPartnershipsListProps {
  partnerships: Partnership[];
  isLoading: boolean;
}

export default function MentorPartnershipsList({
  partnerships,
  isLoading,
}: MentorPartnershipsListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
        Betöltés...
      </div>
    );
  }

  if (partnerships.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Nincsenek partnerek
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Önhöz még nincs hozzárendelve hallgató.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <thead className="bg-slate-50 dark:bg-slate-800/50 transition-colors">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
              >
                Hallgató
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
              >
                Pozíció
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
              >
                Egyetemi Felelős
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
              >
                Státusz
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
              >
                Dátumok
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 transition-colors">
            {partnerships.map((partnership) => (
              <tr key={String(partnership.id)}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100 transition-colors">
                        {partnership.student?.fullName || "Ismeretlen hallgató"}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                        {partnership.student?.email}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
                        {partnership.contractNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  <div className="font-medium">
                    {partnership.position?.title || "-"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    {partnership.position?.company?.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  {partnership.uniEmployee ? (
                    <div>
                      <div className="font-medium">
                        {partnership.uniEmployee.fullName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                        {partnership.uniEmployee.email}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 italic text-xs transition-colors">
                      -
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 transition-colors ${
                      partnership.status === "ACTIVE"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/30"
                        : partnership.status === "TERMINATED"
                          ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/30"
                          : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30"
                    }`}
                  >
                    {partnership.status === "ACTIVE" && "Aktív"}
                    {partnership.status === "TERMINATED" && "Lezárt"}
                    {partnership.status === "PENDING_MENTOR" &&
                      "Mentor jóváhagyásra vár"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                  {partnership.startDate && (
                    <div>
                      Kezdet:{" "}
                      {new Date(partnership.startDate).toLocaleDateString()}
                    </div>
                  )}
                  {partnership.endDate && (
                    <div>
                      Vége: {new Date(partnership.endDate).toLocaleDateString()}
                    </div>
                  )}
                  {partnership.semester && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
                      {partnership.semester}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
