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

export function parseDate(s?: string): Date | null {
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
}

export function formatHuDate(s?: string) {
    const d = parseDate(s);
    if (!d) return "—";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}.`;
}

export function isExpired(deadline?: string) {
    const d = parseDate(deadline);
    if (!d) return false;
    const now = new Date();
    return d.getTime() < now.getTime();
}

export function pickLogo(companyKey: string, logos: { logo1: string; logo2: string }) {
    // deterministically choose between 2 logos
    let sum = 0;
    for (let i = 0; i < companyKey.length; i++) sum += companyKey.charCodeAt(i);
    return sum % 2 === 0 ? logos.logo1 : logos.logo2;
}
