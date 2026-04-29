import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Elfelejtett jelszó
        </h1>
      </div>

      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-400 transition-colors">
        A jelszó-visszaállítás jelenleg nem érhető el.
        <div className="mt-3">
          <Link
            to="/"
            className="text-amber-900 dark:text-amber-300 underline transition-colors"
          >
            Vissza a belépéshez
          </Link>
        </div>
      </div>
    </div>
  );
}
