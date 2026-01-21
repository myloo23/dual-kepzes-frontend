const API_URL = import.meta.env.VITE_API_URL;

// --- Token kezelés ---
export const auth = {
  getToken: () =>
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    "",
  setToken: (t: string) => localStorage.setItem("token", t),
  clearToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
  },
};

type Id = string | number;

function ensureId(id: Id, label = "id") {
  const s = String(id ?? "").trim();
  if (!s) throw new Error(`Hiányzó ${label}.`);
  return s;
}

type ApiErrorBody =
  | {
    message?: string;
    error?: string;
    errors?: Array<{ field?: string; message?: string }>;
  }
  | any;

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
    headers: {
      ...(init.headers || {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  let data: any = null;

  try {
    if (contentType.includes("application/json")) data = await res.json();
    else data = await res.text();
  } catch {
    data = null; // pl. 204 No Content
  }

  if (!res.ok) {
    const body: ApiErrorBody = data;

    const msg =
      body?.error ||                                      // ✅ részletes error
      body?.message ||
      (Array.isArray(body?.errors) && body.errors[0]?.message) ||
      `HTTP ${res.status} hiba`;

    throw new Error(msg);
  }

  return (data ?? ({} as any)) as T;
}

// --- Helper metódusok ---
function apiGet<T>(path: string, token?: string) {
  return apiRequest<T>(path, { method: "GET" }, token);
}

function apiPost<T>(path: string, body: unknown, token?: string) {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token
  );
}

function apiPut<T>(path: string, body: unknown, token?: string) {
  return apiRequest<T>(
    path,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token
  );
}

function apiPatch<T>(path: string, body: unknown, token?: string) {
  return apiRequest<T>(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token
  );
}

function apiDelete<T>(path: string, token?: string) {
  return apiRequest<T>(path, { method: "DELETE" }, token);
}

// ----------------- MODELLEK -----------------

// Auth
type LoginResponse = {
  message: string;
  token: string;
  user: { id: Id; email: string; role: string };
};

export type RegisterResponse = {
  message: string;
  userId?: Id;
  role?: string;
};

export type StudentRegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: "STUDENT";
  mothersName: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  country: string;
  zipCode: number; // Backend expects number
  city: string;
  streetAddress: string;
  highSchool: string;
  graduationYear: number;
  neptunCode?: string | null;
  currentMajor: string;
  studyMode: "NAPPALI" | "LEVELEZŐ";
  hasLanguageCert: boolean;
};

// Admin / Cégek
// Új Location típus
export type Location = {
  id?: Id;
  country?: string; // Csak cégeknél van a példa szerint, de lehet opcionális
  zipCode: string | number;
  city: string;
  address: string;
};

export type Company = {
  id: Id;
  name: string;
  taxId: string;
  // hq fields replaced by locations
  locations: Location[];
  contactName: string;
  contactEmail: string;
  description?: string;
  logoUrl?: string | null;
  website?: string | null;
};

export type Tag = {
  name: string;
  category?: string;
};

export type Position = {
  id: Id;
  companyId: string;
  title: string;
  description: string;
  location: Location; // flat location fields replaced by nested location object
  deadline: string; // "yyyy-MM-ddTHH:mm:ssZ"
  isDual?: boolean; // Backend field for dual training positions
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tags: Tag[];
  company?: {
    name: string;
    logoUrl?: string | null;
    locations: Location[]; // Company in position also has locations array
  };
};

export type StudentProfile = Record<string, any> & {
  id: Id;
  userId?: Id;
  fullName?: string;
  email?: string;
};

export type UsersByRole = {
  role: string;
  count: number;
};

export type StatsResponse = {
  totals: {
    users: number;
    companies: number;
    positions: number;
    applications: number;
    activePartnerships: number;
  };
  usersByRole: Array<{ role: string; count: number }>;
};

export type NewsTargetGroup = "STUDENT" | "ALL";

