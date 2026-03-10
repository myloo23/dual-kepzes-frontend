import { apiGet, apiPatch, apiDelete, apiPost } from "@/lib/api-client";
import type { Id, PaginationQuery, StudentProfile } from "@/types/api.types";
import type { AvailableStudentsResponse, AvailableStudent } from "../types";

const STUDENTS_PATH = "/api/students";
const ME_PATH = "/api/students/me";

export const studentsApi = {
  /**
   * Fetch available students for company admins
   */
  getAvailableStudents: async (): Promise<
    AvailableStudentsResponse | AvailableStudent[]
  > => {
    return apiGet<AvailableStudentsResponse>(`${STUDENTS_PATH}/available`);
  },

  list: (params?: PaginationQuery) =>
    apiGet<StudentProfile[]>(STUDENTS_PATH, params),

  get: (id: Id) => apiGet<StudentProfile>(`${STUDENTS_PATH}/${id}`),

  update: (id: Id, body: Partial<StudentProfile>) =>
    apiPatch<StudentProfile>(`${STUDENTS_PATH}/${id}`, body),

  remove: (id: Id) => apiDelete<{ message?: string }>(`${STUDENTS_PATH}/${id}`),

  interest: (id: Id) =>
    apiPost<{ message: string }>(`${STUDENTS_PATH}/${id}/interest`, {}),

  // Current User (Me)
  me: {
    get: () => apiGet<StudentProfile>(ME_PATH),

    update: (body: Partial<StudentProfile>) =>
      apiPatch<StudentProfile>(ME_PATH, body),

    remove: () => apiDelete<{ message?: string }>(ME_PATH),

    toggleAvailability: (body?: {
      motivationLetter?: string;
      isAvailableForWork?: boolean;
    }) =>
      apiPatch<StudentProfile>(`${ME_PATH}/toggle-availability`, body || {}),

    transitionToUniversity: (data: { neptunCode: string; majorId: string }) =>
      apiPatch<StudentProfile>(`${ME_PATH}/university-transition`, data),
  },
};
