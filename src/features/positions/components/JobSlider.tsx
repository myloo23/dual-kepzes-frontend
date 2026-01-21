// src/components/landing/JobSlider.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "./JobCard";
import { api } from "../../../lib/api";

type Position = {
    id?: string | number;
    title?: string;
    description?: string;
    city?: string;
    zipCode?: string;
    address?: string;
    deadline?: string;
    isDual?: boolean;
    isActive?: boolean;
    tags?: any[];
    company?: { id?: string | number; name?: string; logoUrl?: string | null };
    [key: string]: any;
};

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
                const allPositions = await api.positions.listPublic();

                console.log("📊 All positions:", allPositions);
                console.log("📊 Positions with isDual values:", allPositions.map(p => ({
                    id: p.id,
                    title: p.title,
                    isDual: p.isDual,
                    isActive: p.isActive
                })));

                // Filter for non-dual, active positions
                // ONLY show positions with explicit isDual: false
                // If backend doesn't send isDual field, nothing will show (correct behavior)
                const nonDualPositions = allPositions.filter(
                    (p) => p.isDual === false && p.isActive !== false
                );

                console.log("💼 Non-dual positions (isDual === false):", nonDualPositions);
                console.log("💼 Count:", nonDualPositions.length);

                // Debug: show what isDual values we have
                const isDualValues = allPositions.map(p => p.isDual);
                console.log("🔍 All isDual values:", isDualValues);
                console.log("🔍 Unique isDual values:", [...new Set(isDualValues)]);

                if (isDualValues.every(v => v === undefined)) {
                    console.warn("⚠️ WARNING: Backend is not returning isDual field!");
                    console.warn("⚠️ You need to update the backend to include isDual in the response.");
                }

                setPositions(nonDualPositions);
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
        (currentIndex + 1) * itemsPerPage
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
                <p className="text-slate-500 text-sm">
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
                        className="p-2 rounded-full border border-dkk-gray/50 bg-white text-slate-700 hover:bg-slate-50 hover:border-dkk-gray disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                                        ? "w-8 bg-dkk-blue"
                                        : "w-2 bg-slate-300 hover:bg-slate-400",
                                ].join(" ")}
                                aria-label={`Oldal ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className="p-2 rounded-full border border-dkk-gray/50 bg-white text-slate-700 hover:bg-slate-50 hover:border-dkk-gray disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Következő"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Position Counter */}
            <div className="text-center mt-4">
                <p className="text-xs text-slate-500">
                    {positions.length} elérhető állásajánlat
                </p>
            </div>
        </div>
    );
}
