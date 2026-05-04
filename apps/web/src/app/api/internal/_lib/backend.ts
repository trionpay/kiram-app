const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
const INTERNAL_USER_TOKEN = process.env.INTERNAL_USER_TOKEN || '';
const INTERNAL_ADMIN_TOKEN = process.env.INTERNAL_ADMIN_TOKEN || '';

type Role = 'user' | 'admin';
type BackendPayload = {
  error?: {
    message?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
} | null;

export function getBackendBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }
  return API_BASE_URL.replace(/\/+$/, '');
}

function getRoleToken(role: Role) {
  const token = role === 'admin' ? INTERNAL_ADMIN_TOKEN : INTERNAL_USER_TOKEN;
  if (!token) {
    throw new Error(`INTERNAL_${role.toUpperCase()}_TOKEN is not configured`);
  }
  return token;
}

export async function backendRequest(path: string, init: RequestInit = {}, role: Role = 'user') {
  const headers = new Headers(init.headers ?? {});
  headers.set('Authorization', `Bearer ${getRoleToken(role)}`);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  });

  const text = await response.text();
  let payload: BackendPayload = null;
  if (text) {
    try {
      payload = JSON.parse(text) as BackendPayload;
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      payload
    };
  }

  return {
    ok: true as const,
    status: response.status,
    payload
  };
}
