import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { cn } from "../../utils/cn";

interface ExportButtonProps {
  onExport: () => void;
  label?: string;
  icon?: "csv" | "pdf" | "excel";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}

export default function ExportButton({
  onExport,
  label,
  icon = "csv",
  variant = "secondary",
  disabled = false,
  className,
}: ExportButtonProps) {
  const Icon =
    icon === "csv" ? FileText : icon === "excel" ? FileSpreadsheet : Download;

  const defaultLabel =
    icon === "csv"
      ? "Export CSV"
      : icon === "excel"
        ? "Excel export"
        : "Export PDF";

  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "primary" && [
          "bg-dkk-blue dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500",
          "focus:ring-blue-500",
          "disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed",
        ],
        variant === "secondary" && [
          "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
          "focus:ring-slate-500",
          "disabled:bg-slate-100 disabled:dark:bg-slate-900/50 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:dark:border-slate-800",
        ],
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label || defaultLabel}</span>
    </button>
  );
}
