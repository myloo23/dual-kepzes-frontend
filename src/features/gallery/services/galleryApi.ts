import { apiDelete, apiGet, apiPost, apiPostFormData } from "@/lib/api-client";
import { API_CONFIG } from "@/config/app.config";
import type { GalleryGroup } from "../types";

const BASE = "/api/galleries";

function resolveImageUrl(url: string): string {
  if (!url) return url;

  const trimmed = url.trim();
  if (!trimmed) return trimmed;

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

function normalizeGroups(groups: GalleryGroup[]): GalleryGroup[] {
  return groups.map((group) => ({
    ...group,
    images: group.images.map((img) => ({
      ...img,
      url: resolveImageUrl(img.url),
    })),
  }));
}

export const galleryApi = {
  // Public endpoint: GET /api/galleries
  listGroups: async (): Promise<GalleryGroup[]> => {
    const data = await apiGet<GalleryGroup[]>(BASE, undefined, "");
    return normalizeGroups(data ?? []);
  },

  // SystemAdmin endpoint: POST /api/galleries/:groupId/images
  uploadImage: (groupId: string, formData: FormData) =>
    apiPostFormData<GalleryGroup>(`${BASE}/${groupId}/images`, formData),

  // SystemAdmin endpoint: POST /api/galleries
  createGroup: (payload: { title: string; description?: string }) =>
    apiPost<GalleryGroup>(BASE, payload),

  // SystemAdmin endpoint: DELETE /api/galleries/:groupId
  deleteGroup: (groupId: string) => apiDelete<{ message: string }>(`${BASE}/${groupId}`),

  // SystemAdmin endpoint: DELETE /api/galleries/images/:imageId
  deleteImage: (imageId: string) =>
    apiDelete<{ message: string }>(`${BASE}/images/${imageId}`),
};
