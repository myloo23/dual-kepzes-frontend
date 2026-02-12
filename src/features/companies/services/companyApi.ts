/**
 * Company API Service
 * Feature-specific API calls for company management
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import type {
  Id,
  Company,
  PaginationQuery,
  CompanyRegisterPayload,
} from "@/types/api.types";

const COMPANIES_PATH = "/api/companies";

// Helper to ensure ID is valid
function ensureId(id: Id, label = "id"): string {
  const s = String(id ?? "").trim();
  if (!s) throw new Error(`Hiányzó ${label}.`);
  return s;
}

export const companyApi = {
  list: (params?: PaginationQuery) => apiGet<Company[]>(COMPANIES_PATH, params),

  listInactive: (params?: PaginationQuery) =>
    apiGet<Company[]>(`${COMPANIES_PATH}/inactive`, params),

  listOwnApplication: (params?: PaginationQuery) =>
    apiGet<Company[]>(`${COMPANIES_PATH}/own-application`, params),

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
};
