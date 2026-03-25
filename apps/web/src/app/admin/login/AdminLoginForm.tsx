'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
    if (password !== DEMO_PASSWORD) {
      setError('Geçersiz şifre. Demo için ipucuna bakın.');
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
    <div className="flex min-h-screen flex-col justify-center bg-[#061018] px-6 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#0C1929] p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Yönetim</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Kiram paneli</h1>
        <p className="mt-2 text-sm text-white/50">
          Demo giriş — şifre: <span className="font-mono text-accent-light">{DEMO_PASSWORD}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="[&_label]:text-white/70 [&_input]:text-white [&_input]:placeholder:text-white/30">
            <Input
              type="password"
              label="Şifre"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!password}>
            Giriş yap
          </Button>
        </form>
      </div>
    </div>
  );
}
