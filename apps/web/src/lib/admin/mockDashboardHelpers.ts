import { initialMockTransactions } from '@/lib/admin/mockTransactions';
import { initialMockUsers } from '@/lib/admin/mockUsers';

export function getRecentTransactionsForDashboard(limit = 5) {
  return [...initialMockTransactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getRecentRegistrationsForDashboard(limit = 5) {
  return [...initialMockUsers]
    .filter(u => !u.archived)
    .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
    .slice(0, limit);
}
