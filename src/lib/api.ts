/**
 * API Client
 * Centralized API communication layer with proper type safety
 */

import type { Id } from '../types/common.types';
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
  Partnership,
} from '../types/api.types';
import type {
  NotificationCreatePayload,
  NotificationDetails,
  NotificationItem,
  NotificationUnreadCount,
} from '../types/notifications.types';

import { auth } from './auth-token';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api-client';

// Re-export auth for backward compatibility
export { auth };

// ============= Utility Functions =============
function ensureId(id: Id, label = 'id'): string {
  const s = String(id ?? '').trim();
  if (!s) throw new Error(`Hiányzó ${label}.`);
  return s;
}

// ============= API Endpoint Constants =============
const PATHS = {
  companies: '/api/companies',
  positions: '/api/jobs/positions',
  students: '/api/students',
  me: '/api/students/me',
  users: '/api/users',
  systemAdmins: '/api/system-admins',
  companyAdmins: '/api/company-admins',
  universityUsers: '/api/university-users',
  employees: '/api/employees',
  stats: '/api/stats',
  news: '/api/news',
  applications: '/api/applications',
  notifications: '/api/notifications',
} as const;

// ============= API Object =============
export const api = {
  // ============= Auth =============
  login: (email: string, password: string) =>
    apiPost<LoginResponse>('/api/auth/login', { email, password }),

  registerStudent: (payload: StudentRegisterPayload) =>
    apiPost<RegisterResponse>('/api/auth/register', payload),

  // ============= Stats =============
  stats: {
    get: () => apiGet<StatsResponse>(PATHS.stats),
  },

  // ============= Companies =============
  companies: {
    list: () => apiGet<Company[]>(PATHS.companies),

    get: (id: Id) =>
      apiGet<Company>(`${PATHS.companies}/${ensureId(id, 'companyId')}`),

    create: (payload: Omit<Company, 'id'>) =>
      apiPost<Company>(PATHS.companies, payload),

    update: (id: Id, body: Partial<Omit<Company, 'id'>>) =>
      apiPatch<Company>(`${PATHS.companies}/${ensureId(id, 'companyId')}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.companies}/${ensureId(id, 'companyId')}`),
  },

  // ============= Positions =============
  positions: {
    list: () => apiGet<Position[]>(PATHS.positions),

    // Public endpoint - no authentication required
    listPublic: () => apiGet<Position[]>(PATHS.positions, ''),

    // Helper methods for filtering by isDual flag
    listDualPositions: async (): Promise<Position[]> => {
      const positions = await apiGet<Position[]>(PATHS.positions);
      return positions.filter((p) => p.isDual === true);
    },

    listNonDualPositions: async (): Promise<Position[]> => {
      const positions = await apiGet<Position[]>(PATHS.positions);
      return positions.filter((p) => p.isDual === false);
    },

    get: (id: Id) => apiGet<Position>(`${PATHS.positions}/${id}`),
    listByCompany: (companyId: Id) =>
      apiGet<Position[]>(`${PATHS.positions}/company/${ensureId(companyId, 'companyId')}`),

    create: (payload: Omit<Position, 'id'>) =>
      apiPost<Position>(PATHS.positions, payload),

    update: (id: Id, body: Partial<Omit<Position, 'id'>>) =>
      apiPatch<Position>(`${PATHS.positions}/${id}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.positions}/${id}`),

    deactivate: (id: Id) =>
      apiPatch<{ message: string; position: Position }>(
        `${PATHS.positions}/${id}/deactivate`,
        {}
      ),
  },

  // ============= Students =============
  students: {
    list: () => apiGet<StudentProfile[]>(PATHS.students),

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
    listInactive: () => apiGet<User[]>(`${PATHS.users}/inactive`),

    reactivate: (id: Id) =>
      apiPatch<User>(`${PATHS.users}/${id}/reactivate`, {}),

    deactivate: (id: Id) =>
      apiPatch<User>(`${PATHS.users}/${id}/deactivate`, {}),
  },

  // ============= News =============
  news: {
    // Public
    list: () => apiGet<NewsItem[]>(PATHS.news),
    get: (id: Id) => apiGet<NewsItem>(`${PATHS.news}/${id}`),

    // Admin
    admin: {
      list: () => apiGet<NewsItem[]>(`${PATHS.news}/admin`),
      listArchived: () => apiGet<NewsItem[]>(`${PATHS.news}/admin/archived`),
      get: (id: Id) => apiGet<NewsItem>(`${PATHS.news}/admin/${id}`),
      create: (payload: NewsCreatePayload) =>
        apiPost<NewsItem>(`${PATHS.news}/admin`, payload),
      update: (id: Id, payload: Partial<NewsCreatePayload>) =>
        apiPatch<NewsItem>(`${PATHS.news}/admin/${id}`, payload),
      archive: (id: Id) =>
        apiPatch<void>(`${PATHS.news}/admin/${id}/archive`, {}),
      unarchive: (id: Id) =>
        apiPatch<void>(`${PATHS.news}/admin/${id}/unarchive`, {}),
      remove: (id: Id) =>
        apiDelete<void>(`${PATHS.news}/admin/${id}`),
    },
  },

  // ============= Applications =============
  applications: {
    submit: (payload: ApplicationCreatePayload) =>
      apiPost<{ message: string; application: Application }>(
        PATHS.applications,
        payload
      ),

    list: () => apiGet<Application[]>(PATHS.applications),
    listCompany: () => apiGet<Application[]>(`${PATHS.applications}/company`),
    evaluateCompany: (id: Id, body: { status: ApplicationStatus; companyNote?: string }) =>
      apiPatch<Application>(
        `${PATHS.applications}/company/${ensureId(id, 'applicationId')}/evaluate`,
        body
      ),

    updateCompanyApplication: (id: Id, body: { status: ApplicationStatus; companyNote?: string }) =>
      apiPatch<Application>(
        `${PATHS.applications}/company/${ensureId(id, 'applicationId')}`,
        body
      ),

    retract: (id: Id) =>
      apiPatch<Application>(
        `${PATHS.applications}/${ensureId(id, 'applicationId')}/retract`,
        {}
      ),
  },

  // ============= Partnerships =============
  partnerships: {
    listCompany: () => apiGet<Partnership[]>(`/api/partnerships/company`),
    listUniversity: () => apiGet<Partnership[]>(`/api/partnerships/university`),
    get: (id: Id) => apiGet<Partnership>(`/api/partnerships/${ensureId(id, 'partnershipId')}`),
    assignMentor: (id: Id, mentorId: Id) =>
      apiPatch<Partnership>(
        `/api/partnerships/${ensureId(id, 'partnershipId')}/assign-mentor`,
        { mentorId } // Reverting to { mentorId }. 500 error means acceptable format but backend crash.
      ),
    assignUniversityUser: (id: Id, universityUserId: Id) =>
      apiPatch<Partnership>(
        `/api/partnerships/${ensureId(id, 'partnershipId')}/assign-university-user`,
        { uniEmployeeId: universityUserId }
      ),
    terminate: (id: Id) =>
      apiPatch<Partnership>(
        `/api/partnerships/${ensureId(id, 'partnershipId')}/terminate`,
        {}
      ),
  },

  // ============= Notifications =============
  notifications: {
    listActive: () => apiGet<NotificationItem[]>(PATHS.notifications),
    listArchived: () => apiGet<NotificationItem[]>(`${PATHS.notifications}/archived`),
    get: (id: Id) =>
      apiGet<NotificationDetails>(`${PATHS.notifications}/${ensureId(id, 'notificationId')}`),
    unreadCount: () =>
      apiGet<NotificationUnreadCount | number>(`${PATHS.notifications}/unread-count`),
    create: (payload: NotificationCreatePayload) =>
      apiPost<NotificationItem>(PATHS.notifications, payload),
    readAll: () => apiPut<void>(`${PATHS.notifications}/read-all`, {}),
    markRead: (id: Id) =>
      apiPut<void>(`${PATHS.notifications}/${ensureId(id, 'notificationId')}/read`, {}),
    archive: (id: Id) =>
      apiPut<void>(`${PATHS.notifications}/${ensureId(id, 'notificationId')}/archive`, {}),
    unarchive: (id: Id) =>
      apiPut<void>(`${PATHS.notifications}/${ensureId(id, 'notificationId')}/unarchive`, {}),
    remove: (id: Id) =>
      apiDelete<void>(`${PATHS.notifications}/${ensureId(id, 'notificationId')}`),
  },

  // ============= System Admins =============
  systemAdmins: {
    me: {
      get: () => apiGet<SystemAdminProfile>(`${PATHS.systemAdmins}/me`),
      update: (body: Partial<SystemAdminProfile>) =>
        apiPatch<SystemAdminProfile>(`${PATHS.systemAdmins}/me`, body),
    },
  },

  // ============= Company Admins =============
  companyAdmins: {
    list: () => apiGet<CompanyAdminProfile[]>(PATHS.companyAdmins),
    get: (id: Id) => apiGet<CompanyAdminProfile>(`${PATHS.companyAdmins}/${id}`),
    update: (id: Id, body: Partial<CompanyAdminProfile>) =>
      apiPatch<CompanyAdminProfile>(`${PATHS.companyAdmins}/${id}`, body),
    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.companyAdmins}/${id}`),
    me: {
      get: () => apiGet<CompanyAdminProfile>(`${PATHS.companyAdmins}/me`),
      update: (body: Partial<CompanyAdminProfile>) =>
        apiPatch<CompanyAdminProfile>(`${PATHS.companyAdmins}/me`, body),
      remove: () => apiDelete<{ message?: string }>(`${PATHS.companyAdmins}/me`),
    },
  },

  // ============= University Users =============
  universityUsers: {
    list: () => apiGet<UniversityUserProfile[]>(PATHS.universityUsers),
    get: (id: Id) => apiGet<UniversityUserProfile>(`${PATHS.universityUsers}/${id}`),
    update: (id: Id, body: Partial<UniversityUserProfile>) =>
      apiPatch<UniversityUserProfile>(`${PATHS.universityUsers}/${id}`, body),
    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.universityUsers}/${id}`),
    me: {
      get: () => apiGet<UniversityUserProfile>(`${PATHS.universityUsers}/me`),
      update: (body: Partial<UniversityUserProfile>) =>
        apiPatch<UniversityUserProfile>(`${PATHS.universityUsers}/me`, body),
      remove: () => apiDelete<{ message?: string }>(`${PATHS.universityUsers}/me`),
    },
  },

  // ============= Employees =============
  employees: {
    list: () => apiGet<EmployeeProfile[]>(PATHS.employees),
    listMentors: () => apiGet<EmployeeProfile[]>(`${PATHS.employees}/mentors`),
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
  ApplicationCreatePayload,
  Location,
  Tag,
  Partnership,
  PartnershipStatus,
} from '../types/api.types';
export type {
  NotificationCreatePayload,
  NotificationDetails,
  NotificationItem,
  NotificationUnreadCount,
} from '../types/notifications.types';
