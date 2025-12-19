import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) return setError("Hiányzó vagy érvénytelen token a linkben.");
    const pwErr = validatePassword(pw);
    if (pwErr) return setError(pwErr);
    if (pw !== pw2) return setError("A két jelszó nem egyezik.");

    setLoading(true);
    try {
      // Később: valós API
      // await fetch("/auth/reset-password", { method:"POST", headers:{...}, body: JSON.stringify({ token, newPassword: pw }) })

      console.log("RESET PASSWORD (mock):", { token, newPassword: pw });

      setOk(true);
      setTimeout(() => navigate("/"), 900);
    } catch {
      setError("Nem sikerült a jelszó módosítása. Lehet, hogy a token lejárt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Új jelszó beállítása</h1>
        <p className="text-sm text-slate-600">
          Add meg az új jelszót. A link tokenje alapján azonosítjuk a kérést.
        </p>
      </div>

      {ok ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Jelszó sikeresen módosítva! Átirányítás...
        </div>
      ) : (
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Új jelszó</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 12 karakter"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Új jelszó megerősítése</label>
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ugyanaz, mint fent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Mentés..." : "Jelszó mentése"}
          </button>

          <div className="text-center">
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
              Vissza a belépéshez
            </Link>
          </div>

          <div className="text-[11px] text-slate-500">
            Jelszó szabály: 12–64 karakter, kisbetű, nagybetű, szám és speciális karakter.
          </div>
        </form>
      )}
    </div>
  );
}
