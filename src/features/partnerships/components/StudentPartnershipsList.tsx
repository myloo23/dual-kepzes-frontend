import type { Partnership } from "../../../types/api.types";

interface StudentPartnershipsListProps {
  partnerships: Partnership[];
  isLoading: boolean;
}

export default function StudentPartnershipsList({
  partnerships,
  isLoading,
}: StudentPartnershipsListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
        Betöltés...
      </div>
    );
  }

  if (partnerships.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-slate-100 transition-colors">
          Nincs még duális helyed
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 transition-colors">
          Még nincs aktív duális helyed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm dark:shadow-none transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <thead className="bg-slate-50 dark:bg-slate-900/80 transition-colors">
            <tr>
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
                Mentor
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
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-transparent transition-colors">
            {partnerships.map((partnership) => (
              <tr key={String(partnership.id)}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  <div className="font-medium">
                    {partnership.position?.title || "-"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {partnership.position?.company?.name}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {partnership.contractNumber}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  {partnership.mentor ? (
                    <div>
                      <div className="font-medium">
                        {partnership.mentor.fullName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {partnership.mentor.email}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 italic text-xs">
                      -
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  {partnership.uniEmployee ? (
                    <div>
                      <div className="font-medium">
                        {partnership.uniEmployee.fullName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {partnership.uniEmployee.email}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 italic text-xs">
                      -
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 transition-colors ${
                      partnership.status === "ACTIVE"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                        : partnership.status === "TERMINATED"
                          ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                          : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300"
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
