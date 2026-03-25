/**
 * Mock yönetici hesapları — çoklu yönetici senaryosu için allowlist.
 * Production: veritabanı / IdP; şifreler asla istemcide sabit olmamalı.
 */
export const MOCK_ADMIN_SHARED_PASSWORD = 'kiram-admin-demo';

const ALLOWED_EMAILS = new Set([
  'admin@kiram.com',
  'operasyon@kiram.com',
  'destek@kiram.com',
]);

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowedMockAdminEmail(email: string): boolean {
  return ALLOWED_EMAILS.has(normalizeAdminEmail(email));
}

export const MOCK_ADMIN_EMAIL_HINTS = [...ALLOWED_EMAILS].sort();
