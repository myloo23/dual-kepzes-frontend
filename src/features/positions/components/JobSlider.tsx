import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "./JobCard";
import { api } from "../../../lib/api";
import type { Position } from "../../../types/api.types";
import { companyApi } from "../../companies/services/companyApi";
import { resolveApiAssetUrl } from "../../../lib/media-url";
import { fetchPrimaryCompanyImageMap } from "../../companies/utils/companyImageLogo";

interface JobSliderProps {
  onViewDetails: (positionId: string | number) => void;
}

export default function JobSlider({ onViewDetails }: JobSliderProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Fetch non-dual positions
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const [positionsRes, companies] = await Promise.all([
          api.positions.listPublic({ limit: 1000 }),
          companyApi.list({ limit: 1000 }).catch(() => []),
        ]);
        const companyById = new Map(companies.map((c) => [String(c.id), c]));
        const companyByName = new Map(
          companies.map((c) => [c.name.trim().toLowerCase(), c]),
        );
        const rows = Array.isArray(positionsRes) ? positionsRes : [];
        const requiredCompanyIds = new Set<string>();

        rows.forEach((position) => {
          const companyId = String(position.company?.id ?? position.companyId ?? "").trim();
          const companyName = String(position.company?.name ?? "").trim().toLowerCase();
          const matchedCompany =
            companyById.get(companyId) ||
            (companyName ? companyByName.get(companyName) : undefined);

          if (companyId) requiredCompanyIds.add(companyId);
          if (matchedCompany?.id) requiredCompanyIds.add(String(matchedCompany.id));
        });

        const primaryCompanyImageById = await fetchPrimaryCompanyImageMap(
          Array.from(requiredCompanyIds),
        );

        const allPositions = rows.map((position) => {
            const companyId = String(position.company?.id ?? position.companyId ?? "");
            const positionCompanyName = String(position.company?.name ?? "")
              .trim()
              .toLowerCase();
            const matchedCompany =
              companyById.get(companyId) ||
              (positionCompanyName
                ? companyByName.get(positionCompanyName)
                : undefined);
            const resolvedCompanyId = String(
              position.company?.id ?? position.companyId ?? matchedCompany?.id ?? "",
            ).trim();
            const logoUrl =
              (resolvedCompanyId
                ? primaryCompanyImageById.get(resolvedCompanyId)
                : undefined) ??
              resolveApiAssetUrl(position.company?.logoUrl) ??
              matchedCompany?.logoUrl ??
              null;

            if (!position.company && matchedCompany) {
              return {
                ...position,
                company: {
                  id: matchedCompany.id,
                  name: matchedCompany.name,
                  logoUrl,
                  locations: matchedCompany.locations ?? [],
                  website: matchedCompany.website ?? null,
                  hasOwnApplication: matchedCompany.hasOwnApplication ?? false,
                },
              };
            }

            return {
              ...position,
              company: position.company
                ? {
                    ...position.company,
                    id:
                      position.company.id ??
                      position.companyId ??
                      matchedCompany?.id,
                    logoUrl,
                  }
                : position.company,
            };
          });

        // Show only REGULAR_WORK active positions on the landing page slider
        const regularPositions = allPositions.filter(
          (p) => p.type === "REGULAR_WORK" && p.isActive !== false,
        );

        setPositions(regularPositions);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3); // Desktop
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2); // Tablet
      } else {
        setItemsPerPage(1); // Mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(positions.length / itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalPages - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const visiblePositions = positions.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dkk-blue"></div>
      </div>
    );
  }

  // Empty state
  if (positions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
          Jelenleg nincsenek elérhető állásajánlatok.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="grid gap-4 transition-all duration-500 ease-in-out"
          style={{
            gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
          }}
        >
          {visiblePositions.map((position) => (
            <div key={position.id} className="min-w-0">
              <JobCard position={position} onViewDetails={onViewDetails} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="p-2 rounded-full border border-dkk-gray/50 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-dkk-gray dark:hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Előző"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={[
                  "h-2 rounded-full transition-all",
                  idx === currentIndex
                    ? "w-8 bg-dkk-blue dark:bg-blue-500"
                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600",
                ].join(" ")}
                aria-label={`Oldal ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="p-2 rounded-full border border-dkk-gray/50 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-dkk-gray dark:hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Következő"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Position Counter */}
      <div className="text-center mt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
          {positions.length} elérhető állásajánlat
        </p>
      </div>
    </div>
  );
}
