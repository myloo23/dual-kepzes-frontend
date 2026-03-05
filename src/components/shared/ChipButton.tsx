// src/components/shared/ChipButton.tsx

interface ChipButtonProps {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}

export default function ChipButton({
  active,
  children,
  onClick,
  title,
}: ChipButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-[11px] transition-colors",
        active
          ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
