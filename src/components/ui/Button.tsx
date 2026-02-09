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
  | "caution";

type ButtonSize = "xs" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 font-semibold",
  dark: "bg-slate-800 text-white hover:bg-slate-900 font-semibold shadow-sm",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium",
  outlineAccent:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium",
  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium",
  warning:
    "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium",
  danger:
    "border border-red-200 bg-white text-red-600 hover:bg-red-50 font-medium",
  caution:
    "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 font-medium",
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
