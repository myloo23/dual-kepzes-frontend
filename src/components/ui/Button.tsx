import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
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
  // Jaffa orange — primary CTA (NJE brand)
  primary:
    "bg-nje-jaffa text-white hover:bg-nje-jaffa-dark font-semibold shadow-jaffa",
  // Amethyst — secondary accent
  secondary:
    "bg-nje-amethyst text-white hover:bg-nje-amethyst-dark font-semibold shadow-amethyst",
  dark:
    "bg-nje-anthracite text-white hover:bg-nje-anthracite-dark dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 font-semibold shadow-sm",
  outline:
    "border border-nje-anthracite/20 dark:border-slate-700 bg-white dark:bg-slate-800 text-nje-anthracite dark:text-slate-300 hover:bg-nje-pearl dark:hover:bg-slate-700 font-medium",
  outlineAccent:
    "border border-nje-cyan/40 dark:border-nje-cyan/30 bg-white dark:bg-slate-800 text-nje-anthracite dark:text-slate-300 hover:bg-nje-cyan-faint dark:hover:bg-slate-700 hover:text-nje-cyan dark:hover:text-nje-cyan font-medium",
  success:
    "border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-medium",
  warning:
    "border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-medium",
  danger:
    "border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium",
  caution:
    "border border-nje-jaffa/30 dark:border-nje-jaffa/20 bg-white dark:bg-slate-800 text-nje-jaffa dark:text-nje-jaffa-light hover:bg-nje-jaffa-faint dark:hover:bg-nje-jaffa/10 font-medium",
  ghost:
    "bg-transparent hover:bg-nje-anthracite/5 dark:hover:bg-slate-800 text-nje-anthracite dark:text-slate-400 font-medium border-transparent",
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
