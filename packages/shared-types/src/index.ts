/**
 * Trion Pay / Kiram.com — Paylaşılan tip tanımları.
 * Mobil ve web uygulamaları bu paketi kullanır.
 */

export type TransactionStatus = 'success' | 'failed' | 'pending';
export type PaymentType = 'rent' | 'dues';

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

export interface ApiRecipient {
  id: string;
  nickname: string;
  accountHolder: string;
  iban: string;
  paymentType: PaymentType;
}

export interface PaymentQuoteRequest {
  paymentType: PaymentType;
  amountTry: number;
  recipientIban: string;
}

export interface PaymentQuoteResponse {
  paymentType: PaymentType;
  amountTry: number;
  feeTry: number;
  totalTry: number;
}

export interface CreatePaymentRequest extends PaymentQuoteRequest {
  cardToken: string;
  description?: string;
}

export interface CreatePaymentResponse extends PaymentQuoteResponse {
  transactionId: string;
  status: 'success';
}

export interface AdminTransactionsSummary {
  totals: Record<PaymentType, number>;
  pendingCount: number;
  successRate: number;
}

export interface AdminBroadcastRequest {
  title: string;
  body: string;
  audience: 'all' | 'active' | 'test';
}

export interface AdminBroadcastResponse {
  id: string;
  status: 'queued';
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
