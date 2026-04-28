import { useState } from "react";
import { Link } from "react-router-dom";



export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("A jelszó-visszaállítás jelenleg nem érhető el.");
  };

  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Elfelejtett jelszó
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Add meg az email címed. Ha létezik fiók, küldünk egy
          jelszó-visszaállító linket.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none space-y-3 transition-colors"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
              error
                ? "border-red-300 dark:border-red-700/50 focus:ring-red-500"
                : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
            }`}
            placeholder="pl. pelda@uni.hu"
            type="email"
          />
          {error && (
            <div className="text-xs text-red-600 dark:text-red-400 transition-colors">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 dark:bg-blue-600/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-60 transition-colors"
        >
          Visszaállító link küldése
        </button>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Mégsem, vissza a belépéshez
          </Link>
        </div>
      </form>
    </div>
  );
}
