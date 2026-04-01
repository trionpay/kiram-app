'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { getBillProvidersForCategorySync } from '@/lib/billing/billProviders';
import { validateBillSubscriber } from '@/lib/billing/validateBillSubscriber';

type PaymentType = 'rent' | 'bill';
type Step = 'type' | 'recipient' | 'amount' | 'card' | 'confirm' | 'result';
type ResultStatus = 'success' | 'failed' | 'insufficient';

const BILL_CATEGORIES = [
  { id: 'electricity', label: 'Elektrik', emoji: '⚡' },
  { id: 'gas', label: 'Doğalgaz', emoji: '🔥' },
  { id: 'water', label: 'Su', emoji: '💧' },
  { id: 'internet', label: 'İnternet', emoji: '📶' },
  { id: 'phone', label: 'Telefon', emoji: '📱' },
  { id: 'dues', label: 'Aidat', emoji: '🏢' },
];

type SavedCard = { id: string; last4: string; brand: string; holder: string };

const SAVED_BILL_SUBSCRIBERS_KEY = 'kiram_saved_bill_subscribers';

type SavedBillSubscriber = {
  id: string;
  categoryId: string;
  providerId: string;
  providerName: string;
  ref: string;
};

const INITIAL_SAVED_CARDS: SavedCard[] = [
  { id: '1', last4: '4242', brand: 'Visa', holder: 'AHMET YILMAZ' },
  { id: '2', last4: '1881', brand: 'Mastercard', holder: 'AHMET YILMAZ' },
];

function guessCardBrand(digits: string): string {
  const d = digits[0];
  if (d === '4') return 'Visa';
  if (d === '5' || d === '2') return 'Mastercard';
  if (d === '3') return 'Amex';
  return 'Kart';
}

const PAYMENT_STEPS = [
  { title: 'Ödeme tipi' },
  { title: 'Alıcı bilgisi' },
  { title: 'Tutar' },
  { title: 'Kart' },
  { title: 'Onay' },
] as const;

/** TR sonrası 24 karakter (2 kontrol + 22 BBAN). Yapıştırmada TR ve boşluk temizlenir. */
const TR_IBAN_REST_LEN = 24;

function normalizeTrIbanRest(raw: string): string {
  let s = raw.toUpperCase().replace(/\s/g, '').replace(/[^0-9A-Z]/g, '');
  if (s.startsWith('TR')) s = s.slice(2);
  return s.slice(0, TR_IBAN_REST_LEN);
}

/**
 * Tutar — tr-TR: binlik ayırıcı nokta (.), ondalık virgül (,).
 * State’te binlik nokta yok; sadece rakamlar + isteğe bağlı tek virgül ve en fazla 2 kuruş hanesi.
 */
const MAX_TRY_INTEGER_DIGITS = 12;

function normalizeTurkishAmountFromDisplay(raw: string): string {
  const s = raw.replace(/\s/g, '');
  const lastComma = s.lastIndexOf(',');
  let intRaw: string;
  let fracSource: string | undefined;
  if (lastComma >= 0) {
    intRaw = s.slice(0, lastComma);
    fracSource = s.slice(lastComma + 1);
  } else {
    intRaw = s;
  }
  const intDigits = intRaw.replace(/\./g, '').replace(/\D/g, '').slice(0, MAX_TRY_INTEGER_DIGITS);
  if (fracSource !== undefined) {
    const frac = fracSource.replace(/\D/g, '').slice(0, 2);
    if (frac.length > 0) return `${intDigits || '0'},${frac}`;
    return `${intDigits},`;
  }
  return intDigits;
}

function formatTurkishAmountDisplay(normalized: string): string {
  if (!normalized) return '';
  const commaIdx = normalized.indexOf(',');
  const intDigits =
    commaIdx >= 0 ? normalized.slice(0, commaIdx).replace(/\D/g, '') : normalized.replace(/\D/g, '');
  const frac =
    commaIdx >= 0 ? normalized.slice(commaIdx + 1).replace(/\D/g, '').slice(0, 2) : '';
  const intFmt = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (commaIdx >= 0) {
    if (frac.length > 0) return `${intFmt || '0'},${frac}`;
    return `${intFmt},`;
  }
  return intFmt;
}

