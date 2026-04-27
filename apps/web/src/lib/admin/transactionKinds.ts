import type { TransactionPaymentKind } from '@/lib/admin/mockTransactions';

export const PAYMENT_KIND_META: Record<
  TransactionPaymentKind,
  { icon: string; shortLabel: string; searchTerms: string }
> = {
  rent: { icon: '🏠', shortLabel: 'Kira', searchTerms: 'kira havale iban' },
  dues: { icon: '🏢', shortLabel: 'Aidat', searchTerms: 'aidat site yönetim' },
};
