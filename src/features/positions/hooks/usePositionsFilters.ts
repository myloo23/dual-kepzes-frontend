import { useMemo, useState, useCallback } from "react";
import type { Position } from "../../../lib/api";
import HUCities from "../../../assets/hu.json";
import {
  norm,
  parseDate,
  isExpired,
  type TagLike,
} from "../utils/positions.utils";
import { lower, toTagName } from "../utils/positions.utils";

export type SortKey =
  | "NEWEST"
  | "DEADLINE_ASC"
  | "DEADLINE_DESC"
  | "TITLE_ASC"
  | "RANDOM";
export type DeadlineFilter = "ALL" | "7D" | "30D" | "90D" | "NO_DEADLINE";
export type DatePostedFilter = "ALL" | "24H" | "7D" | "30D";
export type WorkTypeFilter = "ALL" | "REMOTE" | "ONSITE";

export type PositionTypeFilter =
  | "ALL"
  | "DUAL"
  | "PROFESSIONAL_PRACTICE"
  | "REGULAR_WORK";

const ALL_HUNGARIAN_COUNTIES = [
  "Bács-Kiskun",
  "Baranya",
  "Békés",
  "Borsod-Abaúj-Zemplén",
  "Csongrád-Csanád",
  "Fejér",
  "Győr-Moson-Sopron",
  "Hajdú-Bihar",
  "Heves",
  "Jász-Nagykun-Szolnok",
  "Komárom-Esztergom",
  "Nógrád",
  "Pest",
  "Somogy",
  "Szabolcs-Szatmár-Bereg",
  "Tolna",
  "Vas",
  "Veszprém",
  "Zala"
];

function hashToUnitInterval(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
}

/**
 * Custom hook for filtering and sorting positions
 * Extracts complex filtering logic from PositionsPage
 */
