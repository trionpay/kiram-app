/**
 * Fatura / kurum ödemeleri — ödenebilir kurum listesi.
 * Üretimde fatura bayii API’sinden kategoriye göre çekilecek; şimdilik mock.
 */

export type BillProvider = { id: string; name: string };

const MOCK_BY_CATEGORY: Record<string, BillProvider[]> = {
  electricity: [
    { id: 'baskent-edas', name: 'Başkent EDAŞ' },
    { id: 'boedas', name: 'BOEDAŞ' },
    { id: 'akdeniz-edas', name: 'Akdeniz EDAŞ' },
    { id: 'toroslar-edas', name: 'Toroslar EDAŞ' },
    { id: 'yedas', name: 'YEDAŞ' },
  ],
  gas: [
    { id: 'igdas', name: 'İGDAŞ' },
    { id: 'baskent-gaz', name: 'Başkent Doğalgaz' },
    { id: 'izmir-gaz', name: 'İzmir Gaz' },
    { id: 'enerya', name: 'Enerya' },
  ],
  water: [
    { id: 'iski', name: 'İSKİ' },
    { id: 'aski', name: 'ASKİ' },
    { id: 'eskisehir-su', name: 'Eskişehir Su ve Kanalizasyon' },
    { id: 'saski', name: 'SASKİ' },
  ],
  internet: [
    { id: 'turk-telekom', name: 'Türk Telekom' },
    { id: 'turknet', name: 'Turknet' },
    { id: 'superonline', name: 'Superonline' },
    { id: 'd-smart', name: 'D-Smart Net' },
  ],
  phone: [
    { id: 'turkcell', name: 'Turkcell' },
    { id: 'vodafone', name: 'Vodafone' },
    { id: 'turk-telekom-mob', name: 'Türk Telekom Mobil' },
  ],
  dues: [
    { id: 'site-yonetim-ornek', name: 'Site / Apartman yönetimi (örnek)' },
    { id: 'aidat-merkez-ornek', name: 'Aidat ödeme merkezi (örnek)' },
  ],
};

/** Fatura bayii API yanıtı ile doldurulacak liste; şimdilik kategoriye göre mock. */
export function getBillProvidersForCategorySync(categoryId: string): BillProvider[] {
  return MOCK_BY_CATEGORY[categoryId] ?? [];
}

/**
 * Fatura bayii API: `GET ...?category={categoryId}` entegrasyonu için async sözleşme.
 * Şimdilik `getBillProvidersForCategorySync` ile aynı veriyi döner.
 */
export async function fetchBillProvidersForCategory(categoryId: string): Promise<BillProvider[]> {
  await new Promise(r => setTimeout(r, 280));
  return getBillProvidersForCategorySync(categoryId);
}
