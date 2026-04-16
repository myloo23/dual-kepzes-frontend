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
      <label className="text-sm font-semibold text-nje-anthracite dark:text-slate-300 transition-colors">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-nje-anthracite/20 dark:border-slate-700 bg-nje-pearl/50 dark:bg-slate-800 px-4 py-2.5 pr-10 text-sm text-nje-anthracite dark:text-slate-100 placeholder-nje-anthracite/30 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nje-cyan focus:border-nje-cyan transition-colors"
        />

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-nje-anthracite/40 dark:text-slate-400 hover:text-nje-anthracite dark:hover:text-slate-300 transition-colors"
          aria-label={
            showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"
          }
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
