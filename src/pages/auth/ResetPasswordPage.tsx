import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function validatePassword(pw: string) {
  if (pw.length < 12) return "A jelszó legalább 12 karakter legyen.";
  if (pw.length > 64) return "A jelszó maximum 64 karakter lehet.";
  if (!/[a-z]/.test(pw)) return "Legyen benne kisbetű.";
  if (!/[A-Z]/.test(pw)) return "Legyen benne nagybetű.";
  if (!/[0-9]/.test(pw)) return "Legyen benne szám.";
  if (!/[^\w\s]/.test(pw)) return "Legyen benne speciális karakter (pl. !@#).";
  return null;
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) return setError("Hiányzó vagy érvénytelen token a linkben.");
    const pwErr = validatePassword(pw);
    if (pwErr) return setError(pwErr);
    if (pw !== pw2) return setError("A két jelszó nem egyezik.");

    setError("Az új jelszó beállítása jelenleg nem érhető el.");
  };

  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Új jelszó beállítása
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Add meg az új jelszót. A link tokenje alapján azonosítjuk a kérést.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none space-y-3 transition-colors"
      >
          {error && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Új jelszó
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Minimum 12 karakter"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Új jelszó megerősítése
            </label>
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Ugyanaz, mint fent"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 dark:bg-blue-600/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-60 transition-colors"
          >
            Jelszó mentése
          </button>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Vissza a belépéshez
            </Link>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
            Jelszó szabály: 12–64 karakter, kisbetű, nagybetű, szám és speciális
            karakter.
          </div>
        </form>
    </div>
  );
}
