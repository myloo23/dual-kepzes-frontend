const API_URL = import.meta.env.VITE_API_URL;
//LOGIN, REGISTRATION API
type LoginResponse = {
  message: string;
  token: string;
  user: { id: number | string; email: string; role: string };
};

export type RegisterResponse = {
  message: string;
  userId?: number | string;
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
  neptunCode?: string;
  currentMajor: string;
  studyMode: "NAPPALI" | "LEVELEZŐ";
  hasLanguageCert: boolean;
};


async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status} hiba`);
  }

  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    apiPost<LoginResponse>("/api/auth/login", { email, password }),
  registerStudent: (payload: StudentRegisterPayload) =>
    apiPost<RegisterResponse>("/api/auth/register", payload),
};

//REGISTRATION API
