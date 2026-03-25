'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';
import { setAdminMockSession } from '@/lib/admin/session';

/** Demo: gerçek auth gelince kaldırılır. */
const DEMO_PASSWORD = 'kiram-admin-demo';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const entered = password.trim();
    if (entered !== DEMO_PASSWORD) {
      setError('Şifre hatalı. Yukarıdaki demo şifreyi aynen kullanın (kopyalarken baş/son boşluk olmasın).');
      return;
    }
    setLoading(true);
    setAdminMockSession();
    const target = from.startsWith('/admin') ? from : '/admin';
    router.push(target);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol panel — kullanıcı auth layout ile aynı dil */}
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
            Kiram operasyonları için güvenli giriş. Bu ortamda demo hesabı kullanılır.
          </p>
        </div>
        <p className="text-white/25 text-xs tracking-widest uppercase">kiram.com</p>
      </div>

      {/* Sağ panel — ana uygulama light theme token’ları */}
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
                title="Tıklayıp seçebilir veya çift tıklayarak kopyalayabilirsiniz"
              >
                {DEMO_PASSWORD}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="password"
              label="Şifre"
              placeholder="Demo şifrenizi girin"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && <p className="text-sm font-medium text-error">{error}</p>}
            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!password}>
              Giriş yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
