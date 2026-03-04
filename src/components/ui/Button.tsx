import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant =
  | "primary"
  | "dark"
  | "outline"
  | "outlineAccent"
  | "success"
  | "warning"
  | "danger"
  | "caution"
  | "ghost";

type ButtonSize = "xs" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 font-semibold",
  dark: "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 font-semibold shadow-sm",
  outline:
    "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium",
  outlineAccent:
    "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 font-medium",
  success:
    "border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium",
  warning:
    "border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-medium",
  danger:
    "border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium",
  caution:
    "border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium",
  ghost:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium border-transparent",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "outline",
  size = "xs",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg transition",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
