/**
 * API Client
 * Centralized API communication layer with proper type safety
 */

import { API_CONFIG, AUTH_CONFIG } from '../config/app.config';
import type { ApiErrorBody, Id } from '../types/common.types';
import type {
  LoginResponse,
  RegisterResponse,
  StudentRegisterPayload,
  Company,
  Position,
  StudentProfile,
  CompanyAdminProfile,
  UniversityUserProfile,
  SystemAdminProfile,
  User,
  StatsResponse,
  NewsItem,
  NewsCreatePayload,
  Application,
  ApplicationCreatePayload,
} from '../types/api.types';

const API_URL = API_CONFIG.BASE_URL;

// ============= Token Management =============
export const auth = {
  getToken: (): string =>
    localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) ||
    localStorage.getItem(AUTH_CONFIG.LEGACY_TOKEN_KEY) ||
    '',

  setToken: (token: string): void =>
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token),

  clearToken: (): void => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.LEGACY_TOKEN_KEY);
  },
};

// ============= Utility Functions =============
function ensureId(id: Id, label = 'id'): string {
  const s = String(id ?? '').trim();
  if (!s) throw new Error(`Hiányzó ${label}.`);
  return s;
}

// ============= API Request Handler =============
async function apiRequest<T>(
  path: string,
  init: RequestInit,
  token?: string
): Promise<T> {
  // If token is explicitly provided (even as empty string), use it
  // Otherwise, get token from storage
  const jwt = token !== undefined ? token : auth.getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store', // Disable caching to ensure fresh data
    headers: {
      ...(init.headers || {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  });

  const contentType = res.headers.get('content-type') || '';
  let data: unknown = null;

  try {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch {
    data = null; // e.g., 204 No Content
  }

  if (!res.ok) {
    const body = data as ApiErrorBody;

    const msg =
      body?.error ||
      body?.message ||
      (Array.isArray(body?.errors) && body.errors[0]?.message) ||
      `HTTP ${res.status} hiba`;

    throw new Error(msg);
  }

  return (data ?? {}) as T;
}

// ============= HTTP Method Helpers =============
function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' }, token);
}

function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    token
  );
}

function apiPut<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    token
  );
}

function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    token
  );
}

function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' }, token);
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
      apiPut<StudentProfile>(`${PATHS.students}/${id}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.students}/${id}`),
  },

  // ============= Current User Profile =============
  me: {
    get: () => apiGet<StudentProfile>(PATHS.me),

    update: (body: Partial<StudentProfile>) =>
      apiPut<StudentProfile>(PATHS.me, body),

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
    },
  },

  // ============= Employees =============
  employees: {
    me: {
      get: () => apiGet<CompanyAdminProfile>(`${PATHS.employees}/me`),
      update: (body: Partial<CompanyAdminProfile>) =>
        apiPut<CompanyAdminProfile>(`${PATHS.employees}/me`, body),
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
} from '../types/api.types';
