import { API_CONFIG } from "../config/app.config";
import { auth } from "./auth-token";
import type { ApiErrorBody } from "../types/common.types";

const API_URL = API_CONFIG.BASE_URL;

interface SuccessWrapper {
  success: true;
  data: unknown;
}

interface PaginationWrapper {
  data: unknown[];
  pagination: unknown;
}

function isSuccessWrapper(v: unknown): v is SuccessWrapper {
  return (
    typeof v === "object" &&
    v !== null &&
    "success" in v &&
    "data" in v &&
    (v as Record<string, unknown>).success === true
  );
}

function isPaginationWrapper(v: unknown): v is PaginationWrapper {
  return (
    typeof v === "object" &&
    v !== null &&
    "data" in v &&
    "pagination" in v &&
    Array.isArray((v as Record<string, unknown>).data)
  );
}

async function apiRequest<T>(
  path: string,
  init: RequestInit,
  token?: string,
): Promise<T> {
  const jwt = token !== undefined ? token : auth.getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.headers || {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  let data: unknown = null;

  try {
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch {
    data = null;
  }

  if (!res.ok) {
    const body = data as ApiErrorBody;

    // Handle new error format: error.message
    let msg = "";

    if (
      body?.error &&
      typeof body.error === "object" &&
      "message" in body.error
    ) {
      msg = body.error.message || "";
    } else if (typeof body?.error === "string") {
      msg = body.error;
    }

    // Fallbacks
    if (!msg) {
      msg =
        body?.message ||
        (Array.isArray(body?.errors) && body.errors[0]?.message) ||
        `HTTP ${res.status} hiba`;
    }

    throw new Error(msg);
  }

  // Auto-unwrap generic API responses
  // If the response follows { success: true, data: T }, return T
  if (isSuccessWrapper(data)) {
    return data.data as T;
  }

  // Fallback for pagination specific check if success is missing but pagination exists (robustness)
  if (isPaginationWrapper(data)) {
    return data.data as T;
  }

  return (data ?? {}) as T;
}

export function apiGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
  token?: string,
): Promise<T> {
  let url = path;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  return apiRequest<T>(url, { method: "GET" }, token);
}

export function apiPost<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token,
  );
}

export function apiPostFormData<T>(
  path: string,
  body: FormData,
  token?: string,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      body,
    },
    token,
  );
}

export function apiPut<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token,
  );
}

export function apiPatch<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token,
  );
}

export function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE" }, token);
}
