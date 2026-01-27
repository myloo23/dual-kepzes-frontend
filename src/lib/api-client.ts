import { API_CONFIG } from '../config/app.config';
import { auth } from './auth-token';
import type { ApiErrorBody } from '../types/common.types';

const API_URL = API_CONFIG.BASE_URL;

async function apiRequest<T>(
  path: string,
  init: RequestInit,
  token?: string
): Promise<T> {
  const jwt = token !== undefined ? token : auth.getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store',
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
    data = null;
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

export function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' }, token);
}

export function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
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

export function apiPut<T>(path: string, body: unknown, token?: string): Promise<T> {
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

export function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
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

export function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' }, token);
}
