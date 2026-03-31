export default function UniversityGuidePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm dark:shadow-none text-center transition-colors">
        <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 transition-colors">
          <span className="text-3xl">G</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          Oktatási segédlet
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto transition-colors">
          Itt fogod megtalálni a részletes útmutatót az oldal használatához, a
          hallgatók nyomon követéséhez és a partnerkapcsolatok kezeléséhez.
        </p>

        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 px-4 py-2 text-sm text-blue-700 dark:text-blue-400 transition-colors">
          <svg
            className="h-5 w-5"
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

      <div className="grid gap-4 md:grid-cols-3 pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="text-2xl mb-2">A</div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            Hallgatók kezelése
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Hogyan kövesd nyomon a hallgatók előrehaladását.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="text-2xl mb-2">B</div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            Partnerkapcsolatok
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Hogyan kezeld a cégekkel való együttműködést.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
          <div className="text-2xl mb-2">C</div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 transition-colors">
            Folyamatok
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Gyors áttekintés a napi egyetemi adminisztrációs lépésekről.
          </p>
        </div>
      </div>
    </div>
  );
}
