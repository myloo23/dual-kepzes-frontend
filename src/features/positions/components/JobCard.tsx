import {
  formatHuDate,
  toTagName,
  isExpired,
  norm,
  pickLogo,
} from "../utils/positions.utils";
import type { Position, Tag } from "../../../types/api.types";
import { resolveApiAssetUrl } from "../../../lib/media-url";
import abcTechLogo from "../../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../../assets/logos/business-it.jpg";

interface JobCardProps {
  position: Position;
  onViewDetails: (positionId: string | number) => void;
}

export default function JobCard({ position: p, onViewDetails }: JobCardProps) {
  const companyName = norm(p.company?.name) || "Ismeretlen cég";
  const title = norm(p.title) || "Névtelen pozíció";
  const cityText = norm(p.location?.city) || "—";
  const deadlineText = formatHuDate(p.deadline);
  const majorName = norm(p.major?.name);

  const tags = (Array.isArray(p.tags) ? p.tags : [])
    .map((t: Tag) => norm(toTagName(t)))
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

  const fallbackLogo = pickLogo(companyName, {
    logo1: abcTechLogo,
    logo2: businessItLogo,
  });
  const logoUrl = resolveApiAssetUrl(p.company?.logoUrl) ?? fallbackLogo;

  return (
    <article className="h-full rounded-xl border border-dkk-gray/30 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Header with company logo */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors">
            <img
              src={logoUrl}
              alt={`${companyName} logó`}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
              {companyName}
            </p>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate group-hover:text-dkk-blue dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            {majorName && (
              <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mt-0.5 truncate uppercase tracking-wide transition-colors">
                {majorName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3 transition-colors">
          <span>📍</span>
          <span>{cityText}</span>
        </div>

        {/* Description */}
        {shortDescription && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-3 transition-colors">
            {shortDescription}
          </p>
        )}

        {/* Tags */}
        {previewTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {previewTags.map((t: string) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-dkk-green/10 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-medium text-dkk-green dark:text-green-400 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Deadline */}
        <div
          className={[
            "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium transition-colors",
            expired
              ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
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
          className="w-full rounded-lg bg-dkk-green dark:bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-dkk-green/90 dark:hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {expired ? "Lejárt" : "Részletek"}
        </button>
      </div>
    </article>
  );
}
