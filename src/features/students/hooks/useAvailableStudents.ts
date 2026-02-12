/**
 * useAvailableStudents Hook
 * Custom hook for fetching and managing available students data
 */

import { useState, useEffect } from "react";
import { studentsApi } from "../services/studentsApi";
import type { AvailableStudent } from "../types";

interface UseAvailableStudentsResult {
  students: AvailableStudent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAvailableStudents = (): UseAvailableStudentsResult => {
  const [students, setStudents] = useState<AvailableStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("[useAvailableStudents] Fetching students...");
      const response = await studentsApi.getAvailableStudents();
      console.log("[useAvailableStudents] API Response:", response);
      // The api-client auto-unwraps the response, so response is already the data array
      const studentsData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];
      console.log("[useAvailableStudents] Students data:", studentsData);
      setStudents(studentsData);
    } catch (err) {
      console.error("[useAvailableStudents] Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Hiba történt a hallgatók betöltése során",
      );
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    isLoading,
    error,
    refetch: fetchStudents,
  };
};
