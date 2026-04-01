/**
 * Fatura bayii API: abone / referans doğrulama (borç sorgusu öncesi veya aynı uç).
 * Üretimde gerçek HTTP yanıtına map edilir; şimdilik deterministik mock.
 */

export type BillSubscriberValidationError = {
  ok: false;
  /** Sağlayıcı / log için kod */
  code: string;
  /** Kullanıcıya gösterilen Türkçe mesaj */
  message: string;
  /** Varsa ilgili alanı vurgula */
  field?: 'subscriberRef';
};

export type BillSubscriberValidationResult =
  | { ok: true }
  | BillSubscriberValidationError;

export type ValidateBillSubscriberParams = {
  categoryId: string;
  providerId: string;
  subscriberRef: string;
};

/**
 * Mock kurallar (demo / QA):
 * - `00000000` → abone bulunamadı
 * - `api-hata` → genel kurum / ağ hatası (alan yerine üst banner)
 */
export async function validateBillSubscriber(
  params: ValidateBillSubscriberParams
): Promise<BillSubscriberValidationResult> {
  await new Promise(r => setTimeout(r, 550));
  const ref = params.subscriberRef.trim();
  if (!params.categoryId || !params.providerId || !ref) {
    return {
      ok: false,
      code: 'INVALID_REQUEST',
      message: 'Kategori, kurum ve abone numarası zorunludur.',
    };
  }
  if (ref === '00000000') {
    return {
      ok: false,
      code: 'SUBSCRIBER_NOT_FOUND',
      message: 'Abone numarası bulunamadı veya seçtiğiniz kuruma ait değil. Bilgileri kontrol edin.',
      field: 'subscriberRef',
    };
  }
  if (ref.toLowerCase() === 'api-hata') {
    return {
      ok: false,
      code: 'PROVIDER_ERROR',
      message: 'Kurum şu an yanıt vermiyor. Lütfen bir süre sonra tekrar deneyin.',
    };
  }
  return { ok: true };
}
