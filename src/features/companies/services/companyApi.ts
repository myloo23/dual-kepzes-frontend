/**
 * Company API Service
 * Feature-specific API calls for company management
 */

import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  apiPostFormData,
} from "@/lib/api-client";
import { API_CONFIG } from "@/config/app.config";
import type {
  Id,
  Company,
  PaginationQuery,
  CompanyRegisterPayload,
} from "@/types/api.types";

const COMPANIES_PATH = "/api/companies";

export interface CompanyImage {
  id: string;
  companyId?: string;
  url: string;
  publicId?: string | null;
  caption?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Helper to ensure ID is valid
function ensureId(id: Id, label = "id"): string {
  const s = String(id ?? "").trim();
  if (!s) throw new Error(`Hiányzó ${label}.`);
  return s;
}

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

export const companyApi = {
  list: (params?: PaginationQuery) => apiGet<Company[]>(COMPANIES_PATH, params),

  listInactive: (params?: PaginationQuery) =>
    apiGet<Company[]>(`${COMPANIES_PATH}/inactive`, params),

  listOwnApplication: (params?: PaginationQuery) =>
    apiGet<Company[]>(`${COMPANIES_PATH}/own-application`, params),

  listPending: (params?: PaginationQuery) =>
    apiGet<Company[]>(`${COMPANIES_PATH}/pending`, params),

  get: (id: Id) =>
    apiGet<Company>(`${COMPANIES_PATH}/${ensureId(id, "companyId")}`),

  create: (payload: Omit<Company, "id">) =>
    apiPost<Company>(COMPANIES_PATH, payload),

  registerWithAdmin: (payload: CompanyRegisterPayload) =>
    apiPost<any>(`${COMPANIES_PATH}/with-admin`, payload),

  update: (id: Id, body: Partial<Omit<Company, "id">>) =>
    apiPatch<Company>(`${COMPANIES_PATH}/${ensureId(id, "companyId")}`, body),

  remove: (id: Id) =>
    apiDelete<{ message?: string }>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}`,
    ),

  reactivate: (id: Id) =>
    apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/reactivate`,
      {},
    ),

  deactivate: (id: Id) =>
    apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/deactivate`,
      {},
    ),

  approve: (id: Id) =>
    apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/approve`,
      {},
    ),

  reject: (id: Id) =>
    apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/reject`,
      {},
    ),

  companyImages: {
    list: async (companyId: Id) => {
      const data = await apiGet<CompanyImage[]>(
        `${COMPANIES_PATH}/${ensureId(companyId, "companyId")}/images`,
        undefined,
        "",
      );
      return (data ?? []).map((image) => ({
        ...image,
        url: resolveImageUrl(image.url),
      }));
    },
    upload: (companyId: Id, formData: FormData) =>
      apiPostFormData<CompanyImage>(
        `${COMPANIES_PATH}/${ensureId(companyId, "companyId")}/images`,
        formData,
      ),
    remove: (companyId: Id, imageId: Id) =>
      apiDelete<{ message?: string }>(
        `${COMPANIES_PATH}/${ensureId(companyId, "companyId")}/images/${ensureId(imageId, "imageId")}`,
      ),
  },
};
