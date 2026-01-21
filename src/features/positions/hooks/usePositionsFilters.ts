import { useMemo } from "react";
import type { Position } from "../../../lib/api";
import {
    norm,
    lower,
    parseDate,
    toTagName,
    toTagCategory,
    isExpired,
    type TagLike,
} from "../../../lib/positions-utils";

export type SortKey = "NEWEST" | "DEADLINE_ASC" | "DEADLINE_DESC" | "TITLE_ASC";
export type DeadlineFilter = "ALL" | "7D" | "30D" | "90D" | "NO_DEADLINE";

interface UsePositionsFiltersProps {
    positions: Position[];
    search: string;
    city: string;
    company: string;
    tagCategory: string;
    deadlineFilter: DeadlineFilter;
    activeOnly: boolean;
    selectedTags: string[];
    sortKey: SortKey;
}

/**
 * Custom hook for filtering and sorting positions
 * Extracts complex filtering logic from PositionsPage
 */
export function usePositionsFilters({
    positions,
    search,
    city,
    company,
    tagCategory,
    deadlineFilter,
    activeOnly,
    selectedTags,
    sortKey,
}: UsePositionsFiltersProps) {
    // Extract unique values for filters
    const cities = useMemo(() => {
        const citySet = new Set(positions.map((p) => p.location?.city).filter(Boolean));
        return Array.from(citySet).sort();
    }, [positions]);

    const companies = useMemo(() => {
        const companySet = new Set(
            positions.map((p) => p.company?.name).filter(Boolean)
        );
        return Array.from(companySet).sort();
    }, [positions]);

    const tagCategories = useMemo(() => {
        const categorySet = new Set<string>();
        positions.forEach((p) => {
            p.tags?.forEach((t: TagLike) => {
                const cat = toTagCategory(t);
                if (cat) categorySet.add(cat);
            });
        });
        return Array.from(categorySet).sort();
    }, [positions]);

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        positions.forEach((p) => {
            p.tags?.forEach((t: TagLike) => {
                const name = toTagName(t);
                if (name) tagSet.add(name);
            });
        });
        return Array.from(tagSet).sort();
    }, [positions]);

    // Filter positions
    const filteredPositions = useMemo(() => {
        return positions.filter((p) => {
            // Active filter
            if (activeOnly && isExpired(p.deadline)) return false;

            // Search filter
            if (search) {
                const s = lower(search);
                const titleMatch = lower(p.title).includes(s);
                const companyMatch = p.company?.name
                    ? lower(p.company.name).includes(s)
                    : false;
                const cityMatch = p.location?.city ? lower(p.location.city).includes(s) : false;
                if (!titleMatch && !companyMatch && !cityMatch) return false;
            }

            // City filter
            if (city !== "ALL" && (!p.location?.city || norm(p.location.city) !== norm(city))) return false;

            // Company filter
            if (
                company !== "ALL" &&
                (!p.company?.name || norm(p.company.name) !== norm(company))
            )
                return false;

            // Tag category filter
            if (tagCategory !== "ALL") {
                const hasCategory = p.tags?.some(
                    (t: TagLike) => toTagCategory(t) === tagCategory
                );
                if (!hasCategory) return false;
            }

            // Selected tags filter
            if (selectedTags.length > 0) {
                const positionTags = p.tags?.map((t: TagLike) => toTagName(t)) || [];
                const hasAllTags = selectedTags.every((tag) =>
                    positionTags.includes(tag)
                );
                if (!hasAllTags) return false;
            }

            // Deadline filter
            if (deadlineFilter !== "ALL") {
                const deadline = parseDate(p.deadline);
                if (!deadline) {
                    return deadlineFilter === "NO_DEADLINE";
                }

                const now = new Date();
                const diffMs = deadline.getTime() - now.getTime();
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                switch (deadlineFilter) {
                    case "7D":
                        if (diffDays > 7) return false;
                        break;
                    case "30D":
                        if (diffDays > 30) return false;
                        break;
                    case "90D":
                        if (diffDays > 90) return false;
                        break;
                    case "NO_DEADLINE":
                        return false;
                }
            }

            return true;
        });
    }, [
        positions,
        search,
        city,
        company,
        tagCategory,
        deadlineFilter,
        activeOnly,
        selectedTags,
    ]);

    // Sort positions
    const sortedPositions = useMemo(() => {
        const sorted = [...filteredPositions];

        switch (sortKey) {
            case "NEWEST":
                sorted.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                break;

            case "DEADLINE_ASC":
                sorted.sort((a, b) => {
                    const deadlineA = parseDate(a.deadline);
                    const deadlineB = parseDate(b.deadline);
                    if (!deadlineA && !deadlineB) return 0;
                    if (!deadlineA) return 1;
                    if (!deadlineB) return -1;
                    return deadlineA.getTime() - deadlineB.getTime();
                });
                break;

            case "DEADLINE_DESC":
                sorted.sort((a, b) => {
                    const deadlineA = parseDate(a.deadline);
                    const deadlineB = parseDate(b.deadline);
                    if (!deadlineA && !deadlineB) return 0;
                    if (!deadlineA) return 1;
                    if (!deadlineB) return -1;
                    return deadlineB.getTime() - deadlineA.getTime();
                });
                break;

            case "TITLE_ASC":
                sorted.sort((a, b) => a.title.localeCompare(b.title, "hu"));
                break;
        }

        return sorted;
    }, [filteredPositions, sortKey]);

    return {
        cities,
        companies,
        tagCategories,
        allTags,
        filteredPositions: sortedPositions,
    };
}
