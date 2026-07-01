import { API_CONFIG } from "../config/app.config";

export function resolveApiAssetUrl(url?: string | null): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // Handle local uploads by ensuring they point to the correct base URL
  if (trimmed.includes("/uploads/")) {
    const parts = trimmed.split("/uploads/");
    const relativePath = `uploads/${parts[parts.length - 1]}`;
    const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
    return `${base}/${relativePath}`;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}
