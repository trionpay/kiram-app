import type { TransactionStatus } from '@/lib/admin/mockTransactions';

/** İşlem logları: `?durum=…` → dahili filtre */
export function transactionFilterFromDurumParam(raw: string | null): 'all' | TransactionStatus {
  switch (raw) {
    case 'basarili':
      return 'success';
    case 'basarisiz':
      return 'failed';
    case 'bekleyen':
      return 'pending';
    case 'tumu':
    default:
      return 'all';
  }
}

export type AdminUserListFilter = 'all' | 'active' | 'archived' | 'suspended';

/** Kullanıcılar: `?segment=…` → dahili filtre */
export function userListFilterFromSegmentParam(raw: string | null): AdminUserListFilter {
  switch (raw) {
    case 'askida':
      return 'suspended';
    case 'arsiv':
      return 'archived';
    case 'tumu':
      return 'all';
    case 'aktif':
    default:
      return 'active';
  }
}
