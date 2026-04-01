import { mockDashboardStats } from '@/lib/admin/mockStats';

export type BroadcastAudience = 'all' | 'active_only' | 'test_users';

/**
 * Push alıcı sayısı tahmini (mock).
 * Üretimde gönderim öncesi API `POST /broadcast/preview` ile kesin sayı döner.
 */
export function estimateBroadcastRecipients(audience: BroadcastAudience): number {
  switch (audience) {
    case 'test_users':
      return 5;
    case 'active_only':
      return mockDashboardStats.activeUsersCount;
    case 'all':
      return 10_452;
    default:
      return 0;
  }
}

export function formatRecipientCountTr(n: number): string {
  return n.toLocaleString('tr-TR');
}

export function audienceLabelTr(audience: BroadcastAudience): string {
  switch (audience) {
    case 'test_users':
      return 'Test kullanıcıları';
    case 'active_only':
      return 'Aktif kullanıcılar';
    case 'all':
      return 'Tüm kayıtlı kullanıcılar';
    default:
      return audience;
  }
}
