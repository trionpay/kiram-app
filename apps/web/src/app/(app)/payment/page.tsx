'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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

const SAVED_CARDS = [
  { id: '1', last4: '4242', brand: 'Visa', holder: 'AHMET YILMAZ' },
  { id: '2', last4: '1881', brand: 'Mastercard', holder: 'AHMET YILMAZ' },
];

const STEPS = ['Tip', 'Alıcı', 'Tutar', 'Kart', 'Onay'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`
            flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors
            ${i < current ? 'bg-accent text-white' : i === current ? 'bg-primary text-white' : 'bg-surface text-text-tertiary'}
          `}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-8 transition-colors ${i < current ? 'bg-accent' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PaymentPage() {
  const [step, setStep] = useState<Step>('type');
  const [paymentType, setPaymentType] = useState<PaymentType>('rent');
  const [recipient, setRecipient] = useState('');
  const [ibanName, setIbanName] = useState('');
  const [billCategory, setBillCategory] = useState('');
  const [billCompany, setBillCompany] = useState('');
  const [billRef, setBillRef] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCard, setSelectedCard] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultStatus>('success');

  const stepIndex: Record<Step, number> = {
    type: 0, recipient: 1, amount: 2, card: 3, confirm: 4, result: 4,
  };

  const handleConfirmPay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setResult('success');
    setStep('result');
  };

  const handleReset = () => {
    setStep('type');
    setRecipient('');
    setIbanName('');
    setBillCategory('');
    setBillCompany('');
    setBillRef('');
    setAmount('');
    setDescription('');
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
              ? `₺${amount} tutarındaki ödemeniz başarıyla gerçekleşti.`
              : 'Ödeme işlemi sırasında bir sorun oluştu.'}
          </p>
        </div>
        {isSuccess && (
          <div className="bg-surface rounded-2xl p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Tutar</span>
              <span className="font-semibold text-text-primary">₺{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Alıcı</span>
              <span className="font-semibold text-text-primary">{paymentType === 'rent' ? (ibanName || recipient) : billCompany}</span>
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
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Ödeme Yap</h1>
        <p className="text-text-secondary text-sm mt-1">Kira, aidat veya fatura ödemesi yapın.</p>
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
                onClick={() => setPaymentType(opt.value)}
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
          <button onClick={() => setStep('type')} className="text-accent text-sm font-semibold hover:underline">
            ← Geri
          </button>
          <h2 className="font-semibold text-text-primary">Alıcı bilgileri</h2>

          {paymentType === 'rent' ? (
            <div className="space-y-4">
              <Input
                label="IBAN"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              />
              {recipient.length > 20 && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Hesap Doğrulandı</p>
                    <p className="text-green-600 text-xs">Ahmet Yılmaz</p>
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
                      onClick={() => setBillCategory(cat.id)}
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
              <Input
                label="Kurum adı"
                placeholder="TEDAŞ, İGDAŞ, vb."
                value={billCompany}
                onChange={e => setBillCompany(e.target.value)}
              />
              <Input
                label="Abone / Referans No"
                placeholder="12345678"
                value={billRef}
                onChange={e => setBillRef(e.target.value)}
              />
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep('amount')}
            disabled={paymentType === 'rent' ? recipient.length < 26 : !billCompany || !billRef}
          >
            Devam Et
          </Button>
        </div>
      )}

      {/* STEP: Amount */}
      {step === 'amount' && (
        <div className="space-y-6">
          <button onClick={() => setStep('recipient')} className="text-accent text-sm font-semibold hover:underline">
            ← Geri
          </button>
          <h2 className="font-semibold text-text-primary">Tutar girin</h2>

          <div className="bg-elevated rounded-3xl p-8 text-center border border-border">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-text-secondary">₺</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-5xl font-bold text-text-primary bg-transparent outline-none w-48 text-center placeholder:text-text-tertiary"
                autoFocus
              />
            </div>
            <p className="text-text-tertiary text-sm mt-2">
              {paymentType === 'rent' ? (ibanName || 'Alıcı') : (billCompany || 'Kurum')}
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep('card')}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Devam Et
          </Button>
        </div>
      )}

      {/* STEP: Card */}
      {step === 'card' && (
        <div className="space-y-5">
          <button onClick={() => setStep('amount')} className="text-accent text-sm font-semibold hover:underline">
            ← Geri
          </button>
          <h2 className="font-semibold text-text-primary">Ödeme kartı seçin</h2>

          <div className="space-y-3">
            {SAVED_CARDS.map(card => (
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

            <button className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border text-text-tertiary hover:border-accent/40 hover:text-accent transition-all text-sm font-medium">
              <span className="text-xl">+</span> Yeni kart ekle
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
          <button onClick={() => setStep('card')} className="text-accent text-sm font-semibold hover:underline">
            ← Geri
          </button>
          <h2 className="font-semibold text-text-primary">Ödeme özeti</h2>

          <div className="bg-elevated rounded-3xl p-6 space-y-4 border border-border">
            <div className="text-center pb-4 border-b border-border">
              <p className="text-text-tertiary text-sm mb-1">Ödenecek tutar</p>
              <p className="text-4xl font-bold text-text-primary">₺{amount}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Alıcı', value: paymentType === 'rent' ? (ibanName || 'Hesap sahibi') : billCompany },
                { label: 'Ödeme tipi', value: paymentType === 'rent' ? 'Kira / Havale' : 'Fatura / Aidat' },
                { label: 'Kart', value: `•••• ${SAVED_CARDS.find(c => c.id === selectedCard)?.last4}` },
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
    </div>
  );
}
