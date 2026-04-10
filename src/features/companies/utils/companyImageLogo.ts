import type { Id } from "../../../types/api.types";
import { companyApi, type CompanyImage } from "../services/companyApi";

function normalizeOrder(order?: number): number {
  return typeof order === "number" ? order : Number.MAX_SAFE_INTEGER;
}

function normalizeDate(dateValue?: string): number {
  if (!dateValue) return Number.MAX_SAFE_INTEGER;
  const parsed = Date.parse(dateValue);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

export function pickPrimaryCompanyImageUrl(images: CompanyImage[]): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;

  const sorted = [...images].sort(
    (a, b) =>
      normalizeOrder(a.order) - normalizeOrder(b.order) ||
      normalizeDate(a.createdAt) - normalizeDate(b.createdAt),
  );

  return sorted[0]?.url ?? null;
}

export async function fetchPrimaryCompanyImageMap(
  companyIds: Id[],
): Promise<Map<string, string>> {
  const uniqueCompanyIds = Array.from(
    new Set(
      companyIds
        .map((id) => String(id ?? "").trim())
        .filter((id) => id.length > 0),
    ),
  );

  if (uniqueCompanyIds.length === 0) {
    return new Map<string, string>();
  }

  const settled = await Promise.allSettled(
    uniqueCompanyIds.map(async (companyId) => {
      const images = await companyApi.companyImages.list(companyId);
      return {
        companyId,
        logoUrl: pickPrimaryCompanyImageUrl(images),
      };
    }),
  );

  const logoMap = new Map<string, string>();

  for (const result of settled) {
    if (result.status !== "fulfilled") continue;
    if (!result.value.logoUrl) continue;
    logoMap.set(result.value.companyId, result.value.logoUrl);
  }

  return logoMap;
}
