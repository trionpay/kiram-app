/**
 * Aidat / kurum ödemeleri — ödenebilir yönetim listesi.
 * Üretimde kurum API'sinden kategoriye göre çekilecek; şimdilik mock.
 */

export type BillProvider = { id: string; name: string };

const MOCK_BY_CATEGORY: Record<string, BillProvider[]> = {
  dues: [
    { id: 'site-yonetim-ornek', name: 'Site / Apartman yönetimi (örnek)' },
    { id: 'aidat-merkez-ornek', name: 'Aidat ödeme merkezi (örnek)' },
  ],
};

/** Aidat kurum API yanıtı ile doldurulacak liste; şimdilik kategoriye göre mock. */
export function getBillProvidersForCategorySync(categoryId: string): BillProvider[] {
  return MOCK_BY_CATEGORY[categoryId] ?? [];
}

/**
 * Aidat kurum API: `GET ...?category={categoryId}` entegrasyonu için async sözleşme.
 * Şimdilik `getBillProvidersForCategorySync` ile aynı veriyi döner.
 */
export async function fetchBillProvidersForCategory(categoryId: string): Promise<BillProvider[]> {
  await new Promise(r => setTimeout(r, 280));
  return getBillProvidersForCategorySync(categoryId);
}
