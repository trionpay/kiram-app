'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

type Step = 'phone' | 'otp';

function formatPhone(digits: string) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  const handleSendCode = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('otp');
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    router.push('/dashboard');
  };

  const isOtpComplete = otp.every(d => d !== '');

  if (step === 'otp') {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setStep('phone')}
          className="text-2xl text-text-primary hover:opacity-70 transition-opacity"
        >
          ←
        </button>

        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Doğrulama kodu</h2>
          <p className="text-text-secondary">
            <span className="font-semibold text-text-primary">+90 {formatPhone(phone)}</span> numarasına SMS kodu gönderdik.
          </p>
        </div>

        {/* OTP kutuları */}
        <div className="flex gap-3 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              className={`
                w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none
                transition-colors bg-elevated text-text-primary
                ${digit ? 'border-accent' : 'border-border focus:border-accent'}
              `}
            />
          ))}
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleVerify}
          disabled={!isOtpComplete}
          loading={loading}
        >
          Giriş Yap
        </Button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-text-tertiary text-sm">
              Kodu tekrar gönder <span className="font-semibold text-text-secondary">({countdown}s)</span>
            </p>
          ) : (
            <button
              onClick={handleSendCode}
              className="text-accent text-sm font-semibold hover:underline"
            >
              Kodu tekrar gönder
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Telefon<br />numaranız
        </h2>
        <p className="text-text-secondary">Hesabınıza giriş yapmak için telefon numaranızı girin.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-elevated border border-border rounded-2xl px-4 h-14 focus-within:border-accent transition-colors">
          <span className="text-xl">🇹🇷</span>
          <span className="font-semibold text-text-primary text-sm">+90</span>
          <div className="w-px h-5 bg-border" />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="555 123 4567"
            value={formatPhone(phone)}
            onChange={handlePhoneChange}
            className="flex-1 bg-transparent outline-none text-base text-text-primary placeholder:text-text-tertiary"
            autoFocus
          />
        </div>

        <p className="text-xs text-text-tertiary">
          Numaranıza tek kullanımlık doğrulama kodu gönderilecektir.
        </p>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSendCode}
        disabled={phone.length < 10}
        loading={loading}
      >
        Kodu Gönder
      </Button>
    </div>
  );
}
