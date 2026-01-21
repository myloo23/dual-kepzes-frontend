import { useEffect, useState } from "react";
import { api, type Application, type ApplicationStatus } from "../../../lib/api";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; icon: string }> = {
    SUBMITTED: {
        label: "Beküldve",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "📤",
    },
    ACCEPTED: {
        label: "Elfogadva",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅",
    },
    REJECTED: {
        label: "Elutasítva",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "❌",
    },
    NO_RESPONSE: {
        label: "Nincs válasz",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "⏳",
    },
};

export default function ApplicationsList() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.applications.list();
                setApplications(data);
            } catch (err: any) {
                setError(err.message || "Hiba a jelentkezések betöltése során.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10 text-slate-600">
                Betöltés...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Még nincs jelentkezésed
                </h3>
                <p className="text-sm text-slate-600">
                    Böngészd az elérhető pozíciókat és jelentkezz az első állásodra!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    Jelentkezéseim ({applications.length})
                </h2>
            </div>

            <div className="grid gap-4">
                {applications.map((app) => {
                    const statusConfig = STATUS_CONFIG[app.status];
                    let createdDate = "Ismeretlen dátum";
                    try {
                        if (app.createdAt) {
                            const date = new Date(app.createdAt);
                            if (!isNaN(date.getTime())) {
                                createdDate = date.toLocaleDateString("hu-HU", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });
                            }
                        }
                    } catch (e) {
                        console.error("Date parsing error:", e);
                    }

                    return (
                        <div
                            key={app.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                        {app.position?.title || "Pozíció"}
                                    </h3>
                                    {app.position?.company && (
                                        <p className="text-sm text-slate-600">
                                            {app.position.company.name}
                                        </p>
                                    )}
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                                >
                                    {statusConfig.icon} {statusConfig.label}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="text-xs text-slate-500 mb-3">
                                Jelentkezés dátuma: {createdDate}
                            </div>

                            {/* Student Note */}
                            {app.studentNote && (
                                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-3">
                                    <p className="text-xs font-medium text-slate-700 mb-1">
                                        Motivációs levél:
                                    </p>
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                        {app.studentNote}
                                    </p>
                                </div>
                            )}

                            {/* Company Response */}
                            {app.companyNote && (
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                    <p className="text-xs font-medium text-blue-700 mb-1">
                                        Cég válasza:
                                    </p>
                                    <p className="text-sm text-blue-900 whitespace-pre-wrap">
                                        {app.companyNote}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
