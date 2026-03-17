/**
 * Trion Pay / Kiram.com — API client (placeholder).
 * Ödeme kuruluşu API'si sağlandığında bu modül genişletilecek.
 * Mobil ve web bu paketi kullanarak API çağrıları yapar.
 */

export type ApiConfig = {
  baseUrl: string;
  /** Sandbox / Production */
  env: 'sandbox' | 'production';
};

export function createApiClient(config: ApiConfig) {
  return {
    getBaseUrl: () => config.baseUrl,
    getEnv: () => config.env,
  };
}
