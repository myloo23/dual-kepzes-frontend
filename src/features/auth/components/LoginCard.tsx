import { Link } from "react-router-dom";
import PasswordInput from "../../../components/shared/PasswordInput";

interface LoginCardProps {
  email: string;
  password: string;
  loginError: string | null;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginCard({
  email,
  password,
  loginError,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-nje-anthracite/10 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Top brand accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-nje-jaffa via-nje-amethyst to-nje-cyan" />

      <div className="px-7 py-8">
        <h2 className="text-2xl font-bold mb-1 text-nje-anthracite dark:text-slate-50">
          Belépés
        </h2>
        <p className="text-sm text-nje-anthracite/50 dark:text-slate-400 mb-6">
          Válaszd ki a szerepköröd, és jelentkezz be a rendszerbe.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          {loginError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {loginError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-nje-anthracite dark:text-slate-300">
              E-mail cím
            </label>
            <input
              type="email"
              placeholder="pelda@uni.hu"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="w-full rounded-xl border border-nje-anthracite/20 dark:border-slate-700 bg-nje-pearl/50 dark:bg-slate-800 px-4 py-2.5 text-sm text-nje-anthracite dark:text-slate-100 placeholder-nje-anthracite/30 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nje-cyan focus:border-nje-cyan transition-colors"
            />
          </div>

          <PasswordInput
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            label="Jelszó"
            placeholder="••••••••"
            required={true}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-nje-jaffa to-nje-amethyst px-4 py-3 text-sm font-bold text-white shadow-jaffa hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Belépés..." : "Belépés"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs text-nje-anthracite/50 dark:text-slate-400">
          <Link
            to="/forgot-password"
            className="text-sm text-nje-cyan dark:text-nje-cyan-light hover:underline"
          >
            Elfelejtett jelszó?
          </Link>
          <span>Még nincs fiókod?</span>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl border border-nje-anthracite/20 dark:border-slate-700 bg-nje-pearl dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-nje-anthracite dark:text-slate-100 hover:bg-nje-pearl-dark dark:hover:bg-slate-700 transition"
          >
            Regisztráció
          </Link>
        </div>
      </div>
    </div>
  );
}
