import { useEffect, useState, useMemo } from "react";
import {
  api,
  type Application,
  type ApplicationStatus,
  type StudentApplicationStats,
} from "../../../lib/api";

const STATUS_CONFIG = {
  SUBMITTED: {
    label: "Beküldve",
    color:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
    icon: "📤",
  },
  ACCEPTED: {
    label: "Elfogadva",
    color:
      "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50",
    icon: "✅",
  },
  REJECTED: {
    label: "Betöltött pozíció",
    color:
      "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50",
    icon: "❌",
  },
  NO_RESPONSE: {
    label: "Nincs válasz",
    color:
      "bg-gray-100 dark:bg-gray-800/40 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700/50",
    icon: "⏳",
  },
};

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationStats, setApplicationStats] = useState<StudentApplicationStats>({
    submitted: 0,
    accepted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retractingId, setRetractingId] = useState<string | null>(null);
  const [confirmDialogId, setConfirmDialogId] = useState<string | null>(null);
  const [retractError, setRetractError] = useState<string | null>(null);

  // ... (previous code)

  // Status Filter, Search, Sort states...
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "position-asc" | "position-desc"
  >("newest");

  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(5);

  // ... (load useEffect)

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(5);
  }, [statusFilter, searchQuery, sortBy]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.applications.listWithStats();
        setApplications(data.applications);
        setApplicationStats(data.stats);
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
      const removed = applications.find((app) => app.id === confirmDialogId);
      setApplications((prev) =>
        prev.filter((app) => app.id !== confirmDialogId),
      );
      if (removed) {
        setApplicationStats((prev) => ({
          submitted:
            removed.status === "SUBMITTED"
              ? Math.max(0, prev.submitted - 1)
              : prev.submitted,
          accepted:
            removed.status === "ACCEPTED"
              ? Math.max(0, prev.accepted - 1)
              : prev.accepted,
        }));
      }
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

  const visibleApplications = filteredApplications.slice(0, visibleCount);
  const hasMore = visibleCount < filteredApplications.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-600 dark:text-slate-400">
        Betöltés...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Még nincs jelentkezésed
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Böngészd az elérhető pozíciókat és jelentkezz az első állásodra!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Jelentkezéseim ({applications.length})
        </h2>
      </div>

      {/* Filters Section (unchanged) */}
      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* ... (search input) ... */}
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400 dark:text-slate-500">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Keresés pozíció vagy cég neve alapján..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {/* ... (buttons unchanged) ... */}
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Összes ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter("SUBMITTED")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "SUBMITTED"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            📤 Beküldve (
            {applicationStats.submitted})
          </button>
          <button
            onClick={() => setStatusFilter("ACCEPTED")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "ACCEPTED"
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            ✅ Elfogadva (
            {applicationStats.accepted})
          </button>
          <button
            onClick={() => setStatusFilter("REJECTED")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "REJECTED"
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            ❌ Betöltött pozíció (
            {applications.filter((a) => a.status === "REJECTED").length})
          </button>
          <button
            onClick={() => setStatusFilter("NO_RESPONSE")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "NO_RESPONSE"
                ? "bg-gray-600 text-white relative isolate overflow-hidden after:absolute after:inset-0 after:bg-white/10 dark:after:bg-black/10 after:-z-10"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            ⏳ Nincs válasz (
            {applications.filter((a) => a.status === "NO_RESPONSE").length})
          </button>
        </div>

        {/* Sort and Clear */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Rendezés:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
        <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {filteredApplications.length}
          </span>{" "}
          jelentkezés megjelenítve
          {filteredApplications.length !== applications.length && (
            <span className="text-slate-500 dark:text-slate-500">
              {" "}
              ({applications.length} összesen)
            </span>
          )}
        </div>
      </div>

      {/* No results message (unchanged) */}
      {filteredApplications.length === 0 && applications.length > 0 && (
        <div className="text-center py-10 transition-colors">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
            Nincs találat
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 transition-colors">
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

      {/* List */}
      <div className="grid gap-4">
        {visibleApplications.map((app) => {
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
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
                    {app.position?.title || "Pozíció"}
                  </h3>
                  {app.position?.company && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                      {app.position.company.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${statusConfig.color}`}
                  >
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  {app.status === "SUBMITTED" && (
                    <button
                      onClick={() => handleRetractClick(app.id)}
                      disabled={retractingId === app.id}
                      className="px-3 py-1 rounded-full text-xs font-medium border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {retractingId === app.id
                        ? "⏳ Törlés..."
                        : "🗑️ Visszavonás"}
                    </button>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-slate-500 dark:text-slate-500 mb-3 transition-colors">
                Jelentkezés dátuma: {createdDate}
              </div>

              {/* Student Note */}
              {app.studentNote && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3 mb-3 transition-colors">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                    Motivációs levél:
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap transition-colors">
                    {app.studentNote}
                  </p>
                </div>
              )}

              {/* Company Response */}
              {app.companyNote && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-3 transition-colors">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1 transition-colors">
                    Cég válasza:
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap transition-colors">
                    {app.companyNote}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 pt-4">
        {hasMore && (
          <button
            onClick={handleShowMore}
            className="px-6 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none"
          >
            Mutass többet ({filteredApplications.length - visibleCount})
          </button>
        )}
        {visibleCount > 5 && (
          <button
            onClick={handleShowLess}
            className="px-6 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none"
          >
            Kevesebb mutatása
          </button>
        )}
      </div>

      {/* Confirmation Dialog (unchanged) */}
      {confirmDialogId && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-transparent dark:border-slate-800 transition-colors">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
                Jelentkezés visszavonása
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                Biztosan visszavonod a jelentkezésedet? Ez a művelet nem vonható
                vissza.
              </p>
            </div>

            {retractError && (
              <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
                {retractError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRetractCancel}
                disabled={retractingId !== null}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Mégse
              </button>
              <button
                onClick={handleRetractConfirm}
                disabled={retractingId !== null}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 border border-transparent dark:border-red-700 text-white font-medium hover:bg-red-700 dark:hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
