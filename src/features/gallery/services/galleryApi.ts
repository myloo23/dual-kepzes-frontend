import { apiGet, apiPost, apiPostFormData, apiDelete } from "@/lib/api-client";
import { API_CONFIG } from "@/config/app.config";
import type { GalleryGroup } from "../types";

const BASE = "/api/galleries";

/**
 * If the backend returns a relative path (e.g. /uploads/galleries/abc.webp),
 * prepend the API base URL so <img src=...> can load it.
 */
function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // relative path → prepend base URL (strip trailing slash)
  return `${API_CONFIG.BASE_URL.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeGroups(groups: GalleryGroup[]): GalleryGroup[] {
  return groups.map((g) => ({
    ...g,
    images: g.images.map((img) => ({
      ...img,
      url: resolveImageUrl(img.url),
    })),
  }));
}

export const galleryApi = {
  /**
   * GET /api/galleries
   * Public endpoint – returns all gallery groups including their images.
   */
  listGroups: async (): Promise<GalleryGroup[]> => {
    const data = await apiGet<GalleryGroup[]>(BASE, undefined, "");
    return normalizeGroups(data ?? []);
  },

  /**
   * POST /api/galleries/:groupId/images
   * SystemAdmin – upload a new image to an existing group.
   */
  uploadImage: (groupId: string, formData: FormData) =>
    apiPostFormData<GalleryGroup>(`${BASE}/${groupId}/images`, formData),

  /**
   * POST /api/galleries
   * SystemAdmin – create a new (empty) image group.
   */
  createGroup: (payload: { title: string; description?: string }) =>
    apiPost<GalleryGroup>(BASE, payload),

  /**
   * DELETE /api/galleries/:groupId
   * SystemAdmin – delete a whole group and its images.
   */
  deleteGroup: (groupId: string) =>
    apiDelete<{ message: string }>(`${BASE}/${groupId}`),

  /**
   * DELETE /api/galleries/images/:imageId
   * SystemAdmin – delete a single image.
   */
  deleteImage: (imageId: string) =>
    apiDelete<{ message: string }>(`${BASE}/images/${imageId}`),
};
