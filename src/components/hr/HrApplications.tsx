import { useEffect, useMemo, useState } from "react";
import { api, type Application, type ApplicationStatus } from "../../lib/api";

export default function HrApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Filtering states
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "student-asc" | "student-desc" | "position-asc">("newest");

    const loadApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await api.applications.listCompany();
            setApplications(Array.isArray(list) ? list : []);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Hiba a jelentkezések betöltésekor.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadApplications();
    }, []);

    const statusLabels: Record<ApplicationStatus, string> = {
        SUBMITTED: "Beküldve",
        ACCEPTED: "Elfogadva",
        REJECTED: "Elutasítva",
        NO_RESPONSE: "Nincs válasz"
    };

    const handleApplicationDecision = async (id: string, status: "ACCEPTED" | "REJECTED") => {
        setActionId(id);
        setActionError(null);
        try {
            await api.applications.evaluateCompany(id, { status });
            await loadApplications();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Hiba a jelentkezés frissítésekor.";
            setActionError(message);
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmId) return;

        try {
            setDeletingId(deleteConfirmId);
            setDeleteError(null);
            await api.applications.updateCompanyApplication(deleteConfirmId, {
                status: "REJECTED",
                companyNote: "Jelentkezés törölve a cég által."
            });

            // Remove the application from the list
            setApplications(prev => prev.filter(app => app.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (err: any) {
            const errorMsg = err.message || "Hiba történt a jelentkezés törlése során.";
            setDeleteError(errorMsg);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmId(null);
        setDeleteError(null);
    };

    // Filtered and sorted applications
    const filteredApplications = useMemo(() => {
        let filtered = [...applications];

        // Status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(app =>
                app.student?.fullName.toLowerCase().includes(query) ||
                app.student?.email.toLowerCase().includes(query) ||
                app.student?.currentMajor.toLowerCase().includes(query) ||
                app.position?.title.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "student-asc":
                    return (a.student?.fullName || "").localeCompare(b.student?.fullName || "", "hu");
                case "student-desc":
                    return (b.student?.fullName || "").localeCompare(a.student?.fullName || "", "hu");
                case "position-asc":
                    return (a.position?.title || "").localeCompare(b.position?.title || "", "hu");
                default:
                    return 0;
            }
        });

        return filtered;
    }, [applications, statusFilter, searchQuery, sortBy]);

    const clearFilters = () => {
        setStatusFilter("ALL");
        setSearchQuery("");
        setSortBy("newest");
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Jelentkezések</h2>
                <p className="text-sm text-slate-600">A céghez beérkezett jelentkezések.</p>
            </div>

            {/* Filters Section */}
            {!loading && !error && applications.length > 0 && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Keresés hallgató neve, email, szakja vagy pozíció alapján..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setStatusFilter("ALL")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "ALL"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                }`}
                        >
                            Összes ({applications.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter("SUBMITTED")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "SUBMITTED"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                }`}
                        >
                            📤 Beküldve ({applications.filter(a => a.status === "SUBMITTED").length})
                        </button>
                        <button
                            onClick={() => setStatusFilter("ACCEPTED")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "ACCEPTED"
                                ? "bg-green-600 text-white"
                                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                }`}
                        >
                            ✅ Elfogadva ({applications.filter(a => a.status === "ACCEPTED").length})
                        </button>
                        <button
                            onClick={() => setStatusFilter("REJECTED")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "REJECTED"
                                ? "bg-red-600 text-white"
                                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                }`}
                        >
                            ❌ Elutasítva ({applications.filter(a => a.status === "REJECTED").length})
                        </button>
                        <button
                            onClick={() => setStatusFilter("NO_RESPONSE")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "NO_RESPONSE"
                                ? "bg-gray-600 text-white"
                                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                }`}
                        >
                            ⏳ Nincs válasz ({applications.filter(a => a.status === "NO_RESPONSE").length})
                        </button>
                    </div>

                    {/* Sort and Clear */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-700">Rendezés:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Legújabb először</option>
                                <option value="oldest">Legrégebbi először</option>
                                <option value="student-asc">Hallgató neve (A-Z)</option>
                                <option value="student-desc">Hallgató neve (Z-A)</option>
                                <option value="position-asc">Pozíció (A-Z)</option>
                            </select>
                        </div>
                        {(statusFilter !== "ALL" || searchQuery || sortBy !== "newest") && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Szűrők törlése
                            </button>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="text-sm text-slate-600">
                        <span className="font-medium">{filteredApplications.length}</span> jelentkezés megjelenítve
                        {filteredApplications.length !== applications.length && (
                            <span className="text-slate-500"> ({applications.length} összesen)</span>
                        )}
                    </div>
                </div>
            )}

            {loading && <div className="text-sm text-slate-600">Betöltés...</div>}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {actionError}
                </div>
            )}
            {!loading && !error && applications.length === 0 && (
                <div className="text-sm text-slate-600">Nincs megjeleníthető jelentkezés.</div>
            )}

            {/* No results message */}
            {!loading && filteredApplications.length === 0 && applications.length > 0 && (
                <div className="text-center py-10">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Nincs találat
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Próbálj más szűrési feltételeket használni.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Szűrők törlése
                    </button>
                </div>
            )}

            <div className="grid gap-3">
                {filteredApplications.map((app) => (
                    <div key={String(app.id)} className="rounded-lg border border-slate-200 p-4">
                        <div className="font-semibold text-slate-900">
                            {app.position?.title ?? "Pozíció"}
                        </div>
                        <div className="text-sm text-slate-600">
                            Státusz: {statusLabels[app.status] ?? app.status}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                onClick={() =>
                                    setExpandedId((prev) =>
                                        prev === String(app.id) ? null : String(app.id)
                                    )
                                }
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {expandedId === String(app.id) ? "Bezárás" : "Megtekintés"}
                            </button>
                            <button
                                onClick={() => handleApplicationDecision(String(app.id), "ACCEPTED")}
                                disabled={actionId === String(app.id)}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {actionId === String(app.id) ? "Mentés..." : "Elfogadás"}
                            </button>
                            <button
                                onClick={() => handleApplicationDecision(String(app.id), "REJECTED")}
                                disabled={actionId === String(app.id)}
                                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                                Elutasítás
                            </button>
                            <button
                                onClick={() => handleDeleteClick(String(app.id))}
                                disabled={deletingId === String(app.id)}
                                className="rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deletingId === String(app.id) ? "Törlés..." : "🗑️ Törlés"}
                            </button>
                        </div>
                        {expandedId === String(app.id) && (
                            <>
                                {app.student && (
                                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                        <div className="font-semibold text-slate-900">Jelentkező adatai</div>
                                        <div className="mt-1">Név: {app.student.fullName}</div>
                                        <div>E-mail: {app.student.email}</div>
                                        <div>Telefonszám: {app.student.phoneNumber}</div>
                                        <div>Város: {app.student.city}</div>
                                        <div>Szak: {app.student.currentMajor}</div>
                                    </div>
                                )}
                                {!app.student && (
                                    <div className="mt-4 text-sm text-slate-600">
                                        A jelentkező részletes adatai nem elérhetők.
                                    </div>
                                )}
                            </>
                        )}
                        {app.companyNote && (
                            <div className="mt-2 text-sm text-slate-700">Megjegyzés: {app.companyNote}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            {
                deleteConfirmId && (() => {
                    const app = applications.find(a => String(a.id) === deleteConfirmId);
                    const isAccepted = app?.status === "ACCEPTED";
                    return (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                                <div className="text-center mb-6">
                                    <div className="text-5xl mb-3">⚠️</div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        Jelentkezés törlése
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        {isAccepted
                                            ? "Biztosan törlöd ezt az elfogadott jelentkezést? Ez megszakítja a duális partnerséget is."
                                            : "Biztosan törlöd ezt a jelentkezést? Ez a művelet nem vonható vissza."
                                        }
                                    </p>
                                </div>

                                {deleteError && (
                                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {deleteError}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteCancel}
                                        disabled={deletingId !== null}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Mégse
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        disabled={deletingId !== null}
                                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {deletingId ? "Törlés..." : "Törlés"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()
            }
        </div >
    );
}
