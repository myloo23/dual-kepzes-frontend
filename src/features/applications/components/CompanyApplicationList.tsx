import { useCompanyApplications } from "../hooks/useCompanyApplications";
import { CompanyApplicationCard } from "./CompanyApplicationCard";
import { Modal } from "../../../components/ui/Modal";

export default function CompanyApplicationList() {
  const {
    applications,
    filteredApplications,
    loading,
    error,
    actionError,
    actionId,
    expandedId,
    deleteConfirmId,
    deletingId,
    deleteError,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    handleApplicationDecision,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    toggleExpand,
    clearFilters,
    getDisplayApplication,
  } = useCompanyApplications();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
          Jelentkezések
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          A céghez beérkezett jelentkezések.
        </p>
      </div>

      {/* Filters Section */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Összes ({applications.length})
            </button>
            <button
              onClick={() => setStatusFilter("SUBMITTED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "SUBMITTED"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "student-asc" | "student-desc" | "position-asc")}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Szűrők törlése
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
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
      )}

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
      {actionError && (
        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
          {actionError}
        </div>
      )}
      {!loading && !error && applications.length === 0 && (
        <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Nincs megjeleníthető jelentkezés.
        </div>
      )}

      {/* No results message */}
      {!loading &&
        filteredApplications.length === 0 &&
        applications.length > 0 && (
          <div className="text-center py-10">
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

      <div className="grid gap-3">
        {filteredApplications.map((app) => (
          <CompanyApplicationCard
            key={String(app.id)}
            application={getDisplayApplication(app)}
            isExpanded={expandedId === String(app.id)}
            isLoadingExpand={false}
            isActionLoading={actionId === String(app.id)}
            isDeleting={deletingId === String(app.id)}
            onToggleExpand={toggleExpand}
            onDecision={handleApplicationDecision}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={handleDeleteCancel}
        title="Jelentkezés törlése"
        size="sm"
      >
        {(() => {
          const app = applications.find(
            (a) => String(a.id) === deleteConfirmId,
          );
          const isAccepted = app?.status === "ACCEPTED";
          return (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">⚠️</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                  {isAccepted
                    ? "Biztosan törlöd ezt az elfogadott jelentkezést? Ez megszakítja a duális partnerséget is."
                    : "Biztosan törlöd ezt a jelentkezést? Ez a művelet nem vonható vissza."}
                </p>
              </div>

              {deleteError && (
                <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            </>
          );
        })()}
      </Modal>
    </div>
  );
}