export function usePositionsFilters(positions: Position[]) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("ALL");
  const [county, setCounty] = useState("ALL");
  const [company, setCompany] = useState("ALL");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("ALL");
  const [datePostedFilter, setDatePostedFilter] =
    useState<DatePostedFilter>("ALL");
  const [workTypeFilter, setWorkTypeFilter] = useState<WorkTypeFilter>("ALL");
  const [positionType, setPositionType] = useState<PositionTypeFilter>("ALL");
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("RANDOM");

  // Create a stable random map for shuffling
  const randomMap = useMemo(() => {
    const map = new Map<string, number>();
    positions.forEach((p) => {
      const id = String(p.id);
      map.set(id, hashToUnitInterval(id));
    });
    return map;
  }, [positions]);

  // Extract unique values for filters
  const cities = useMemo(() => {
    const relevantPositions = activeOnly
      ? positions.filter((p) => !isExpired(p.deadline))
      : positions;
    const citySet = new Set(
      relevantPositions
        .map((p) => p.location?.city)
        .filter((city): city is string => Boolean(city)),
    );
    return Array.from(citySet).sort();
  }, [positions, activeOnly]);

  const counties = ALL_HUNGARIAN_COUNTIES;

  const companies = useMemo(() => {
    const relevantPositions = activeOnly
      ? positions.filter((p) => !isExpired(p.deadline))
      : positions;
    const companySet = new Set(
      relevantPositions
        .map((p) => p.company?.name)
        .filter((name): name is string => Boolean(name)),
    );
    return Array.from(companySet).sort();
  }, [positions, activeOnly]);

  const allTags = useMemo(() => {
    const relevantPositions = activeOnly
      ? positions.filter((p) => !isExpired(p.deadline))
      : positions;
    const tagSet = new Set<string>();
    relevantPositions.forEach((p) => {
      p.tags?.forEach((t: TagLike) => {
        const name = toTagName(t);
        if (name) tagSet.add(name);
      });
    });
    return Array.from(tagSet).sort();
  }, [positions, activeOnly]);

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
        const cityMatch = p.location?.city
          ? lower(p.location.city).includes(s)
          : false;
        if (!titleMatch && !companyMatch && !cityMatch) return false;
      }

      // City filter
      if (
        city !== "ALL" &&
        (!p.location?.city || norm(p.location.city) !== norm(city))
      )
        return false;

      // County filter
      if (county !== "ALL") {
        const positionCity = p.location?.city;
        if (!positionCity) return false;
        
        const cityData = HUCities.find(
          (c) => lower(c.city) === lower(positionCity)
        );
        if (!cityData || norm(cityData.admin_name) !== norm(county)) {
          return false;
        }
      }

      // Company filter
      if (
        company !== "ALL" &&
        (!p.company?.name || norm(p.company.name) !== norm(company))
      )
        return false;

      // Selected tags filter
      if (selectedTags.length > 0) {
        const positionTags = p.tags?.map((t) => toTagName(t)) || [];
        const hasAllTags = selectedTags.every((tag) =>
          positionTags.includes(tag),
        );
        if (!hasAllTags) return false;
      }

      // Position Type filter
      if (positionType !== "ALL" && p.type !== positionType) return false;

      // Deadline filter
      if (deadlineFilter !== "ALL") {
        const deadline = parseDate(p.deadline);
        if (!deadline) {
          return deadlineFilter === "NO_DEADLINE";
        }

        const now = new Date();
        const diffMs = deadline.getTime() - now.getTime();

        // If filtering by deadline (7D, 30D, 90D), exclude expired positions
        if (deadlineFilter !== "NO_DEADLINE" && diffMs < 0) {
          return false;
        }

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

      // Date posted filter
      if (datePostedFilter !== "ALL") {
        const createdAt = p.createdAt ? new Date(p.createdAt) : null;
        if (!createdAt) return false;

        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        switch (datePostedFilter) {
          case "24H":
            if (diffHours > 24) return false;
            break;
          case "7D":
            if (diffDays > 7) return false;
            break;
          case "30D":
            if (diffDays > 30) return false;
            break;
        }
      }

      // Work type filter (Remote/On-site)
      if (workTypeFilter !== "ALL") {
        const cityLower = p.location?.city ? lower(p.location.city) : "";
        const tagsLower = p.tags?.map((t) => lower(toTagName(t))) || [];
        const remoteKeywords = ["remote", "távmunka", "home office", "otthoni"];

        const isRemote =
          remoteKeywords.some((k) => cityLower.includes(k)) ||
          tagsLower.some((t) => remoteKeywords.some((k) => t.includes(k)));

        if (workTypeFilter === "REMOTE" && !isRemote) return false;
        if (workTypeFilter === "ONSITE" && isRemote) return false;
      }

      return true;
    });
  }, [
    positions,
    search,
    city,
    county,
    company,
    deadlineFilter,
    datePostedFilter,
    workTypeFilter,
    positionType,
    activeOnly,
    selectedTags,
  ]);

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

      case "RANDOM":
        sorted.sort((a, b) => {
          const rA = randomMap.get(String(a.id)) ?? 0;
          const rB = randomMap.get(String(b.id)) ?? 0;
          return rA - rB;
        });
        break;
    }

    return sorted;
  }, [filteredPositions, sortKey, randomMap]);

  const derived = useMemo(
    () => ({
      cities,
      counties,
      companies,
      tags: allTags,
      showCityChips: cities.length <= 10,
      showCompanyChips: companies.length <= 10,
    }),
    [cities, counties, companies, allTags],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setCity("ALL");
    setCounty("ALL");
    setCompany("ALL");
    setDeadlineFilter("ALL");
    setDatePostedFilter("ALL");
    setWorkTypeFilter("ALL");
    setPositionType("ALL");
    setActiveOnly(false);
    setSelectedTags([]);
    setSortKey("NEWEST");
  }, []);

  const toggleTag = useCallback((name: string) => {
    setSelectedTags((prev) => {
      const exists = prev.some((t) => lower(t) === lower(name));
      if (exists) {
        return prev.filter((t) => lower(t) !== lower(name));
      }
      return [...prev, name];
    });
  }, []);

  return {
    search,
    city,
    county,
    company,
    deadlineFilter,
    datePostedFilter,
    workTypeFilter,
    positionType,
    activeOnly,
    selectedTags,
    sortKey,
    setSearch,
    setCity,
    setCounty,
    setCompany,
    setDeadlineFilter,
    setDatePostedFilter,
    setWorkTypeFilter,
    setPositionType,
    setActiveOnly,
    setSelectedTags,
    setSortKey,
    derived,
    filtered: sortedPositions,
    resetFilters,
    toggleTag,
  };
}
