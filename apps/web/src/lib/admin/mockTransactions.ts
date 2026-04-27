export type TransactionStatus = 'success' | 'failed' | 'pending';

/** Ödeme türü — liste ve raporlarda rozet/ikon ile gösterilir */
export type TransactionPaymentKind = 'rent' | 'dues';

export interface AdminTransactionRow {
  id: string;
  userId: string;
  userLabel: string;
  /** İşlem tutarı (alıcıya giden tutar) TRY */
  amountTry: number;
  /** Hizmet bedeli (komisyon) TRY — Blueprint dekont / admin ciro */
  feeTry: number;
  status: TransactionStatus;
  createdAt: string;
  paymentKind: TransactionPaymentKind;
  /** Kira: maskeli IBAN; aidat: kurum/yönetim kısaltması */
  recipientDetail: string;
  /** İşlem notu (bekleme nedeni vb.); isteğe bağlı */
  note?: string;
}

export const initialMockTransactions: AdminTransactionRow[] = [
  {
    id: 't1',
    userId: 'u1',
    userLabel: 'Ayşe Y.',
    amountTry: 4_500,
    feeTry: 67.5,
    status: 'success',
    createdAt: '2025-03-25T09:12:00',
    paymentKind: 'rent',
    recipientDetail: 'TR12 **** **** **** **** 5601',
  },
  {
    id: 't2',
    userId: 'u2',
    userLabel: 'Mehmet K.',
    amountTry: 890.5,
    feeTry: 13.36,
    status: 'success',
    createdAt: '2025-03-25T10:03:00',
    paymentKind: 'dues',
    recipientDetail: 'Site Yönetimi A Blok · Aidat',
  },
  {
    id: 't3',
    userId: 'u1',
    userLabel: 'Ayşe Y.',
    amountTry: 1_200,
    feeTry: 18,
    status: 'failed',
    createdAt: '2025-03-25T11:45:00',
    paymentKind: 'dues',
    recipientDetail: 'Site Yönetimi A Blok · Aidat',
  },
  {
    id: 't4',
    userId: 'u4',
    userLabel: 'Can Ö.',
    amountTry: 12_000,
    feeTry: 180,
    status: 'success',
    createdAt: '2025-03-24T16:20:00',
    paymentKind: 'rent',
    recipientDetail: 'TR98 **** **** **** **** 9024',
  },
  {
    id: 't5',
    userId: 'u3',
    userLabel: 'Zeynep D.',
    amountTry: 350,
    feeTry: 5.25,
    status: 'failed',
    createdAt: '2025-03-24T08:00:00',
    paymentKind: 'dues',
    recipientDetail: 'Apartman Yönetimi C Blok · Aidat',
  },
  {
    id: 't6',
    userId: 'u2',
    userLabel: 'Mehmet K.',
    amountTry: 2_100,
    feeTry: 31.5,
    status: 'pending',
    createdAt: '2025-03-25T14:02:00',
    paymentKind: 'rent',
    recipientDetail: 'TR12 **** **** **** **** 5601',
    note: '3D Secure / banka onayı bekleniyor',
  },
  {
    id: 't7',
    userId: 'u4',
    userLabel: 'Can Ö.',
    amountTry: 750,
    feeTry: 11.25,
    status: 'pending',
    createdAt: '2025-03-25T14:18:00',
    paymentKind: 'dues',
    recipientDetail: 'Site Yönetimi B Blok · Aidat',
    note: 'Webhook işleniyor',
  },
];
