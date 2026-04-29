import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { isValidEmail } from "../../utils/validation-utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Az e-mail cím megadása kötelező.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Érvénytelen e-mail cím formátum.");
      return;
    }

    setLoading(true);
    try {
      await api.requestPasswordReset({ email: email.trim() });
      setSuccess(true);
    } catch {
      setError(
        "Nem sikerült elküldeni a jelszó-visszaállítási kérelmet. Ellenőrizd az e-mail címet.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Elfelejtett jelszó
        </h1>
        <p className="mt-1 text-sm text-nje-anthracite/60 dark:text-slate-400">
          Add meg az e-mail címed, és elküldjük a visszaállítási linket.
        </p>
      </div>

      {success ? (
        <div className="rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-400 transition-colors">
          Ha az e-mail cím létezik a rendszerben, elküldtük a jelszó-visszaállítási linket.
          <div className="mt-3">
            <Link
              to="/"
              className="text-green-800 dark:text-green-300 underline transition-colors"
            >
              Vissza a belépéshez
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-nje-anthracite dark:text-slate-300">
              E-mail cím
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pelda@uni.hu"
              className="w-full rounded-xl border border-nje-anthracite/20 dark:border-slate-700 bg-nje-pearl/50 dark:bg-slate-800 px-4 py-2.5 text-sm text-nje-anthracite dark:text-slate-100 placeholder-nje-anthracite/30 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nje-cyan focus:border-nje-cyan transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-nje-jaffa to-nje-amethyst px-4 py-3 text-sm font-bold text-white shadow-jaffa hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Küldés..." : "Visszaállítási link küldése"}
          </button>

          <div className="text-sm text-center">
            <Link to="/" className="text-nje-cyan dark:text-nje-cyan hover:underline">
              Vissza a belépéshez
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
