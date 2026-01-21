// src/components/landing/LoginCard.tsx
import { Link } from "react-router-dom";
import PasswordInput from "../shared/PasswordInput";

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
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 px-6 py-7">
            <h2 className="text-xl font-semibold mb-1 text-slate-900">
                Belépés
            </h2>
            <p className="text-xs text-slate-500 mb-5">
                Válaszd ki a szerepköröd, és jelentkezz be a rendszerbe.
            </p>

            <form onSubmit={onSubmit} className="space-y-3 text-sm">
                {loginError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {loginError}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="font-medium text-slate-700">
                        E-mail cím
                    </label>
                    <input
                        type="email"
                        placeholder="pelda@uni.hu"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-dkk-blue focus:border-dkk-blue"
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

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <Link to="/forgot-password" className="text-sm text-dkk-blue hover:underline">
                    Elfelejtett jelszó?
                </Link>
                <span>Még nincs fiókod?</span>
                <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                    Regisztráció
                </Link>
            </div>
        </div>
    );
}