function parseTurkishAmountToNumber(normalized: string): number {
  const t = normalized.trim();
  if (!t || t === ',') return NaN;
  return parseFloat(t.replace(',', '.'));
}

function formatTryFromNormalized(normalized: string): string {
  const d = formatTurkishAmountDisplay(normalized);
  return d ? `₺${d}` : '';
}

function StepBar({ current }: { current: number }) {
  const last = PAYMENT_STEPS.length - 1;
  return (
    <div className="mb-8 w-full" role="list" aria-label="Ödeme adımları">
      <div className="grid w-full grid-cols-5 gap-x-0">
        {PAYMENT_STEPS.map((step, i) => (
          <div key={step.title} className="flex min-w-0 flex-col items-center" role="listitem">
            <div className="flex w-full items-center">
              <div
                className={`h-0.5 min-w-0 flex-1 rounded-full transition-colors ${
                  i === 0 ? 'opacity-0' : i <= current ? 'bg-accent' : 'bg-border'
                }`}
                aria-hidden
              />
              <div
                className={`
                  relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors
                  ${
                    i < current
                      ? 'bg-accent text-white'
                      : i === current
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-tertiary'
                  }
                `}
              >
                {i < current ? '✓' : i + 1}
              </div>
              <div
                className={`h-0.5 min-w-0 flex-1 rounded-full transition-colors ${
                  i === last ? 'opacity-0' : i < current ? 'bg-accent' : 'bg-border'
                }`}
                aria-hidden
              />
            </div>
            <p
              className={`mt-2 max-w-[4.5rem] text-center text-[10px] font-semibold leading-tight sm:max-w-none sm:text-xs ${
                i === current
                  ? 'text-text-primary'
                  : i < current
                    ? 'text-accent'
                    : 'text-text-tertiary'
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const [step, setStep] = useState<Step>('type');
  const [paymentType, setPaymentType] = useState<PaymentType>('rent');
  /** Kira/havale: TR sabit; yalnızca sonraki 24 karakter (tam TR IBAN = 26) */
  const [ibanRest, setIbanRest] = useState('');
  const [ibanName, setIbanName] = useState('');
  const [billCategory, setBillCategory] = useState('');
  const [billProviderId, setBillProviderId] = useState('');
  const [billCompany, setBillCompany] = useState('');
  const [billRef, setBillRef] = useState('');
  const [billRefError, setBillRefError] = useState('');
  const [billRecipientError, setBillRecipientError] = useState('');
  const [billValidateLoading, setBillValidateLoading] = useState(false);
  const [saveBillSubscriber, setSaveBillSubscriber] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [savedCards, setSavedCards] = useState<SavedCard[]>(INITIAL_SAVED_CARDS);
  const [selectedCard, setSelectedCard] = useState('1');
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [newCardHolder, setNewCardHolder] = useState('AHMET YILMAZ');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultStatus>('success');

  useEffect(() => {
    if (!addCardOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAddCardOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [addCardOpen]);

  const billProviders = useMemo(() => {
    if (paymentType !== 'bill' || !billCategory) return [];
    return getBillProvidersForCategorySync(billCategory);
  }, [paymentType, billCategory]);

  const stepIndex: Record<Step, number> = {
    type: 0, recipient: 1, amount: 2, card: 3, confirm: 4, result: 4,
  };

  const showPaymentBack = step !== 'type' && step !== 'result';

  const clearBillRecipientErrors = () => {
    setBillRefError('');
    setBillRecipientError('');
  };

  const handleRecipientContinue = async () => {
    if (paymentType === 'rent') {
      setStep('amount');
      return;
    }
    clearBillRecipientErrors();
    setBillValidateLoading(true);
    try {
      const res = await validateBillSubscriber({
        categoryId: billCategory,
        providerId: billProviderId,
        subscriberRef: billRef.trim(),
      });
      if (!res.ok) {
        if (res.field === 'subscriberRef') {
          setBillRefError(res.message);
        } else {
          setBillRecipientError(res.message);
        }
        return;
      }
      setStep('amount');
    } finally {
      setBillValidateLoading(false);
    }
  };

  const goToPreviousPaymentStep = () => {
    switch (step) {
      case 'recipient':
        setStep('type');
        break;
      case 'amount':
        setStep('recipient');
        break;
      case 'card':
        setStep('amount');
        break;
      case 'confirm':
        setStep('card');
        break;
      default:
        break;
    }
  };

  const handleConfirmPay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (
      paymentType === 'bill' &&
      saveBillSubscriber &&
      billCategory &&
      billProviderId &&
      billRef.trim()
    ) {
      try {
        const raw = localStorage.getItem(SAVED_BILL_SUBSCRIBERS_KEY);
        const list: SavedBillSubscriber[] = raw ? JSON.parse(raw) : [];
        const entry: SavedBillSubscriber = {
          id: `${billCategory}-${billProviderId}-${billRef.trim()}`,
          categoryId: billCategory,
          providerId: billProviderId,
          providerName: billCompany,
          ref: billRef.trim(),
        };
        const next = [entry, ...list.filter(x => x.id !== entry.id)].slice(0, 20);
        localStorage.setItem(SAVED_BILL_SUBSCRIBERS_KEY, JSON.stringify(next));
      } catch {
        /* ignore corrupt storage */
      }
    }
    setResult('success');
    setStep('result');
  };

  const handleReset = () => {
    setStep('type');
    setIbanRest('');
    setIbanName('');
    setBillCategory('');
    setBillProviderId('');
    setBillCompany('');
    setBillRef('');
    setBillRefError('');
    setBillRecipientError('');
    setSaveBillSubscriber(false);
    setAmount('');
    setDescription('');
    setSavedCards(INITIAL_SAVED_CARDS);
    setSelectedCard('1');
    setAddCardOpen(false);
    setNewCardHolder('AHMET YILMAZ');
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
  };

  const openAddCardModal = () => {
    setNewCardHolder('AHMET YILMAZ');
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setAddCardOpen(true);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = newCardNumber.replace(/\D/g, '');
    if (digits.length < 13) return;
    const last4 = digits.slice(-4);
    const brand = guessCardBrand(digits);
    const holder = newCardHolder.trim() || 'KART SAHİBİ';
    const id = `c-${Date.now()}`;
    setSavedCards(prev => [...prev, { id, last4, brand, holder: holder.toUpperCase() }]);
    setSelectedCard(id);
    setAddCardOpen(false);
  };

  if (step === 'result') {
    const isSuccess = result === 'success';
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
          {isSuccess ? '✓' : '✗'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {isSuccess ? 'Ödeme Başarılı' : 'Ödeme Başarısız'}
          </h2>
          <p className="text-text-secondary">
            {isSuccess
              ? `${formatTryFromNormalized(amount)} tutarındaki ödemeniz başarıyla gerçekleşti.`
              : 'Ödeme işlemi sırasında bir sorun oluştu.'}
          </p>
        </div>
        {isSuccess && (
          <div className="bg-surface rounded-2xl p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Tutar</span>
              <span className="font-semibold text-text-primary">{formatTryFromNormalized(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Alıcı</span>
              <span className="font-semibold text-text-primary">
                {paymentType === 'rent' ? (ibanName || `TR${ibanRest}`) : billCompany}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Tarih</span>
              <span className="font-semibold text-text-primary">{new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={handleReset}>
            Yeni Ödeme
          </Button>
          <Button className="flex-1" onClick={() => window.location.href = '/history'}>
            Dekont
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Geri: başlık bloğunun solunda (stepper/form arasına sıkıştırılmaz) */}
      <div className={`flex ${showPaymentBack ? 'gap-3 sm:gap-4' : ''}`}>
        {showPaymentBack ? (
          <div className="flex shrink-0 flex-col items-start pt-0.5 sm:w-[8.5rem]">
            <button
              type="button"
              onClick={goToPreviousPaymentStep}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-border bg-elevated px-3 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition-colors hover:bg-surface sm:min-w-0 sm:px-4"
              aria-label="Önceki adıma dön"
            >
              <span className="text-base leading-none" aria-hidden>
                ←
              </span>
              <span className="hidden sm:inline">Geri</span>
            </button>
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-text-primary">Ödeme Yap</h1>
          <p className="mt-1 text-sm text-text-secondary">Kira, aidat veya fatura ödemesi yapın.</p>
        </div>
      </div>

      <StepBar current={stepIndex[step]} />

      {/* STEP: Type */}
      {step === 'type' && (
        <div className="space-y-4">
          <h2 className="font-semibold text-text-primary">Ödeme tipi seçin</h2>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'rent', emoji: '🏠', label: 'Kira / Havale', desc: 'IBAN ile ödeme' },
              { value: 'bill', emoji: '📋', label: 'Fatura / Aidat', desc: 'Kurum ödemesi' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setPaymentType(opt.value);
                  if (opt.value === 'rent') {
                    setBillCategory('');
                    setBillProviderId('');
                    setBillCompany('');
                    setBillRef('');
                    setBillRefError('');
                    setBillRecipientError('');
                    setSaveBillSubscriber(false);
                  }
                }}
                className={`
                  p-5 rounded-2xl border-2 text-left transition-all
                  ${paymentType === opt.value ? 'border-accent bg-accent/5' : 'border-border bg-elevated hover:border-accent/40'}
                `}
              >
                <div className="text-3xl mb-3">{opt.emoji}</div>
                <p className="font-semibold text-text-primary text-sm">{opt.label}</p>
                <p className="text-text-tertiary text-xs mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={() => setStep('recipient')}>
            Devam Et
          </Button>
        </div>
      )}

      {/* STEP: Recipient */}
      {step === 'recipient' && (
        <div className="space-y-5">
          <h2 className="font-semibold text-text-primary">Alıcı bilgileri</h2>

          {paymentType === 'rent' ? (
            <div className="space-y-4">
              <Input
                label="IBAN"
                hint="Sadece Türkiye IBAN kabul edilir. TR otomatik eklenir; 24 karakter girin (toplam 26)."
                placeholder="00 0000 0000 0000 0000 0000 00"
                prefix={<span className="font-semibold tracking-wide text-text-primary">TR</span>}
                value={ibanRest}
                onChange={e => setIbanRest(normalizeTrIbanRest(e.target.value))}
                autoCapitalize="characters"
                spellCheck={false}
                inputMode="text"
                maxLength={32}
              />
              {ibanRest.length === TR_IBAN_REST_LEN && (
                <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <span className="text-xl text-green-600">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Hesap Doğrulandı</p>
                    <p className="text-xs text-green-600">Ahmet Yılmaz</p>
                  </div>
                </div>
              )}
              <Input
                label="Açıklama (isteğe bağlı)"
                placeholder="Ocak 2025 kirası"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-3">Kategori</p>
                <div className="grid grid-cols-3 gap-2">
                  {BILL_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setBillCategory(cat.id);
                        setBillProviderId('');
                        setBillCompany('');
                        clearBillRecipientErrors();
                        setSaveBillSubscriber(false);
                      }}
                      className={`
                        p-3 rounded-2xl border-2 text-center transition-all
                        ${billCategory === cat.id ? 'border-accent bg-accent/5' : 'border-border bg-elevated hover:border-accent/40'}
                      `}
                    >
                      <div className="text-xl mb-1">{cat.emoji}</div>
                      <p className="text-xs font-medium text-text-primary">{cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-secondary" htmlFor="bill-provider">
                  Kurum
                </label>
                <div
                  className={`
                    flex h-14 items-center rounded-2xl border bg-elevated px-4 transition-colors
                    ${!billCategory ? 'border-border opacity-80' : 'border-border focus-within:border-accent'}
                  `}
                >
                  <select
                    id="bill-provider"
                    className="w-full cursor-pointer bg-transparent text-base font-medium text-text-primary outline-none disabled:cursor-not-allowed disabled:text-text-tertiary"
                    disabled={!billCategory || billProviders.length === 0}
                    value={billProviderId}
                    onChange={e => {
                      const id = e.target.value;
                      setBillProviderId(id);
                      const p = billProviders.find(x => x.id === id);
                      setBillCompany(p?.name ?? '');
                      clearBillRecipientErrors();
                    }}
                  >
                    <option value="">
                      {!billCategory
                        ? 'Önce kategori seçin'
                        : billProviders.length === 0
                          ? 'Bu kategori için kurum yok'
                          : 'Kurum seçin'}
                    </option>
                    {billProviders.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-text-tertiary">
                  Liste fatura bayii API üzerinden gelecek; şu an örnek veri kullanılıyor.
                </p>
              </div>
              <Input
                label="Abone / Referans No"
                placeholder="12345678"
                hint={
                  billRefError
                    ? undefined
                    : 'Devam Et ile kurumda kayıt kontrolü yapılır (fatura bayii API).'
                }
                error={billRefError || undefined}
                value={billRef}
                onChange={e => {
                  setBillRef(e.target.value);
                  if (billRefError) setBillRefError('');
                  if (billRecipientError) setBillRecipientError('');
                }}
                aria-invalid={billRefError ? true : undefined}
              />
              <Switch
                checked={saveBillSubscriber}
                onCheckedChange={setSaveBillSubscriber}
                label="Abone bilgilerimi kaydet"
                description="Sonraki fatura ödemelerinde hızlı doldurmak için bu cihazda saklanır (hesap bağlandığında sunucuya taşınır)."
              />
            </div>
          )}

          {paymentType === 'bill' && billRecipientError ? (
            <div
              role="alert"
              className="rounded-2xl border border-error/35 bg-red-50 px-4 py-3 text-sm text-error"
            >
              {billRecipientError}
            </div>
          ) : null}

          <Button
            className="w-full"
            size="lg"
            onClick={() => void handleRecipientContinue()}
            loading={paymentType === 'bill' && billValidateLoading}
            disabled={
              paymentType === 'rent'
                ? ibanRest.length !== TR_IBAN_REST_LEN
                : !billProviderId || !billRef.trim()
            }
          >
            Devam Et
          </Button>
        </div>
      )}

      {/* STEP: Amount */}
      {step === 'amount' && (
        <div className="space-y-6">
          <h2 className="font-semibold text-text-primary">Tutar girin</h2>

          <div className="rounded-2xl border border-border bg-elevated px-6 py-6 text-center sm:rounded-3xl sm:px-8 sm:py-7">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-2xl font-bold text-text-secondary sm:text-3xl">₺</span>
              <input
                type="text"
                inputMode="decimal"
                enterKeyHint="done"
                autoComplete="off"
                placeholder="0"
                value={formatTurkishAmountDisplay(amount)}
                onChange={e => setAmount(normalizeTurkishAmountFromDisplay(e.target.value))}
                className="min-w-[6rem] max-w-[min(100%,18rem)] bg-transparent text-center text-4xl font-bold tabular-nums text-text-primary outline-none placeholder:text-text-tertiary sm:text-5xl"
                autoFocus
                aria-describedby="amount-format-hint"
              />
            </div>
            <p id="amount-format-hint" className="mt-2 text-[11px] leading-snug text-text-tertiary sm:text-xs">
              Binlik ayırıcı nokta (.) ve kuruş için virgül (,) otomatik uygulanır. Örnek: 23.236,50
            </p>
            <p className="mt-2 text-xs leading-snug text-text-tertiary sm:text-sm">
              {paymentType === 'rent'
                ? ibanName
                  ? `Ödeme alıcısı: ${ibanName}`
                  : ibanRest.length >= 4
                    ? `Havale — IBAN sonu …${ibanRest.slice(-4)}`
                    : 'Kira / havale ödemesi'
                : billCompany
                  ? `Kurum: ${billCompany}`
                  : 'Fatura / kurum ödemesi'}
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep('card')}
            disabled={(() => {
              const n = parseTurkishAmountToNumber(amount);
              return !amount.trim() || Number.isNaN(n) || n <= 0;
            })()}
          >
            Devam Et
          </Button>
        </div>
      )}

      {/* STEP: Card */}
      {step === 'card' && (
        <div className="space-y-5">
          <h2 className="font-semibold text-text-primary">Ödeme kartı seçin</h2>

          <div className="space-y-3">
            {savedCards.map(card => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                  ${selectedCard === card.id ? 'border-accent bg-accent/5' : 'border-border bg-elevated hover:border-accent/40'}
                `}
              >
                <div className="w-12 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{card.brand.slice(0, 4)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary text-sm">•••• {card.last4}</p>
                  <p className="text-text-tertiary text-xs">{card.holder}</p>
                </div>
                {selectedCard === card.id && (
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}

            <button
              type="button"
              onClick={openAddCardModal}
              className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-border p-4 text-left text-sm font-medium text-text-tertiary transition-all hover:border-accent/40 hover:text-accent"
            >
              <span className="text-xl" aria-hidden>
                +
              </span>
              Yeni kart ekle
            </button>
          </div>

          <Button className="w-full" size="lg" onClick={() => setStep('confirm')}>
            Devam Et
          </Button>
        </div>
      )}

      {/* STEP: Confirm */}
      {step === 'confirm' && (
        <div className="space-y-5">
          <h2 className="font-semibold text-text-primary">Ödeme özeti</h2>

          <div className="bg-elevated rounded-3xl p-6 space-y-4 border border-border">
            <div className="text-center pb-4 border-b border-border">
              <p className="text-text-tertiary text-sm mb-1">Ödenecek tutar</p>
              <p className="text-4xl font-bold text-text-primary tabular-nums">
                {formatTryFromNormalized(amount)}
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Alıcı', value: paymentType === 'rent' ? (ibanName || 'Hesap sahibi') : billCompany },
                { label: 'Ödeme tipi', value: paymentType === 'rent' ? 'Kira / Havale' : 'Fatura / Aidat' },
                { label: 'Kart', value: `•••• ${savedCards.find(c => c.id === selectedCard)?.last4}` },
                ...(description ? [{ label: 'Açıklama', value: description }] : []),
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-text-tertiary">{row.label}</span>
                  <span className="font-semibold text-text-primary">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleConfirmPay} loading={loading}>
            Ödemeyi Onayla
          </Button>
          <p className="text-center text-xs text-text-tertiary">
            Ödeme işleminden önce 3D Secure doğrulaması istenebilir.
          </p>
        </div>
      )}

      {addCardOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="presentation"
          onClick={() => setAddCardOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-card-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-elevated p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 id="add-card-title" className="text-lg font-bold text-text-primary">
                Yeni kart ekle
              </h3>
              <button
                type="button"
                onClick={() => setAddCardOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface"
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <Input
                label="Kart üzerindeki isim"
                value={newCardHolder}
                onChange={e => setNewCardHolder(e.target.value)}
                autoComplete="cc-name"
              />
              <Input
                label="Kart numarası"
                hint="En az 13 hane (demo — gerçek ortamda tokenizasyon)"
                value={newCardNumber}
                onChange={e => setNewCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
                inputMode="numeric"
                autoComplete="cc-number"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="SKT (AA/YY)"
                  placeholder="12/28"
                  value={newCardExpiry}
                  onChange={e =>
                    setNewCardExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))
                  }
                  inputMode="numeric"
                  autoComplete="cc-exp"
                />
                <Input
                  label="CVV"
                  value={newCardCvv}
                  onChange={e => setNewCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setAddCardOpen(false)}
                >
                  Vazgeç
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={newCardNumber.replace(/\D/g, '').length < 13}
                >
                  Kaydet ve seç
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
