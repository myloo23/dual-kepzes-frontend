/**
 * Positions List Component
 * Displays filtered and sorted list of positions
 */

import type { Position } from "../../../lib/api";
import PositionCard from "./PositionCard";
import { pickLogo, norm } from "../utils/positions.utils";
import { LABELS } from "../../../constants";
import { resolveApiAssetUrl } from "../../../lib/media-url";

// Temporary logos (will be moved to assets management)
import abcTechLogo from "../../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../../assets/logos/business-it.jpg";

interface PositionsListProps {
  positions: Position[];
  onCompanyClick: (
    companyData:
      | { id?: string | number; name?: string; logoUrl?: string | null }
      | undefined,
  ) => void;
  onApply: (positionId: string | number) => void;
}

export default function PositionsList({
  positions,
  onCompanyClick,
  onApply,
}: PositionsListProps) {
  if (positions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center text-slate-600 dark:text-slate-400 transition-colors">
        {LABELS.NO_RESULTS}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
      {positions.map((p) => {
        const companyKey = norm(p.companyId ?? p.company?.name);
        const fallbackLogo = pickLogo(companyKey, {
          logo1: abcTechLogo,
          logo2: businessItLogo,
        });
        const logo = resolveApiAssetUrl(p.company?.logoUrl) ?? fallbackLogo;

        return (
          <PositionCard
            key={String(
              p.id ?? `${p.company?.name}-${p.title}-${p.location?.city}`,
            )}
            position={p}
            logo={logo}
            onCompanyClick={onCompanyClick}
            onApply={onApply}
          />
        );
      })}
    </div>
  );
}
