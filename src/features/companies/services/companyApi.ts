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
import { resolveApiAssetUrl } from "@/lib/media-url";
import type {
  Id,
  Company,
  PaginationQuery,
  CompanyRegisterPayload,
  RegisterResponse,
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
  if (!s) throw new Error(`Missing ${label}.`);
  return s;
}

function normalizeCompany(company: Company): Company {
  return {
    ...company,
    logoUrl: resolveApiAssetUrl(company.logoUrl) ?? null,
  };
}

export const companyApi = {
  list: async (params?: PaginationQuery) => {
    const data = await apiGet<Company[]>(COMPANIES_PATH, params);
    return (data ?? []).map(normalizeCompany);
  },

  listInactive: async (params?: PaginationQuery) => {
    const data = await apiGet<Company[]>(`${COMPANIES_PATH}/inactive`, params);
    return (data ?? []).map(normalizeCompany);
  },

  listOwnApplication: async (params?: PaginationQuery) => {
    const data = await apiGet<Company[]>(
      `${COMPANIES_PATH}/own-application`,
      params,
    );
    return (data ?? []).map(normalizeCompany);
  },

  listPending: async (params?: PaginationQuery) => {
    const data = await apiGet<Company[]>(`${COMPANIES_PATH}/pending`, params);
    return (data ?? []).map(normalizeCompany);
  },

  get: async (id: Id) => {
    const data = await apiGet<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}`,
    );
    return normalizeCompany(data);
  },

  create: async (payload: Omit<Company, "id">) => {
    const data = await apiPost<Company>(COMPANIES_PATH, payload);
    return normalizeCompany(data);
  },

  registerWithAdmin: (payload: CompanyRegisterPayload) =>
    apiPost<RegisterResponse>(`${COMPANIES_PATH}/with-admin`, payload),

  update: async (id: Id, body: Partial<Omit<Company, "id">>) => {
    const data = await apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}`,
      body,
    );
    return normalizeCompany(data);
  },

  remove: (id: Id) =>
    apiDelete<{ message?: string }>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}`,
    ),

  reactivate: async (id: Id) => {
    const data = await apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/reactivate`,
      {},
    );
    return normalizeCompany(data);
  },

  deactivate: async (id: Id) => {
    const data = await apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/deactivate`,
      {},
    );
    return normalizeCompany(data);
  },

  approve: async (id: Id) => {
    const data = await apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/approve`,
      {},
    );
    return normalizeCompany(data);
  },

  reject: async (id: Id) => {
    const data = await apiPatch<Company>(
      `${COMPANIES_PATH}/${ensureId(id, "companyId")}/reject`,
      {},
    );
    return normalizeCompany(data);
  },

  companyImages: {
    list: async (companyId: Id) => {
      const data = await apiGet<CompanyImage[]>(
        `${COMPANIES_PATH}/${ensureId(companyId, "companyId")}/images`,
        undefined,
      );
      return (data ?? []).map((image) => ({
        ...image,
        url: resolveApiAssetUrl(image.url) ?? image.url,
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
