// src/components/positions/PositionCard.tsx
import { formatHuDate, isExpired, toTagName, norm } from "../utils/positions.utils";

type Position = {
    id?: string | number;
    title?: string;
    description?: string;
    location?: { city?: string; zipCode?: string | number; address?: string };
    deadline?: string;
    tags?: any[];
    companyId?: string | number;
    company?: { id?: string | number; name?: string; locations?: Array<{ city?: string }> };
    [key: string]: any;
};

interface PositionCardProps {
    position: Position;
    logo: string;
    onCompanyClick: (company: any) => void;
    onApply?: (positionId: string | number) => void;
    hideCompanyInfo?: boolean;
}

export default function PositionCard({ position: p, logo, onCompanyClick, onApply, hideCompanyInfo }: PositionCardProps) {
    const companyName = norm(p.company?.name) || "Ismeretlen cég";
    const title = norm(p.title) || "Névtelen pozíció";
    const cityText = norm(p.location?.city) || "—";
    const deadlineText = formatHuDate(p.deadline);

    const tags = (Array.isArray(p.tags) ? p.tags : [])
        .map((t) => norm(toTagName(t)))
        .filter(Boolean);

    const previewTags = tags.slice(0, 6);
    const hiddenCount = tags.length - previewTags.length;

    const expired = isExpired(p.deadline);

    return (
        <article
            key={String(p.id ?? `${companyName}-${title}-${cityText}`)}
            className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            <div className="p-5 flex-grow">
                {/* felső sor */}
                <div className="flex items-start gap-4">
                    {!hideCompanyInfo && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const companyData = {
                                    ...p.company,
                                    id: p.company?.id ?? p.companyId,
                                    name: companyName
                                };
                                console.log("🖱️ Logo clicked! company data:", companyData);
                                onCompanyClick(companyData);
                            }}
                            className="h-20 w-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                            title={`${companyName} információi`}
                        >
                            <img 
                                src={logo} 
                                alt={`${companyName} logó`} 
                                className="h-full w-full object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                        </button>
                    )}

                    <div className="min-w-0">
                        <div className="text-xs text-slate-500 mb-1">
                            {!hideCompanyInfo && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const companyData = {
                                                ...p.company,
                                                id: p.company?.id ?? p.companyId,
                                                name: companyName
                                            };
                                            console.log("🖱️ Company name clicked! company data:", companyData);
                                            onCompanyClick(companyData);
                                        }}
                                        className="hover:text-blue-600 hover:underline transition cursor-pointer"
                                        title={`${companyName} információi`}
                                    >
                                        {companyName}
                                    </button>
                                    {" • "}
                                </>
                            )}
                            {cityText}
                        </div>

                        <h3 className="text-base font-semibold text-slate-900 leading-snug break-words">
                            {title}
                        </h3>
                    </div>
                </div>

                {/* meta chip sor */}
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                        📍 {cityText}
                    </span>

                    <span
                        className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
                            expired
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-800",
                        ].join(" ")}
                    >
                        ⏳ Határidő: {deadlineText}
                    </span>
                </div>

                {/* tagek */}
                {previewTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {previewTags.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                            >
                                {t}
                            </span>
                        ))}
                        {hiddenCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                +{hiddenCount}
                            </span>
                        )}
                    </div>
                )}

                {/* leírás */}
                {norm(p.description) && (
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                        {String(p.description).length > 140
                            ? String(p.description).slice(0, 140) + "…"
                            : String(p.description)}
                    </p>
                )}

                {/* alsó meta */}
                <div className="mt-4 space-y-1 text-xs text-slate-600">
                    {norm(p.location?.address) && (
                        <div>📌 {norm(p.location?.address)}</div>
                    )}
                    {(norm(p.location?.zipCode) || norm(p.location?.city)) && (
                        <div>🏷️ {norm(p.location?.zipCode)} {norm(p.location?.city)}</div>
                    )}
                </div>

            </div>
            {/* CTA */}
            <div className="p-5 pt-0">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onApply && p.id) {
                            onApply(p.id);
                        }
                    }}
                    disabled={expired || !onApply}
                    className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {expired ? "Lejárt" : "Jelentkezés"}
                </button>
            </div>
        </article>
    );
}
