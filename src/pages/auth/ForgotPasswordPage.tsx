import { useState } from "react";
import { Link } from "react-router-dom";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Add meg az email címed.");
    if (!isValidEmail(email)) return setError("Érvénytelen email formátum.");

    setLoading(true);

    try {
      // Később: valós API
      // await fetch("/auth/forgot-password", { method:"POST", headers:{...}, body: JSON.stringify({ email }) })

      console.log("FORGOT PASSWORD (mock):", { email: email.trim() });

      // Biztonság: mindig ugyanazt mutatjuk
      setSent(true);
    } catch {
      // akkor se áruljuk el, hogy létezik-e email
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Elfelejtett jelszó
        </h1>
        <p className="text-sm text-slate-600">
          Add meg az email címed. Ha létezik fiók, küldünk egy
          jelszó-visszaállító linket.
        </p>
      </div>

      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Ha a megadott email címmel létezik fiók, elküldtük a visszaállító
          linket.
          <div className="mt-3">
            <Link to="/" className="text-emerald-900 underline">
              Vissza a belépéshez
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-300 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
              }`}
              placeholder="pl. pelda@uni.hu"
              type="email"
            />
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Küldés..." : "Visszaállító link küldése"}
          </button>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Mégsem, vissza a belépéshez
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
