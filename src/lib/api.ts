/**
 * API Client
 * Centralized API communication layer with proper type safety
 */

import type { Id } from "../types/common.types";
import type {
  LoginResponse,
  RegisterResponse,
  StudentRegisterPayload,
  Company,
  Position,
  StudentProfile,
  CompanyAdminProfile,
  EmployeeProfile,
  UniversityUserProfile,
  SystemAdminProfile,
  User,
  StatsResponse,
  NewsItem,
  NewsCreatePayload,
  Application,
  ApplicationStatus,
  ApplicationCreatePayload,
  Major,
  Partnership,
  PaginationQuery,
  CompanyRegisterPayload,
} from "../types/api.types";
import type {
  NotificationCreatePayload,
  NotificationDetails,
  NotificationItem,
  NotificationUnreadCount,
} from "../types/notifications.types";

import { auth } from "./auth-token";
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiPostFormData,
} from "./api-client";

// Re-export auth for backward compatibility
export { auth };

// ============= Utility Functions =============
function ensureId(id: Id, label = "id"): string {
  const s = String(id ?? "").trim();
  if (!s) throw new Error(`Hiányzó ${label}.`);
  return s;
}

// ============= API Endpoint Constants =============
const PATHS = {
  companies: "/api/companies",
  positions: "/api/jobs/positions",
  students: "/api/students",
  me: "/api/students/me",
  users: "/api/users",
  systemAdmins: "/api/system-admins",
  companyAdmins: "/api/company-admins",
  universityUsers: "/api/university-users",
  employees: "/api/employees",
  stats: "/api/stats",
  news: "/api/news",
  applications: "/api/applications",
  notifications: "/api/notifications",
  majors: "/api/majors",
} as const;

