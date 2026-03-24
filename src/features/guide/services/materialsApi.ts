import { apiGet, apiPost } from "../../../lib/api-client";
import type { MaterialProgress, MaterialStatistics } from "../types";

const PATHS = {
  complete: "/api/materials/complete",
  progress: "/api/materials/progress",
  statistics: "/api/materials/statistics",
} as const;

export const materialsApi = {
  /**
   * Tananyag elvégzésének és értékelésének rögzítése (Student)
   */
  complete: (payload: { materialId: string; rating: number; feedback?: string }) =>
    apiPost<{ message: string; progress: MaterialProgress }>(PATHS.complete, payload),

  /**
   * Hallgató saját előrehaladása (Student)
   */
  getProgress: () => apiGet<MaterialProgress[]>(PATHS.progress),

  /**
   * Összesített statisztika a tananyagokról (Admin/Mentor)
   */
  getStatistics: () => apiGet<MaterialStatistics[]>(PATHS.statistics),
};
