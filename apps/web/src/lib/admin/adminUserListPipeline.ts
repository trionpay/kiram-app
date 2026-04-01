import type { AdminUserRow } from '@/lib/admin/mockUsers';
import { userMatchesAdminSearch } from '@/lib/admin/userSearch';

export type UserTabFilter = 'all' | 'active' | 'archived' | 'suspended';

/** "Tümü" sekmesinde ek daraltma */
export type AllTabRefine = 'any' | 'active' | 'suspended' | 'archived';

export type SortColumn = 'name' | 'phone' | 'tckn' | 'registeredAt' | 'kyc' | 'status';

export type SortDir = 'asc' | 'desc';

export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

export function defaultSortDirForColumn(col: SortColumn): SortDir {
  if (col === 'registeredAt' || col === 'kyc') return 'desc';
  return 'asc';
}

function accountStatusRank(u: AdminUserRow): number {
  if (u.archived) return 2;
  if (u.suspended) return 1;
  return 0;
}

export function compareUsersForSort(
  a: AdminUserRow,
  b: AdminUserRow,
  col: SortColumn,
  dir: SortDir,
): number {
  const m = dir === 'asc' ? 1 : -1;
  switch (col) {
    case 'name':
      return m * a.name.localeCompare(b.name, 'tr');
    case 'phone':
      return m * a.phone.replace(/\D/g, '').localeCompare(b.phone.replace(/\D/g, ''));
    case 'tckn':
      return m * a.tckn.localeCompare(b.tckn);
    case 'registeredAt':
      return m * a.registeredAt.localeCompare(b.registeredAt);
    case 'kyc': {
      const va = a.kycApproved ? 1 : 0;
      const vb = b.kycApproved ? 1 : 0;
      return m * (va - vb);
    }
    case 'status':
      return m * (accountStatusRank(a) - accountStatusRank(b));
    default:
      return 0;
  }
}

export function filterUsersPipeline(
  users: AdminUserRow[],
  opts: {
    tab: UserTabFilter;
    allRefine: AllTabRefine;
    search: string;
    registeredFrom: string;
    registeredTo: string;
    sortColumn: SortColumn;
    sortDir: SortDir;
  },
): AdminUserRow[] {
  let list = [...users];

  switch (opts.tab) {
    case 'active':
      list = list.filter(u => !u.archived && !u.suspended);
      break;
    case 'archived':
      list = list.filter(u => u.archived);
      break;
    case 'suspended':
      list = list.filter(u => u.suspended && !u.archived);
      break;
    default:
      break;
  }

  if (opts.tab === 'all' && opts.allRefine !== 'any') {
    switch (opts.allRefine) {
      case 'active':
        list = list.filter(u => !u.archived && !u.suspended);
        break;
      case 'suspended':
        list = list.filter(u => u.suspended && !u.archived);
        break;
      case 'archived':
        list = list.filter(u => u.archived);
        break;
      default:
        break;
    }
  }

  list = list.filter(u => userMatchesAdminSearch(u, opts.search));

  if (opts.registeredFrom) {
    list = list.filter(u => u.registeredAt >= opts.registeredFrom);
  }
  if (opts.registeredTo) {
    list = list.filter(u => u.registeredAt <= opts.registeredTo);
  }

  list.sort((a, b) => compareUsersForSort(a, b, opts.sortColumn, opts.sortDir));
  return list;
}
