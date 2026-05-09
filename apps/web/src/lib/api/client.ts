import { createApiClient } from '@kiram/api-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const internalUserToken = process.env.INTERNAL_USER_TOKEN ?? null;

export const webApiClient = createApiClient({
  baseUrl: apiBaseUrl,
  env: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  getAuthToken: () => internalUserToken
});
