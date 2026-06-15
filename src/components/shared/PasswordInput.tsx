import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  showRequirements?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Minimum 12 karakter",
  label = "Jelszó *",
  required = true,
  showRequirements = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const requirements = [
    { label: "Legalább 12 karakter", met: value.length >= 12 },
    { label: "Kisbetű (a-z)", met: /[a-z]/.test(value) },
    { label: "Nagybetű (A-Z)", met: /[A-Z]/.test(value) },
    { label: "Szám (0-9)", met: /[0-9]/.test(value) },
    { label: "Speciális karakter (#?!@$%^&*.-)", met: /[#?!@$%^&*.-]/.test(value) },
  ];

  return (
    <div className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <label
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="text-sm font-semibold text-nje-anthracite dark:text-slate-300 transition-colors cursor-help flex items-center gap-1.5 select-none"
        >
          {label}
          {showRequirements && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-bold transition-colors">
              i
            </span>
          )}
        </label>
      </div>

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

      {showRequirements && isHovered && (
        <div className="absolute left-0 top-full mt-2.5 z-50 w-72 text-xs grid grid-cols-1 gap-1.5 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">
            Jelszó követelmények:
          </p>
          {requirements.map((req, index) => (
            <div
              key={index}
              className={`flex items-center gap-1.5 transition-colors duration-200 ${
                req.met
                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                  : value
                  ? "text-rose-500 dark:text-rose-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <span className="text-sm leading-none">{req.met ? "✓" : "○"}</span>
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
