import { apiGet } from "@/lib/api-client";
import type {
  SystemStats,
  ApplicationStats,
  PartnershipStats,
  PositionStats,
  TrendStats,
} from "../types";
import type { ReferentOverviewResponse } from "@/types/api.types";

const BASE_URL = "/api/stats";

export const statsApi = {
  getSystemStats: () => apiGet<SystemStats>(`${BASE_URL}`),

  getApplicationStats: () =>
    apiGet<ApplicationStats>(`${BASE_URL}/applications`),

  getPartnershipStats: () =>
    apiGet<PartnershipStats>(`${BASE_URL}/partnerships`),

  getPositionStats: () => apiGet<PositionStats>(`${BASE_URL}/positions`),

  getTrends: () => apiGet<TrendStats>(`${BASE_URL}/trends`),
  
  getReferentOverview: () => 
    apiGet<ReferentOverviewResponse>(`${BASE_URL}/university/referent-overview`),
};
