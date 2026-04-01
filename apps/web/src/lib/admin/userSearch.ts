import type { AdminUserRow } from '@/lib/admin/mockUsers';

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

/**
 * Blueprint: ad, soyad, telefon veya TCKN ile kullanıcı bulma (admin askıya alma öncesi).
 */
export function userMatchesAdminSearch(u: AdminUserRow, raw: string): boolean {
  const q = raw.trim();
  if (!q) return true;

  const ql = q.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();
  const name = u.name.toLocaleLowerCase('tr-TR');

  if (name.includes(ql)) return true;

  const tokens = ql.split(' ').filter(Boolean);
  if (tokens.length > 1) {
    const nameWords = name.split(/\s+/).filter(Boolean);
    const everyTokenMatches = tokens.every(tok =>
      nameWords.some(w => w.includes(tok) || w.startsWith(tok)),
    );
    if (everyTokenMatches) return true;
  }

  const qDigits = digitsOnly(q);
  if (qDigits.length >= 3) {
    const pd = digitsOnly(u.phone);
    const td = digitsOnly(u.tckn);
    if (pd.includes(qDigits) || td.includes(qDigits)) return true;
  }

  return false;
}
