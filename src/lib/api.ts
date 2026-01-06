const API_URL = import.meta.env.VITE_API_URL;

type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number | string;
    email: string;
    role: string; // "STUDENT" | "ADMIN" | ...
  };
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

  // próbáljuk JSON-ként olvasni a hibaüzenetet is
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ha nem JSON
  }

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status} hiba`;
    throw new Error(msg);
  }

  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    apiPost<LoginResponse>("/auth/login", { email, password }),

  // később:
  // register: (payload) => apiPost("/auth/register", payload),
};
