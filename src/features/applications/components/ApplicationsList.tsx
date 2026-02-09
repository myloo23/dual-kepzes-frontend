import { useEffect, useState, useMemo } from "react";
import {
  api,
  type Application,
  type ApplicationStatus,
} from "../../../lib/api";

const STATUS_CONFIG = {
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
  const [retractingId, setRetractingId] = useState<string | null>(null);
  const [confirmDialogId, setConfirmDialogId] = useState<string | null>(null);
  const [retractError, setRetractError] = useState<string | null>(null);

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "position-asc" | "position-desc"
  >("newest");

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

  const handleRetractClick = (applicationId: string) => {
    setConfirmDialogId(applicationId);
    setRetractError(null);
  };

  const handleRetractConfirm = async () => {
    if (!confirmDialogId) return;

    try {
      setRetractingId(confirmDialogId);
      setRetractError(null);
      await api.applications.retract(confirmDialogId);

      // Remove the application from the list
      setApplications((prev) =>
        prev.filter((app) => app.id !== confirmDialogId),
      );
      setConfirmDialogId(null);
    } catch (err: any) {
      const errorMsg =
        err.message || "Hiba történt a jelentkezés visszavonása során.";
      setRetractError(errorMsg);
    } finally {
      setRetractingId(null);
    }
  };

  const handleRetractCancel = () => {
    setConfirmDialogId(null);
    setRetractError(null);
  };

  // Filtered and sorted applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.position?.title.toLowerCase().includes(query) ||
          app.position?.company.name.toLowerCase().includes(query),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "position-asc":
          return (a.position?.title || "").localeCompare(
            b.position?.title || "",
            "hu",
          );
        case "position-desc":
          return (b.position?.title || "").localeCompare(
            a.position?.title || "",
            "hu",
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, statusFilter, searchQuery, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
    setSortBy("newest");
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-600">Betöltés...</div>;
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

      {/* Filters Section */}
      <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Keresés pozíció vagy cég neve alapján..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            Összes ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter("SUBMITTED")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "SUBMITTED"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            📤 Beküldve (
            {applications.filter((a) => a.status === "SUBMITTED").length})
          </button>
          <button
            onClick={() => setStatusFilter("ACCEPTED")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "ACCEPTED"
                ? "bg-green-600 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            ✅ Elfogadva (
            {applications.filter((a) => a.status === "ACCEPTED").length})
          </button>
          <button
            onClick={() => setStatusFilter("REJECTED")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "REJECTED"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            ❌ Elutasítva (
            {applications.filter((a) => a.status === "REJECTED").length})
          </button>
          <button
            onClick={() => setStatusFilter("NO_RESPONSE")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "NO_RESPONSE"
                ? "bg-gray-600 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            ⏳ Nincs válasz (
            {applications.filter((a) => a.status === "NO_RESPONSE").length})
          </button>
        </div>

        {/* Sort and Clear */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">
              Rendezés:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Legújabb először</option>
              <option value="oldest">Legrégebbi először</option>
              <option value="position-asc">Pozíció (A-Z)</option>
              <option value="position-desc">Pozíció (Z-A)</option>
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
          <span className="font-medium">{filteredApplications.length}</span>{" "}
          jelentkezés megjelenítve
          {filteredApplications.length !== applications.length && (
            <span className="text-slate-500">
              {" "}
              ({applications.length} összesen)
            </span>
          )}
        </div>
      </div>

      {/* No results message */}
      {filteredApplications.length === 0 && applications.length > 0 && (
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

      <div className="grid gap-4">
        {filteredApplications.map((app) => {
          const statusConfig =
            STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ||
            STATUS_CONFIG.SUBMITTED;
          let createdDate = "Ismeretlen dátum";
          try {
            const dateStr = app.submittedAt || app.createdAt;
            if (dateStr) {
              const date = new Date(dateStr);
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
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                  >
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  {app.status === "SUBMITTED" && (
                    <button
                      onClick={() => handleRetractClick(app.id)}
                      disabled={retractingId === app.id}
                      className="px-3 py-1 rounded-full text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {retractingId === app.id
                        ? "⏳ Törlés..."
                        : "🗑️ Visszavonás"}
                    </button>
                  )}
                </div>
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

      {/* Confirmation Dialog */}
      {confirmDialogId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Jelentkezés visszavonása
              </h3>
              <p className="text-sm text-slate-600">
                Biztosan visszavonod a jelentkezésedet? Ez a művelet nem vonható
                vissza.
              </p>
            </div>

            {retractError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {retractError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRetractCancel}
                disabled={retractingId !== null}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Mégse
              </button>
              <button
                onClick={handleRetractConfirm}
                disabled={retractingId !== null}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {retractingId ? "Törlés..." : "Visszavonás"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
