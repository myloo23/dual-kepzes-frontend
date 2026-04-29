import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { validatePassword } from "../../utils/validation-utils";
import PasswordInput from "../../components/shared/PasswordInput";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token =
    searchParams.get("token") ??
    searchParams.get("code") ??
    searchParams.get("resetToken") ??
    "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
            Új jelszó beállítása
          </h1>
        </div>
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 transition-colors">
          Hiányzó vagy érvénytelen jelszó-visszaállítási kód.
          <div className="mt-3">
            <Link
              to="/forgot-password"
              className="text-red-800 dark:text-red-300 underline transition-colors"
            >
              Új visszaállítási link kérése
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!newPassword) {
      setError("Az új jelszó megadása kötelező.");
      return;
    }
    if (!confirmPassword) {
      setError("A jelszó megerősítése kötelező.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("A két jelszó nem egyezik meg.");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ token, newPassword });
      setSuccess(true);
    } catch {
      setError(
        "A jelszó módosítása nem sikerült. A kód lejárt vagy érvénytelen.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Új jelszó beállítása
        </h1>
        <p className="mt-1 text-sm text-nje-anthracite/60 dark:text-slate-400">
          Add meg az új jelszavadat (minimum 12 karakter).
        </p>
      </div>

      {success ? (
        <div className="rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-400 transition-colors">
          A jelszó sikeresen módosítva.
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

          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="Új jelszó *"
            placeholder="Minimum 12 karakter"
          />

          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Jelszó megerősítése *"
            placeholder="Ismételd meg a jelszót"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-nje-jaffa to-nje-amethyst px-4 py-3 text-sm font-bold text-white shadow-jaffa hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Mentés..." : "Jelszó módosítása"}
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
