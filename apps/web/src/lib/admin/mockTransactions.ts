export type TransactionStatus = 'success' | 'failed';

export interface AdminTransactionRow {
  id: string;
  userId: string;
  userLabel: string;
  amountTry: number;
  status: TransactionStatus;
  createdAt: string;
  description: string;
}

export const initialMockTransactions: AdminTransactionRow[] = [
  {
    id: 't1',
    userId: 'u1',
    userLabel: 'Ayşe Y.',
    amountTry: 4_500,
    status: 'success',
    createdAt: '2025-03-25T09:12:00',
    description: 'Kira ödemesi',
  },
  {
    id: 't2',
    userId: 'u2',
    userLabel: 'Mehmet K.',
    amountTry: 890.5,
    status: 'success',
    createdAt: '2025-03-25T10:03:00',
    description: 'Fatura',
  },
  {
    id: 't3',
    userId: 'u1',
    userLabel: 'Ayşe Y.',
    amountTry: 1_200,
    status: 'failed',
    createdAt: '2025-03-25T11:45:00',
    description: 'Aidat',
  },
  {
    id: 't4',
    userId: 'u4',
    userLabel: 'Can Ö.',
    amountTry: 12_000,
    status: 'success',
    createdAt: '2025-03-24T16:20:00',
    description: 'Kira ödemesi',
  },
  {
    id: 't5',
    userId: 'u3',
    userLabel: 'Zeynep D.',
    amountTry: 350,
    status: 'failed',
    createdAt: '2025-03-24T08:00:00',
    description: 'Fatura',
  },
];
