import { useState, useEffect } from "react";
import { api, type Id } from "../../../lib/api";

interface CompanyStats {
  positionsCount: number;
  applicationsCount: number;
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

        // Fetch positions and applications in parallel
        const [positions, applications] = await Promise.all([
          api.positions.listByCompany(companyId).catch(() => []), // Fallback to empty
          api.applications.listCompany().catch(() => []), // Fallback to empty
        ]);

        if (isMounted) {
          setStats({
            positionsCount: Array.isArray(positions) ? positions.length : 0,
            applicationsCount: Array.isArray(applications) ? applications.length : 0,
          });
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to load company stats", err);
        if (isMounted) {
          setError(err.message || "Failed to load company stats.");
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
