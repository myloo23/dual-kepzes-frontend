// src/components/landing/LoginCard.tsx
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200 dark:border-slate-800 px-6 py-7 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-1 text-slate-900 dark:text-slate-50 transition-colors">
        Belépés
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 transition-colors">
        Válaszd ki a szerepköröd, és jelentkezz be a rendszerbe.
      </p>

      <form onSubmit={onSubmit} className="space-y-3 text-sm">
        {loginError && (
          <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400 transition-colors">
            {loginError}
          </div>
        )}

        <div className="space-y-1">
          <label className="font-medium text-slate-700 dark:text-slate-300 transition-colors">
            E-mail cím
          </label>
          <input
            type="email"
            placeholder="pelda@uni.hu"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-dkk-blue focus:border-dkk-blue transition-colors"
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
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-dkk-blue to-dkk-green px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Belépés..." : "Belépés"}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <Link
          to="/forgot-password"
          className="text-sm text-dkk-blue dark:text-blue-400 hover:underline transition-colors"
        >
          Elfelejtett jelszó?
        </Link>
        <span>Még nincs fiókod?</span>
        <Link
          to="/register"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          Regisztráció
        </Link>
      </div>
    </div>
  );
}
