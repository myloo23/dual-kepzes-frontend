import { useEffect, useState } from "react";
import { api, type EmployeeProfile } from "../../../lib/api";

export default function CompanyEmployeeList() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await api.employees.list();
        setEmployees(Array.isArray(list) ? list : []);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Hiba a munkavállalók betöltésekor.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Munkavállalók
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Céghez tartozó mentorok és munkatársak.
        </p>
      </div>
      {loading && (
        <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Betöltés...
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
          {error}
        </div>
      )}
      {!loading && !error && employees.length === 0 && (
        <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Nincs megjeleníthető munkavállaló.
        </div>
      )}
      <div className="grid gap-3">
        {employees.map((emp) => (
          <div
            key={String(emp.id)}
            className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-colors"
          >
            <div className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">
              {emp.fullName ?? "Munkavállaló"}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
              {emp.email ?? "Nincs email"}
              {emp.role ? ` • ${emp.role}` : ""}
            </div>
            <div className="mt-2 text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 inline-block px-1 rounded border border-slate-100 dark:border-slate-700 select-all transition-colors">
              ID: {String(emp.id)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
