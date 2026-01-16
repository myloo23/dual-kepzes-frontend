// src/components/shared/PasswordInput.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
}

export default function PasswordInput({
    value,
    onChange,
    placeholder = "Minimum 12 karakter",
    label = "Jelszó *",
    required = true,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">{label}</label>

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}
