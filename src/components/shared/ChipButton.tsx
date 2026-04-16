interface ChipButtonProps {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}

export default function ChipButton({ active, children, onClick, title }: ChipButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
        active
          ? "border-nje-jaffa bg-nje-jaffa-faint dark:bg-nje-jaffa/20 text-nje-jaffa-dark dark:text-nje-jaffa"
          : "border-nje-anthracite/20 dark:border-slate-700 bg-white dark:bg-slate-900 text-nje-anthracite/70 dark:text-slate-300 hover:border-nje-jaffa/40 hover:text-nje-jaffa dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
