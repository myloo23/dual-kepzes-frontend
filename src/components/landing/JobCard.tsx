// src/components/landing/JobCard.tsx
import { norm, formatHuDate, isExpired, toTagName } from "../../lib/positions-utils";

type Position = {
    id?: string | number;
    title?: string;
    description?: string;
    city?: string;
    zipCode?: string;
    address?: string;
    deadline?: string;
    tags?: any[];
    companyId?: string | number;
    company?: { id?: string | number; name?: string; logoUrl?: string | null };
    [key: string]: any;
};

interface JobCardProps {
    position: Position;
    onViewDetails: (positionId: string | number) => void;
}

export default function JobCard({ position: p, onViewDetails }: JobCardProps) {
    const companyName = norm(p.company?.name) || "Ismeretlen cég";
    const title = norm(p.title) || "Névtelen pozíció";
    const cityText = norm(p.city) || "—";
    const deadlineText = formatHuDate(p.deadline);

    const tags = (Array.isArray(p.tags) ? p.tags : [])
        .map((t) => norm(toTagName(t)))
        .filter(Boolean);

    const previewTags = tags.slice(0, 3);
    const expired = isExpired(p.deadline);

    // Truncate description to ~100 characters
    const description = norm(p.description);
    const shortDescription = description
        ? description.length > 100
            ? description.slice(0, 100) + "…"
            : description
        : "";

    // Company logo with fallback
    const logoUrl = p.company?.logoUrl || "https://via.placeholder.com/80?text=Logo";

    return (
        <article className="h-full rounded-xl border border-dkk-gray/30 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
            {/* Header with company logo */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                            src={logoUrl}
                            alt={`${companyName} logó`}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 truncate">{companyName}</p>
                        <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate group-hover:text-dkk-blue transition">
                            {title}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                    <span>📍</span>
                    <span>{cityText}</span>
                </div>

                {/* Description */}
                {shortDescription && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                        {shortDescription}
                    </p>
                )}

                {/* Tags */}
                {previewTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {previewTags.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center rounded-full bg-dkk-green/10 px-2 py-0.5 text-[10px] font-medium text-dkk-green"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Deadline */}
                <div
                    className={[
                        "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium",
                        expired
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-800",
                    ].join(" ")}
                >
                    ⏳ {deadlineText}
                </div>
            </div>

            {/* CTA Button */}
            <div className="p-4 pt-0">
                <button
                    type="button"
                    onClick={() => {
                        if (p.id) {
                            onViewDetails(p.id);
                        }
                    }}
                    disabled={expired}
                    className="w-full rounded-lg bg-dkk-green px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-dkk-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {expired ? "Lejárt" : "Részletek"}
                </button>
            </div>
        </article>
    );
}