export type NewsItem = {
  id: Id;
  title: string;
  content: string; // Changed from body
  tags: string[];
  targetGroup: NewsTargetGroup; // Changed from audience
  important?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsCreatePayload = {
  title: string;
  content: string;
  tags: string[];
  targetGroup: NewsTargetGroup;
  important?: boolean;
};

// Applications
export type ApplicationStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED" | "NO_RESPONSE";

export type Application = {
  id: string;
  positionId: string;
  studentId: string;
  status: ApplicationStatus;
  studentNote?: string;
  companyNote?: string;
  createdAt: string;
  position?: {
    id: string;
    title: string;
    company: {
      name: string;
      logoUrl?: string | null;
    };
  };
};

export type ApplicationCreatePayload = {
  positionId: string;
  studentNote?: string; // max 500 chars
};

// ----------------- ENDPOINT konstansok -----------------
const PATHS = {
  companies: "/api/companies",
  positions: "/api/jobs/positions",
  students: "/api/students",
  me: "/api/students/me", // Default for students, others should use specific endpoints
  systemAdmins: "/api/system-admins",
  companyAdmins: "/api/company-admins",
  universityUsers: "/api/university-users",
  employees: "/api/employees",
  stats: "/api/stats",
  news: "/api/news"
};

// ----------------- API OBJEKTUM -----------------
export const api = {
  // auth
  login: (email: string, password: string) =>
    apiPost<LoginResponse>("/api/auth/login", { email, password }),

  registerStudent: (payload: StudentRegisterPayload) =>
    apiPost<RegisterResponse>("/api/auth/register", payload),

  // stats
  stats: {
    get: () => apiGet<StatsResponse>(PATHS.stats),
  },

  // companies CRUD
  // companies CRUD
  companies: {
    list: () => apiGet<Company[]>(PATHS.companies),
    get: (id: Id) => apiGet<Company>(`${PATHS.companies}/${ensureId(id, "companyId")}`),
    create: (payload: Omit<Company, "id">) =>
      apiPost<Company>(PATHS.companies, payload),

    update: (id: Id, body: Partial<Omit<Company, "id">>) =>
      apiPatch<Company>(`${PATHS.companies}/${ensureId(id, "companyId")}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.companies}/${ensureId(id, "companyId")}`),
  },


  // positions CRUD
  positions: {
    list: () => apiGet<Position[]>(PATHS.positions),

    // Public endpoint - no authentication required
    listPublic: () => apiGet<Position[]>(PATHS.positions, ""), // Empty string = no token

    // Helper methods for filtering by isDual flag
    listDualPositions: async () => {
      const positions = await apiGet<Position[]>(PATHS.positions);
      return positions.filter((p) => p.isDual === true);
    },

    listNonDualPositions: async () => {
      const positions = await apiGet<Position[]>(PATHS.positions);
      return positions.filter((p) => p.isDual === false);
    },

    get: (id: Id) => apiGet<Position>(`${PATHS.positions}/${id}`),
    create: (payload: Omit<Position, "id">) =>
      apiPost<Position>(PATHS.positions, payload),

    // ✅ PATCH
    update: (id: Id, body: Partial<Omit<Position, "id">>) =>
      apiPatch<Position>(`${PATHS.positions}/${id}`, body),
    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.positions}/${id}`),

    deactivate: (id: Id) =>
      apiPatch<{ message: string; position: Position }>(`${PATHS.positions}/${id}/deactivate`, {}),
  },

  // students / hallgatói profilok CRUD
  students: {
    list: () => apiGet<StudentProfile[]>(PATHS.students),
    get: (id: Id) => apiGet<StudentProfile>(`${PATHS.students}/${id}`),

    // ✅ PATCH helyett PUT a backend igény szerint
    update: (id: Id, body: Partial<StudentProfile>) =>
      apiPut<StudentProfile>(`${PATHS.students}/${id}`, body),

    remove: (id: Id) => apiDelete<{ message?: string }>(`${PATHS.students}/${id}`),
  },

  // saját profil
  me: {
    get: () => apiGet<Record<string, any>>(PATHS.me),
    update: (body: Record<string, any>) => apiPut<Record<string, any>>(PATHS.me, body),
    remove: () => apiDelete<{ message?: string }>(PATHS.me),
  },

  // news
  news: {
    // Public
    list: () => apiGet<NewsItem[]>(PATHS.news),
    get: (id: Id) => apiGet<NewsItem>(`${PATHS.news}/${id}`),

    // Admin
    admin: {
      list: () => apiGet<NewsItem[]>(`${PATHS.news}/admin`),
      listArchived: () => apiGet<NewsItem[]>(`${PATHS.news}/admin/archived`),
      get: (id: Id) => apiGet<NewsItem>(`${PATHS.news}/admin/${id}`),
      create: (payload: NewsCreatePayload) => apiPost<NewsItem>(`${PATHS.news}/admin`, payload),
      update: (id: Id, payload: Partial<NewsCreatePayload>) => apiPatch<NewsItem>(`${PATHS.news}/admin/${id}`, payload),
      archive: (id: Id) => apiPatch<void>(`${PATHS.news}/admin/${id}/archive`, {}),
      unarchive: (id: Id) => apiPatch<void>(`${PATHS.news}/admin/${id}/unarchive`, {}),
      remove: (id: Id) => apiDelete<void>(`${PATHS.news}/admin/${id}`),
    },


  },

  // applications
  applications: {
    submit: (payload: ApplicationCreatePayload) =>
      apiPost<{ message: string; application: Application }>("/api/applications", payload),

    list: () =>
      apiGet<Application[]>("/api/applications"),
  },

  // System Admins
  systemAdmins: {
    me: {
      get: () => apiGet<Record<string, any>>(`${PATHS.systemAdmins}/me`),
      update: (body: any) => apiPatch<Record<string, any>>(`${PATHS.systemAdmins}/me`, body),
    }
  },

  // Company Admins
  companyAdmins: {
    me: {
      get: () => apiGet<Record<string, any>>(`${PATHS.companyAdmins}/me`),
      update: (body: any) => apiPatch<Record<string, any>>(`${PATHS.companyAdmins}/me`, body),
    }
  },

  // University Users
  universityUsers: {
    me: {
      get: () => apiGet<Record<string, any>>(`${PATHS.universityUsers}/me`),
      update: (body: any) => apiPatch<Record<string, any>>(`${PATHS.universityUsers}/me`, body),
    }
  },

  // Employees
  employees: {
    me: {
      get: () => apiGet<Record<string, any>>(`${PATHS.employees}/me`),
      update: (body: any) => apiPut<Record<string, any>>(`${PATHS.employees}/me`, body),
    }
  }
};