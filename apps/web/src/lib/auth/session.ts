import { cookies } from 'next/headers';
import { getBackendBaseUrl } from '@/app/api/internal/_lib/backend';
import { WEB_SESSION_COOKIE } from './constants';

export async function validateUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(WEB_SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  const response = await fetch(`${getBackendBaseUrl()}/api/v1/auth/session`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${sessionToken}` },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const payload = await response.json().catch(() => null);
  return payload?.user ?? null;
}
