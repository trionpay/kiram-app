export interface AdminDashboardStats {
  todayVolumeTry: number;
  successfulCount: number;
  failedCount: number;
  newRegistrationsToday: number;
  /** Bekleyen işlem (mock) */
  pendingCount: number;
  /** Son 24 saat başarı oranı % */
  successRateLast24hPercent: number;
  /** Aktif kullanıcı (mock: askıda/arşivde olmayan) */
  activeUsersCount: number;
  /** Son 7 gün günlük hacim (Pzt…Paz kısaltması) */
  volumeLast7DaysTry: { label: string; amountTry: number }[];
}

export const mockDashboardStats: AdminDashboardStats = {
  todayVolumeTry: 128_450.75,
  successfulCount: 142,
  failedCount: 8,
  newRegistrationsToday: 23,
  pendingCount: 3,
  successRateLast24hPercent: 94.6,
  activeUsersCount: 1_842,
  volumeLast7DaysTry: [
    { label: 'Pzt', amountTry: 82_000 },
    { label: 'Sal', amountTry: 95_400 },
    { label: 'Çar', amountTry: 71_200 },
    { label: 'Per', amountTry: 103_800 },
    { label: 'Cum', amountTry: 118_000 },
    { label: 'Cmt', amountTry: 45_300 },
    { label: 'Paz', amountTry: 128_450.75 },
  ],
};
