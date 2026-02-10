/**
 * Students API Service
 * API calls for student-related operations
 */

import { apiGet } from "@/lib/api-client";
import type { AvailableStudentsResponse, AvailableStudent } from "../types";

/**
 * Fetch available students for company admins
 * Note: The api-client auto-unwraps the response, so this returns the data array directly
 */
export const getAvailableStudents = async (): Promise<
  AvailableStudentsResponse | AvailableStudent[]
> => {
  return apiGet<AvailableStudentsResponse>("/api/students/available");
};
