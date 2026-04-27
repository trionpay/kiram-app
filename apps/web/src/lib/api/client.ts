import { createApiClient } from '@kiram/api-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const webApiClient = createApiClient({
  baseUrl: apiBaseUrl,
  env: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  // TODO: replace with real JWT/session token retrieval when auth is integrated.
  getAuthToken: () => null
});
