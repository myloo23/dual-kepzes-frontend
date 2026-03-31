import { MaterialStats } from "../../features/guide";

export default function HrGuidePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm text-center transition-colors">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 transition-colors">
          <span className="text-3xl">📚</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          Oktatási segédlet
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto transition-colors">
          Itt fogod megtalálni a részletes útmutatót az oldal használatához,
          tippeket az álláshirdetések kezeléséhez és a jelentkezők
          értékeléséhez.
        </p>

        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 px-4 py-2 text-sm text-blue-700 dark:text-blue-400 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Hamarosan elérhető
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Oktatási segédletek Statisztikája
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A hallgatók által elvégzett és értékelt modulok eredményei.
            </p>
          </div>
        </div>
        <MaterialStats />
      </div>

      <div className="grid gap-4 md:grid-cols-3 pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="text-2xl mb-2">📝</div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            Álláshirdetések
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Hogyan hozz létre hatékony álláshirdetéseket
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            Jelentkezők kezelése
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Hogyan értékeld és válaszd ki a legjobb jelölteket
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="text-2xl mb-2">🤝</div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            Partnerség
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Hogyan működj együtt az egyetemmel
          </p>
        </div>
      </div>
    </div>
  );
}
