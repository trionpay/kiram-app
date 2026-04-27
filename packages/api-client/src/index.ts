import type {
  AdminBroadcastRequest,
  AdminBroadcastResponse,
  AdminTransactionsSummary,
  ApiRecipient,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentQuoteRequest,
  PaymentQuoteResponse
} from '@kiram/shared-types';

export type ApiConfig = {
  baseUrl: string;
  env: 'sandbox' | 'production';
  getAuthToken?: () => string | null | undefined;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

export function createApiClient(config: ApiConfig) {
  const baseUrl = normalizeBaseUrl(config.baseUrl);

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = config.getAuthToken?.();
    const headers = new Headers(init?.headers ?? {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers
    });

    const text = await res.text();
    const payload = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new ApiError(
        payload?.error?.message ?? `Request failed with status ${res.status}`,
        res.status,
        payload?.error?.code
      );
    }

    return payload as T;
  }

  return {
    getBaseUrl: () => baseUrl,
    getEnv: () => config.env,

    health: () => request<{ status: string; service: string; env: string; supabaseConfigured: boolean }>('/health'),
    info: () => request<{ service: string; version: string; scope: string[] }>('/api/v1'),

    listRecipients: (search?: string) =>
      request<{ items: ApiRecipient[] }>(`/api/v1/recipients${search ? `?search=${encodeURIComponent(search)}` : ''}`),

    quotePayment: (body: PaymentQuoteRequest) =>
      request<PaymentQuoteResponse>('/api/v1/payments/quote', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    createPayment: (body: CreatePaymentRequest) =>
      request<CreatePaymentResponse>('/api/v1/payments', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    getAdminTransactionsSummary: () =>
      request<AdminTransactionsSummary>('/api/v1/admin/transactions/summary'),

    createAdminBroadcast: (body: AdminBroadcastRequest) =>
      request<AdminBroadcastResponse>('/api/v1/admin/broadcasts', {
        method: 'POST',
        body: JSON.stringify(body)
      })
  };
}
