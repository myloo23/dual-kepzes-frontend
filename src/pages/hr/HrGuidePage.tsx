export default function HrGuidePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm text-center transition-colors">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 transition-colors">
          <span className="text-3xl">📚</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          Tananyag és útmutató
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

      <div className="grid gap-4 md:grid-cols-3">
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
