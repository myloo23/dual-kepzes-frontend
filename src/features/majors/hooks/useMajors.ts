import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import type { Major } from "../../../lib/api";

export function useMajors() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setLoading(true);
        const response = await api.majors.list({
          limit: 1000,
          page: 1,
        });

        let data: Major[] = [];
        const paged = response as unknown as { data?: Major[] };
        if (paged.data && Array.isArray(paged.data)) {
          data = paged.data;
        } else if (Array.isArray(response)) {
          data = response as unknown as Major[];
        }

        // Sort by name
        data.sort((a, b) => a.name.localeCompare(b.name));

        setMajors(data);
      } catch (err) {
        console.error("Failed to fetch majors:", err);
        setError("Nem sikerült betölteni a szakokat.");
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  return { majors, loading, error };
}