// ============= API Object =============
export const api = {
  // ============= Auth =============
  login: (email: string, password: string) =>
    apiPost<LoginResponse>("/api/auth/login", { email, password }),

  registerStudent: (payload: StudentRegisterPayload) =>
    apiPost<RegisterResponse>("/api/auth/register", payload),

  registerCompany: (payload: CompanyRegisterPayload) =>
    apiPost<RegisterResponse>("/api/companies/with-admin", payload),

  // ============= Stats =============
  stats: {
    get: () => apiGet<StatsResponse>(PATHS.stats),
  },

  // ============= Majors =============
  majors: {
    list: () => apiGet<Major[]>(PATHS.majors),
    get: (id: Id) =>
      apiGet<Major>(`${PATHS.majors}/${ensureId(id, "majorId")}`),
    create: (payload: { name: string; code?: string }) =>
      apiPost<Major>(PATHS.majors, payload),
    update: (id: Id, payload: { name?: string; code?: string }) =>
      apiPatch<Major>(`${PATHS.majors}/${ensureId(id, "majorId")}`, payload),
    remove: (id: Id) =>
      apiDelete<{ message?: string }>(
        `${PATHS.majors}/${ensureId(id, "majorId")}`,
      ),
  },

  // ============= Companies =============
  companies: {
    list: (params?: PaginationQuery) =>
      apiGet<Company[]>(PATHS.companies, params),

    get: (id: Id) =>
      apiGet<Company>(`${PATHS.companies}/${ensureId(id, "companyId")}`),

    create: (payload: Omit<Company, "id">) =>
      apiPost<Company>(PATHS.companies, payload),

    update: (id: Id, body: Partial<Omit<Company, "id">>) =>
      apiPatch<Company>(
        `${PATHS.companies}/${ensureId(id, "companyId")}`,
        body,
      ),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(
        `${PATHS.companies}/${ensureId(id, "companyId")}`,
      ),
  },

  // ============= Positions =============
  positions: {
    list: (params?: PaginationQuery) =>
      apiGet<Position[]>(PATHS.positions, params),

    // Public endpoint - no authentication required
    // Public endpoint - no authentication required
    listPublic: (params?: PaginationQuery) =>
      apiGet<Position[]>(PATHS.positions, params, ""),

    // Helper methods for filtering by isDual flag
    listDualPositions: (params?: PaginationQuery) =>
      apiGet<Position[]>(`${PATHS.positions}/dual`, params),
    listNonDualPositions: (params?: PaginationQuery) =>
      apiGet<Position[]>(`${PATHS.positions}/non-dual`, params),

    get: (id: Id) => apiGet<Position>(`${PATHS.positions}/${id}`),
    listByCompany: (companyId: Id, params?: PaginationQuery) =>
      apiGet<Position[]>(
        `${PATHS.positions}/company/${ensureId(companyId, "companyId")}`,
        params,
      ),

    create: (payload: Omit<Position, "id">) =>
      apiPost<Position>(PATHS.positions, payload),

    update: (id: Id, body: Partial<Omit<Position, "id">>) =>
      apiPatch<Position>(`${PATHS.positions}/${id}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.positions}/${id}`),

    deactivate: (id: Id) =>
      apiPatch<{ message: string; position: Position }>(
        `${PATHS.positions}/${id}/deactivate`,
        {},
      ),
  },

  // ============= Students =============
  students: {
    list: (params?: PaginationQuery) =>
      apiGet<StudentProfile[]>(PATHS.students, params),

    get: (id: Id) => apiGet<StudentProfile>(`${PATHS.students}/${id}`),

    update: (id: Id, body: Partial<StudentProfile>) =>
      apiPatch<StudentProfile>(`${PATHS.students}/${id}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.students}/${id}`),
  },

  // ============= Current User Profile =============
  me: {
    get: () => apiGet<StudentProfile>(PATHS.me),

    update: (body: Partial<StudentProfile>) =>
      apiPatch<StudentProfile>(PATHS.me, body),

    remove: () => apiDelete<{ message?: string }>(PATHS.me),
  },

  // ============= Generic Users (Admin) =============
  users: {
    listInactive: (params?: PaginationQuery) =>
      apiGet<User[]>(`${PATHS.users}/inactive`, params),

    reactivate: (id: Id) =>
      apiPatch<User>(`${PATHS.users}/${id}/reactivate`, {}),

    deactivate: (id: Id) =>
      apiPatch<User>(`${PATHS.users}/${id}/deactivate`, {}),
  },

  // ============= News =============
  news: {
    // Public
    list: (params?: PaginationQuery) => apiGet<NewsItem[]>(PATHS.news, params),
    get: (id: Id) => apiGet<NewsItem>(`${PATHS.news}/${id}`),

    // Admin
    admin: {
      list: (params?: PaginationQuery) =>
        apiGet<NewsItem[]>(`${PATHS.news}/admin`, params),
      listArchived: (params?: PaginationQuery) =>
        apiGet<NewsItem[]>(`${PATHS.news}/admin/archived`, params),
      get: (id: Id) => apiGet<NewsItem>(`${PATHS.news}/admin/${id}`),
      create: (payload: NewsCreatePayload) =>
        apiPost<NewsItem>(`${PATHS.news}/admin`, payload),
      update: (id: Id, payload: Partial<NewsCreatePayload>) =>
        apiPatch<NewsItem>(`${PATHS.news}/admin/${id}`, payload),
      archive: (id: Id) =>
        apiPatch<void>(`${PATHS.news}/admin/${id}/archive`, {}),
      unarchive: (id: Id) =>
        apiPatch<void>(`${PATHS.news}/admin/${id}/unarchive`, {}),
      remove: (id: Id) => apiDelete<void>(`${PATHS.news}/admin/${id}`),
    },
  },

  // ============= Applications =============
  applications: {
    submit: (payload: ApplicationCreatePayload) =>
      apiPost<{ message: string; application: Application }>(
        PATHS.applications,
        payload,
      ),

    submitWithFiles: (payload: FormData) =>
      apiPostFormData<{ message: string; application: Application }>(
        "/api/applications/submit-with-files",
        payload,
      ),

    list: (params?: PaginationQuery) =>
      apiGet<Application[]>(PATHS.applications, params),
    listMy: (params?: PaginationQuery) =>
      apiGet<Application[]>(`${PATHS.applications}/my`, params),
    listCompany: (params?: PaginationQuery) =>
      apiGet<Application[]>(`${PATHS.applications}/company`, params),
    evaluateCompany: (
      id: Id,
      body: { status: ApplicationStatus; companyNote?: string },
    ) =>
      apiPatch<Application>(
        `${PATHS.applications}/company/${ensureId(id, "applicationId")}/evaluate`,
        body,
      ),

    getCompanyApplication: (id: Id) =>
      apiGet<Application>(
        `${PATHS.applications}/company/${ensureId(id, "applicationId")}`,
      ),

    updateCompanyApplication: (
      id: Id,
      body: { status: ApplicationStatus; companyNote?: string },
    ) =>
      apiPatch<Application>(
        `${PATHS.applications}/company/${ensureId(id, "applicationId")}`,
        body,
      ),

    retract: (id: Id) =>
      apiPatch<Application>(
        `${PATHS.applications}/${ensureId(id, "applicationId")}/retract`,
        {},
      ),
  },

  // ============= Partnerships =============
  partnerships: {
    listCompany: (params?: PaginationQuery) =>
      apiGet<Partnership[]>(`/api/partnerships/company`, params),
    listUniversity: (params?: PaginationQuery) =>
      apiGet<Partnership[]>(`/api/partnerships/university`, params),
    listStudent: (params?: PaginationQuery) =>
      apiGet<Partnership[]>(`/api/partnerships/student`, params),
    get: (id: Id) =>
      apiGet<Partnership>(`/api/partnerships/${ensureId(id, "partnershipId")}`),
    assignMentor: (id: Id, mentorId: Id) =>
      apiPatch<Partnership>(
        `/api/partnerships/${ensureId(id, "partnershipId")}/assign-mentor`,
        { mentorId }, // Reverting to { mentorId }. 500 error means acceptable format but backend crash.
      ),
    assignUniversityUser: (id: Id, universityUserId: Id) =>
      apiPatch<Partnership>(
        `/api/partnerships/${ensureId(id, "partnershipId")}/assign-university-user`,
        { uniEmployeeId: universityUserId },
      ),
    terminate: (id: Id) =>
      apiPatch<Partnership>(
        `/api/partnerships/${ensureId(id, "partnershipId")}/terminate`,
        {},
      ),
  },

  // ============= Notifications =============
  notifications: {
    listActive: () => apiGet<NotificationItem[]>(PATHS.notifications),
    listArchived: () =>
      apiGet<NotificationItem[]>(`${PATHS.notifications}/archived`),
    get: (id: Id) =>
      apiGet<NotificationDetails>(
        `${PATHS.notifications}/${ensureId(id, "notificationId")}`,
      ),
    unreadCount: () =>
      apiGet<NotificationUnreadCount | number>(
        `${PATHS.notifications}/unread-count`,
      ),
    create: (payload: NotificationCreatePayload) =>
      apiPost<NotificationItem>(PATHS.notifications, payload),
    readAll: () => apiPut<void>(`${PATHS.notifications}/read-all`, {}),
    markRead: (id: Id) =>
      apiPut<void>(
        `${PATHS.notifications}/${ensureId(id, "notificationId")}/read`,
        {},
      ),
    archive: (id: Id) =>
      apiPut<void>(
        `${PATHS.notifications}/${ensureId(id, "notificationId")}/archive`,
        {},
      ),
    unarchive: (id: Id) =>
      apiPut<void>(
        `${PATHS.notifications}/${ensureId(id, "notificationId")}/unarchive`,
        {},
      ),
    remove: (id: Id) =>
      apiDelete<void>(
        `${PATHS.notifications}/${ensureId(id, "notificationId")}`,
      ),
  },

  // ============= System Admins =============
  systemAdmins: {
    list: (params?: PaginationQuery) =>
      apiGet<SystemAdminProfile[]>(PATHS.systemAdmins, params),
    me: {
      get: () => apiGet<SystemAdminProfile>(`${PATHS.systemAdmins}/me`),
      update: (body: Partial<SystemAdminProfile>) =>
        apiPatch<SystemAdminProfile>(`${PATHS.systemAdmins}/me`, body),
    },
    listAll: (params?: PaginationQuery) =>
      apiGet<SystemAdminProfile[]>(`${PATHS.systemAdmins}/all-admins`, params),
  },

  // ============= Company Admins =============
  companyAdmins: {
    list: (params?: PaginationQuery) =>
      apiGet<CompanyAdminProfile[]>(PATHS.companyAdmins, params),
    get: (id: Id) =>
      apiGet<CompanyAdminProfile>(`${PATHS.companyAdmins}/${id}`),
    update: (id: Id, body: Partial<CompanyAdminProfile>) =>
      apiPatch<CompanyAdminProfile>(`${PATHS.companyAdmins}/${id}`, body),
    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.companyAdmins}/${id}`),
    me: {
      get: () => apiGet<CompanyAdminProfile>(`${PATHS.companyAdmins}/me`),
      update: (body: Partial<CompanyAdminProfile>) =>
        apiPatch<CompanyAdminProfile>(`${PATHS.companyAdmins}/me`, body),
      remove: () =>
        apiDelete<{ message?: string }>(`${PATHS.companyAdmins}/me`),
    },
  },

  // ============= University Users =============
  universityUsers: {
    list: (params?: PaginationQuery) =>
      apiGet<UniversityUserProfile[]>(PATHS.universityUsers, params),
    get: (id: Id) =>
      apiGet<UniversityUserProfile>(`${PATHS.universityUsers}/${id}`),
    update: (id: Id, body: Partial<UniversityUserProfile>) =>
      apiPatch<UniversityUserProfile>(`${PATHS.universityUsers}/${id}`, body),
    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.universityUsers}/${id}`),
    me: {
      get: () => apiGet<UniversityUserProfile>(`${PATHS.universityUsers}/me`),
      update: (body: Partial<UniversityUserProfile>) =>
        apiPatch<UniversityUserProfile>(`${PATHS.universityUsers}/me`, body),
      remove: () =>
        apiDelete<{ message?: string }>(`${PATHS.universityUsers}/me`),
    },
  },

  // ============= Employees =============
  employees: {
    list: (params?: PaginationQuery) =>
      apiGet<EmployeeProfile[]>(PATHS.employees, params),
    listByCompany: (companyId: Id, params?: PaginationQuery) =>
      apiGet<EmployeeProfile[]>(
        `${PATHS.employees}/company/${ensureId(companyId, "companyId")}`,
        params,
      ),
    listMentors: (params?: PaginationQuery) =>
      apiGet<EmployeeProfile[]>(`${PATHS.employees}/mentors`, params),
    listMentorsByCompany: (companyId: Id, params?: PaginationQuery) =>
      apiGet<EmployeeProfile[]>(
        `${PATHS.employees}/mentors/${ensureId(companyId, "companyId")}`,
        params,
      ),
    me: {
      get: () => apiGet<EmployeeProfile>(`${PATHS.employees}/me`),
      update: (body: Partial<EmployeeProfile>) =>
        apiPut<EmployeeProfile>(`${PATHS.employees}/me`, body),
    },
  },
};

// ============= Re-export Types for Convenience =============
export type {
  Id,
  LoginResponse,
  RegisterResponse,
  StudentRegisterPayload,
  Company,
  Major,
  Position,
  StudentProfile,
  CompanyAdminProfile,
  EmployeeProfile,
  UniversityUserProfile,
  User,
  StatsResponse,
  NewsItem,
  NewsCreatePayload,
  NewsTargetGroup,
  Application,
  ApplicationStatus,
  Location,
  Tag,
  Partnership,
  PartnershipStatus,
  CompanyRegisterPayload,
} from "../types/api.types";
export type {
  NotificationCreatePayload,
  NotificationDetails,
  NotificationItem,
  NotificationUnreadCount,
} from "../types/notifications.types";
