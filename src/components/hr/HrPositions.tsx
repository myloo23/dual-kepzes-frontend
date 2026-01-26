import { useEffect, useState } from "react";
import { api, type Position, type CompanyAdminProfile } from "../../lib/api";

interface HrPositionsProps {
    companyAdmin: CompanyAdminProfile | null;
}

export default function HrPositions({ companyAdmin }: HrPositionsProps) {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                // If we have the admin profile, we can use the company ID directly
                // If not, we try to fetch 'me', but ideally the parent should provide it or handle the error
                let admin = companyAdmin;
                if (!admin) {
                    admin = await api.companyAdmins.me.get();
                }

                if (admin?.companyEmployee?.company?.id) {
                    const list = await api.positions.listByCompany(admin.companyEmployee.company.id);
                    setPositions(Array.isArray(list) ? list : []);
                } else {
                    setError("Nem sikerült azonosítani a céget.");
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Hiba az álláshirdetések betöltésekor.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [companyAdmin]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Álláshirdetések</h2>
                <p className="text-sm text-slate-600">Saját céghez tartozó pozíciók.</p>
            </div>
            {loading && <div className="text-sm text-slate-600">Betöltés...</div>}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {!loading && !error && positions.length === 0 && (
                <div className="text-sm text-slate-600">Nincs megjeleníthető pozíció.</div>
            )}
            <div className="grid gap-3">
                {positions.map((position) => (
                    <div key={String(position.id)} className="rounded-lg border border-slate-200 p-4">
                        <div className="font-semibold text-slate-900">{position.title}</div>
                        <div className="text-sm text-slate-600">
                            {position.location?.city ?? "Ismeretlen város"} • {position.isDual ? "Duális" : "Nem duális"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
