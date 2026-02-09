import { apiGet } from "@/lib/api-client";
import type {
  SystemStats,
  ApplicationStats,
  PartnershipStats,
  PositionStats,
  TrendStats,
} from "../types";

const BASE_URL = "/api/stats";

export const statsApi = {
  getSystemStats: () => apiGet<SystemStats>(`${BASE_URL}`),

  getApplicationStats: () =>
    apiGet<ApplicationStats>(`${BASE_URL}/applications`),

  getPartnershipStats: () =>
    apiGet<PartnershipStats>(`${BASE_URL}/partnerships`),

  getPositionStats: () => apiGet<PositionStats>(`${BASE_URL}/positions`),

  getTrends: () => apiGet<TrendStats>(`${BASE_URL}/trends`),
};
