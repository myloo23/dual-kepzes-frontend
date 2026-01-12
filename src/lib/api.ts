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
  const jwt = token ?? auth.getToken();

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
  zipCode: string;
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
export type Company = {
  id: Id;
  name: string;
  taxId: string;
  hqCountry: string;
  hqZipCode: string;
  hqCity: string;
  hqAddress: string;
  contactName: string;
  contactEmail: string;
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
  zipCode: string;
  city: string;
  address: string;
  deadline: string; // "yyyy-MM-ddTHH:mm:ssZ"
  tags: Tag[];
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

// ----------------- ENDPOINT konstansok -----------------
const PATHS = {
  companies: "/api/jobs/companies",
  positions: "/api/jobs/positions",
  students: "/api/students",
  me: "/api/students/me",
  stats: "/api/stats",
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
    listPublic: async () => {
      try {
        return await apiGet<Position[]>(PATHS.positions, "");
      } catch (error) {
        const fallbackPaths = [
          `${PATHS.positions}/public`,
          `${PATHS.positions}/active`,
        ];
        let lastError = error;
        for (const path of fallbackPaths) {
          try {
            return await apiGet<Position[]>(path, "");
          } catch (fallbackError) {
            lastError = fallbackError;
          }
        }
        throw lastError;
      }
    },
    get: (id: Id) => apiGet<Position>(`${PATHS.positions}/${id}`),
    create: (payload: Omit<Position, "id">) =>
      apiPost<Position>(PATHS.positions, payload),

    // ✅ PATCH
    update: (id: Id, body: Partial<Omit<Position, "id">>) =>
      apiPatch<Position>(`${PATHS.positions}/${id}`, body),

    remove: (id: Id) =>
      apiDelete<{ message?: string }>(`${PATHS.positions}/${id}`),
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
};
