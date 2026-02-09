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
        // Cast API response to any to handle the wrapper structure without changing global types yet
        const response = (await api.majors.list()) as any;

        let data: Major[] = [];
        if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
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
