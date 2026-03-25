'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';
import {
  MOCK_ADMIN_EMAIL_HINTS,
  MOCK_ADMIN_SHARED_PASSWORD,
  isAllowedMockAdminEmail,
  normalizeAdminEmail,
} from '@/lib/admin/mockAdmins';
import { setAdminMockSession } from '@/lib/admin/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const em = normalizeAdminEmail(email);
    const pw = password.trim();

    if (!EMAIL_RE.test(em)) {
      setError('Geçerli bir kurumsal e-posta girin.');
      return;
    }
    if (!isAllowedMockAdminEmail(em)) {
      setError('Bu e-posta ile panele giriş yetkisi yok (demo allowlist).');
      return;
    }
    if (pw !== MOCK_ADMIN_SHARED_PASSWORD) {
      setError('Şifre hatalı. Demo şifreyi aynen kullanın (baş/son boşluk olmasın).');
      return;
    }

    setLoading(true);
    setAdminMockSession(em);
    const target = from.startsWith('/admin') ? from : '/admin';
    router.push(target);
    router.refresh();
    setLoading(false);
  };

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #102A43, #0C1929, #061018)' }}
      >
        <div>
          <TrionPayLogo width={130} color="#FFFFFF" accentColor="#5FE00B" />
        </div>
        <div className="space-y-4">
          <div className="w-9 h-0.5 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-white leading-snug">
            Yönetim paneli
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Yetkili yönetici hesaplarıyla giriş. Demo ortamında allowlist ve ortak şifre kullanılır;
            production’da sunucu doğrulaması ve güvenli oturum kullanılacaktır.
          </p>
        </div>
        <p className="text-white/25 text-xs tracking-widest uppercase">kiram.com</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <TrionPayLogo width={110} color="#0C1929" accentColor="#5FE00B" />
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-xs font-bold tracking-widest text-text-tertiary uppercase">
              Yönetim
            </p>
            <h2 className="text-3xl font-bold text-text-primary leading-tight">
              Panele giriş
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Demo şifre:{' '}
              <span
                className="font-mono font-semibold text-accent select-all bg-accent/5 px-1.5 py-0.5 rounded-md"
                title="Seçip kopyalayabilirsiniz"
              >
                {MOCK_ADMIN_SHARED_PASSWORD}
              </span>
            </p>
            <p className="text-text-tertiary text-xs leading-relaxed">
              Örnek yönetici e-postaları:{' '}
              {MOCK_ADMIN_EMAIL_HINTS.map((e, i) => (
                <span key={e}>
                  {i > 0 ? ', ' : ''}
                  <span className="font-mono text-text-secondary">{e}</span>
                </span>
              ))}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Kurumsal e-posta"
              placeholder="ornek@kiram.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
            <Input
              type="password"
              label="Şifre"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && <p className="text-sm font-medium text-error">{error}</p>}
            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!canSubmit}>
              Giriş yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
