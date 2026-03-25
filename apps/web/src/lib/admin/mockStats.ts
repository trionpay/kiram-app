export interface AdminDashboardStats {
  todayVolumeTry: number;
  successfulCount: number;
  failedCount: number;
  newRegistrationsToday: number;
}

export const mockDashboardStats: AdminDashboardStats = {
  todayVolumeTry: 128_450.75,
  successfulCount: 142,
  failedCount: 8,
  newRegistrationsToday: 23,
};
