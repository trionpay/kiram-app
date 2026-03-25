'use client';

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from '@/lib/admin/constants';

const ONE_DAY_SEC = 60 * 60 * 24;

export function setAdminMockSession() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=${ADMIN_SESSION_VALUE}; Path=/; Max-Age=${ONE_DAY_SEC}; SameSite=Lax`;
}

export function clearAdminMockSession() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
