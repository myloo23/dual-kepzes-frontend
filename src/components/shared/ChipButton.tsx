// src/components/shared/ChipButton.tsx

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
                "rounded-full border px-3 py-1 text-[11px] transition-colors",
                active
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
        >
            {children}
        </button>
    );
}
