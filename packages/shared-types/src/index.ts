/**
 * Trion Pay / Kiram.com — Paylaşılan tip tanımları.
 * Mobil ve web uygulamaları bu paketi kullanır.
 */

export type TransactionStatus = 'success' | 'failed' | 'pending';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  recipientName: string;
  recipientIban?: string;
  status: TransactionStatus;
  createdAt: string;
  referenceNo?: string;
  fee?: number;
}

export interface Recipient {
  id: string;
  name: string;
  iban: string;
  nickname?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** KYC tamamlandı mı */
  kycVerified?: boolean;
}
