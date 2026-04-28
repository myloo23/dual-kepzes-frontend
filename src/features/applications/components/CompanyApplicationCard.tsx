import { type Application, type ApplicationStatus } from "../../../lib/api";

interface CompanyApplicationCardProps {
  application: Application;
  isExpanded: boolean;
  isLoadingExpand: boolean;
  isActionLoading: boolean;
  isDeleting: boolean;
  onToggleExpand: (id: string) => void;
  onDecision: (id: string, status: "ACCEPTED" | "REJECTED") => void;
  onDeleteClick: (id: string) => void;
}

const statusLabels: Record<ApplicationStatus, string> = {
  SUBMITTED: "Beküldve",
  ACCEPTED: "Elfogadva",
  REJECTED: "Elutasítva",
  NO_RESPONSE: "Nincs válasz",
};

export const CompanyApplicationCard = ({
  application: displayApp,
  isExpanded,
  isLoadingExpand,
  isActionLoading,
  isDeleting,
  onToggleExpand,
  onDecision,
  onDeleteClick,
}: CompanyApplicationCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="font-semibold text-lg text-slate-900 dark:text-slate-100 transition-colors">
            {displayApp.position?.title ?? "Pozíció"}
          </div>
          {displayApp.student && (
            <div className="flex flex-col text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300 transition-colors">
                {displayApp.student.fullName}
              </span>
              <span className="text-slate-500 dark:text-slate-400 transition-colors">
                {displayApp.student.email}
              </span>
            </div>
          )}
        </div>
        <div className="text-sm font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 transition-colors whitespace-nowrap">
          Státusz: {statusLabels[displayApp.status] ?? displayApp.status}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onToggleExpand(String(displayApp.id))}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-70 transition-colors"
          disabled={isLoadingExpand}
        >
          {isLoadingExpand
            ? "Betöltés..."
            : isExpanded
              ? "Bezárás"
              : "Megtekintés"}
        </button>
        {displayApp.status === "SUBMITTED" ||
        displayApp.status === "NO_RESPONSE" ? (
          <>
            <button
              onClick={() => onDecision(String(displayApp.id), "ACCEPTED")}
              disabled={isActionLoading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isActionLoading ? "Mentés..." : "Elfogadás"}
            </button>
            <button
              onClick={() => onDecision(String(displayApp.id), "REJECTED")}
              disabled={isActionLoading}
              className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-60 transition-colors"
            >
              Elutasítás
            </button>
            <button
              onClick={() => onDeleteClick(String(displayApp.id))}
              disabled={isDeleting}
              className="rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {isDeleting ? "Törlés..." : "🗑️ Törlés"}
            </button>
          </>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              displayApp.status === "ACCEPTED"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50"
            }`}
          >
            {displayApp.status === "ACCEPTED"
              ? "✅ Elfogadva"
              : "❌ Elutasítva"}
          </span>
        )}
      </div>
      {isExpanded && (
        <>
          {displayApp.student && (
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg transition-colors">
                  <span className="text-xl">👨‍🎓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">
                    Jelentkező részletes adatai
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    Személyes és tanulmányi információk
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Personal Info */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1 mb-2 transition-colors">
                    Személyes adatok
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Név:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.fullName}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Neptun kód:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit text-xs transition-colors">
                      {displayApp.student.studentProfile?.neptunCode ||
                        "Nincs megadva"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Email:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 break-all transition-colors">
                      {displayApp.student.email}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Telefon:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.phoneNumber}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Anyja neve:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.mothersName ||
                        "Nincs megadva"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Született:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {(() => {
                        const profile = displayApp.student.studentProfile;

                        // Check all possible locations for birth date
                        const birthDate =
                          profile?.birthDate ||
                          profile?.dateOfBirth ||
                          (profile as any)?.birth_date ||
                          (displayApp.student as any)?.birthDate ||
                          (displayApp.student as any)?.dateOfBirth;

                        return birthDate
                          ? new Date(birthDate).toLocaleDateString("hu-HU")
                          : "Nincs megadva";
                      })()}
                    </div>
                  </div>
                </div>

                {/* Location & Studies */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1 mb-2 transition-colors">
                    Lakcím és Tanulmányok
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Lakcím:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.location
                        ? `${displayApp.student.studentProfile.location.zipCode} ${displayApp.student.studentProfile.location.city}, ${displayApp.student.studentProfile.location.address}`
                        : "Nincs megadva"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Intézmény:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.highSchool ||
                        "Nincs megadva"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Szak:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.currentMajor ||
                        "Nincs megadva"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Tagozat:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.studyMode ===
                      "NAPPALI"
                        ? "Nappali"
                        : "Levelő"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Végzés éve:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.graduationYear ||
                        "Nincs megadva"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 transition-colors">
                      Nyelvvizsga:
                    </div>
                    <div className="col-span-2 font-medium text-slate-900 dark:text-slate-100 transition-colors">
                      {displayApp.student.studentProfile?.hasLanguageCert ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 transition-colors">
                          ✓ Van
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 transition-colors">
                          Nincs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!displayApp.student && (
            <div className="mt-4 text-sm text-slate-600">
              A jelentkező részletes adatai nem elérhetők.
            </div>
          )}
        </>
      )}
      {displayApp.companyNote && (
        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 transition-colors">
          Megjegyzés: {displayApp.companyNote}
        </div>
      )}
    </div>
  );
};
