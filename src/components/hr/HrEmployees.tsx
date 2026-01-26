import { useEffect, useState } from "react";
import { api, type EmployeeProfile } from "../../lib/api";

export default function HrEmployees() {
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
                const message = err instanceof Error ? err.message : "Hiba a munkavállalók betöltésekor.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Munkavállalók</h2>
                <p className="text-sm text-slate-600">Céghez tartozó mentorok és munkatársak.</p>
            </div>
            {loading && <div className="text-sm text-slate-600">Betöltés...</div>}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {!loading && !error && employees.length === 0 && (
                <div className="text-sm text-slate-600">Nincs megjeleníthető munkavállaló.</div>
            )}
            <div className="grid gap-3">
                {employees.map((emp) => (
                    <div key={String(emp.id)} className="rounded-lg border border-slate-200 p-4">
                        <div className="font-semibold text-slate-900">
                            {emp.fullName ?? "Munkavállaló"}
                        </div>
                        <div className="text-sm text-slate-600">
                            {emp.email ?? "Nincs email"}{emp.role ? ` • ${emp.role}` : ""}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
