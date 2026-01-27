import { useEffect, useState } from "react";
import { api, type Position, type CompanyAdminProfile } from "../../lib/api";
import PositionFormModal from "../../features/positions/components/modals/PositionFormModal";

interface HrPositionsProps {
    companyAdmin: CompanyAdminProfile | null;
}

export default function HrPositions({ companyAdmin }: HrPositionsProps) {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);

    const loadPositions = async () => {
        setLoading(true);
        setError(null);
        try {
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

    useEffect(() => {
        loadPositions();
    }, [companyAdmin]);

    const handleCreate = () => {
        setEditingPosition(null);
        setIsModalOpen(true);
    };

    const handleEdit = (position: Position) => {
        setEditingPosition(position);
        setIsModalOpen(true);
    };

    const handleSave = async (data: Omit<Position, "id">) => {
        try {
            if (editingPosition) {
                await api.positions.update(editingPosition.id, data);
            } else {
                await api.positions.create(data);
            }
            await loadPositions();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save position", err);
            throw err; // FormModal catches this to show error
        }
    };

    // Extract company for the modal
    const currentCompany = companyAdmin?.companyEmployee?.company;
    const companiesForModal = currentCompany ? [currentCompany] : [];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Álláshirdetések</h2>
                    <p className="text-sm text-slate-600">Saját céghez tartozó pozíciók.</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={!currentCompany}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Új pozíció
                </button>
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
                    <div key={String(position.id)} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                        <div>
                            <div className="font-semibold text-slate-900">{position.title}</div>
                            <div className="text-sm text-slate-600">
                                {position.location?.city ?? "Ismeretlen város"} • {position.isDual ? "Duális" : "Nem duális"}
                            </div>
                        </div>
                        <button
                            onClick={() => handleEdit(position)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Szerkesztés
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <PositionFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    companies={companiesForModal}
                    initialData={editingPosition}
                />
            )}
        </div>
    );
}
