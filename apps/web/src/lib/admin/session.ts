'use client';

import {
  ADMIN_EMAIL_COOKIE,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
} from '@/lib/admin/constants';

const ONE_DAY_SEC = 60 * 60 * 24;

export function setAdminMockSession(email: string) {
  if (typeof document === 'undefined') return;
  const normalized = email.trim().toLowerCase();
  const enc = encodeURIComponent(normalized);
  document.cookie = `${ADMIN_EMAIL_COOKIE}=${enc}; Path=/; Max-Age=${ONE_DAY_SEC}; SameSite=Lax`;
  document.cookie = `${ADMIN_SESSION_COOKIE}=${ADMIN_SESSION_VALUE}; Path=/; Max-Age=${ONE_DAY_SEC}; SameSite=Lax`;
}

export function clearAdminMockSession() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ADMIN_EMAIL_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
