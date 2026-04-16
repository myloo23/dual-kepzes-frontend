// src/lib/positions-utils.ts

/**
 * Utility functions for position data manipulation
 */

export type TagLike = { name?: string; category?: string } | string;

export function toTagName(t: TagLike): string {
  if (typeof t === "string") return t;
  return t?.name ?? "";
}

export function toTagCategory(t: TagLike): string {
  if (typeof t === "string") return "Technology";
  return t?.category ?? "Technology";
}

export function norm(s: unknown) {
  return String(s ?? "").trim();
}

export function lower(s: unknown) {
  return norm(s).toLowerCase();
}

export function parseDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatHuDate(s?: string | null) {
  const d = parseDate(s);
  if (!d) return "Folyamatos jelentkezés";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}.`;
}

export function isExpired(deadline?: string | null) {
  const d = parseDate(deadline);
  if (!d) return false;
  const now = new Date();
  return d.getTime() < now.getTime();
}

export function pickLogo(
  companyKey: string,
  logos: { logo1: string; logo2: string },
) {
  // deterministically choose between 2 logos
  let sum = 0;
  for (let i = 0; i < companyKey.length; i++) sum += companyKey.charCodeAt(i);
  return sum % 2 === 0 ? logos.logo1 : logos.logo2;
}

export type PositionType = "DUAL" | "PROFESSIONAL_PRACTICE" | "REGULAR_WORK";

export const POSITION_TYPE_CONFIG: Record<
  PositionType,
  { label: string; badgeClass: string; mapColor: string; mapStroke: string }
> = {
  DUAL: {
    label: "Duális",
    badgeClass:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    mapColor: "#3B82F6",
    mapStroke: "#1D4ED8",
  },
  PROFESSIONAL_PRACTICE: {
    label: "Szakmai gyakorlat",
    badgeClass:
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    mapColor: "#10B981",
    mapStroke: "#047857",
  },
  REGULAR_WORK: {
    label: "Rendes munka",
    badgeClass:
      "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    mapColor: "#6B7280",
    mapStroke: "#374151",
  },
};

export function getPositionTypeConfig(type?: string | null) {
  return (
    POSITION_TYPE_CONFIG[type as PositionType] ?? POSITION_TYPE_CONFIG["DUAL"]
  );
}
