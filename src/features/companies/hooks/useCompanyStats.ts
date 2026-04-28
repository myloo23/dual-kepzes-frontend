import { useState, useEffect } from "react";
import { api, type Id } from "../../../lib/api";

interface CompanyStats {
  positionsCount: number;
  applicationsCount: number;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

export function useCompanyStats(companyId: Id | undefined) {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      if (!companyId) {
        if (isMounted) {
          setLoading(false);
          setStats(null);
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);
        if (isMounted) setError(null);

        const companyStats = await api.stats.getCompanyMe().catch(() => null);
        const apiPositionsCount = firstNumber(
          companyStats?.positionsCount,
          (companyStats as any)?.positions,
          (companyStats as any)?.positionCount,
        );
        const apiApplicationsCount = firstNumber(
          companyStats?.applicationsCount,
          (companyStats as any)?.applications,
          (companyStats as any)?.applicationCount,
        );

        if (apiPositionsCount !== null && apiApplicationsCount !== null) {
          if (isMounted) {
            setStats({
              positionsCount: apiPositionsCount,
              applicationsCount: apiApplicationsCount,
            });
            setLoading(false);
          }
          return;
        }

        // Fallback for backward compatibility
        const [positions, applications] = await Promise.all([
          api.positions.listByCompany(companyId).catch(() => []),
          api.applications.listCompany().catch(() => []),
        ]);

        if (isMounted) {
          setStats({
            positionsCount: Array.isArray(positions) ? positions.length : 0,
            applicationsCount: Array.isArray(applications) ? applications.length : 0,
          });
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load company stats", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load company stats.");
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  return { stats, loading, error };
}
