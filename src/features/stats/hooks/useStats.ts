import { useState, useEffect, useCallback } from "react";
import { statsApi } from "../services/statsApi";
import type {
  SystemStats,
  ApplicationStats,
  PartnershipStats,
  PositionStats,
  TrendStats,
} from "../types";

// Generic hook helper
function useFetch<T>(fetcher: () => Promise<T>, defaultValue: T | null = null) {
  const [data, setData] = useState<T | null>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Hiba történt az adatok betöltésekor.");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useSystemStats() {
  return useFetch<SystemStats>(statsApi.getSystemStats);
}

export function useApplicationStats() {
  return useFetch<ApplicationStats>(statsApi.getApplicationStats);
}

export function usePartnershipStats() {
  return useFetch<PartnershipStats>(statsApi.getPartnershipStats);
}

export function usePositionStats() {
  return useFetch<PositionStats>(statsApi.getPositionStats);
}

export function useTrendStats() {
  return useFetch<TrendStats>(statsApi.getTrends);
}
