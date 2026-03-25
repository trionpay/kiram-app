'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Audience = 'all' | 'active_only';

export default function AdminBroadcastPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Audience>('active_only');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/admin"
          className="text-sm font-semibold text-accent hover:underline"
        >
          ← Özete dön
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-text-primary">Toplu duyuru</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Push bildirim ile kullanıcılara duyuru (Blueprint: bildirimler modülü). Şu an yalnızca form
          iskeleti; gönderim API ve FCM/APNs bağlanınca etkinleşecek.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-elevated p-6">
        <Input
          label="Başlık"
          placeholder="Örn. Planlı bakım duyurusu"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-secondary" htmlFor="broadcast-body">
            Mesaj
          </label>
          <textarea
            id="broadcast-body"
            rows={4}
            placeholder="Kullanıcılara gidecek kısa metin…"
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full resize-y rounded-2xl border border-border bg-elevated px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-text-secondary">Hedef kitle (demo)</span>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5">
              <input
                type="radio"
                name="audience"
                checked={audience === 'active_only'}
                onChange={() => setAudience('active_only')}
                className="accent-accent"
              />
              <span className="text-sm font-medium text-text-primary">Yalnızca aktif kullanıcılar</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5">
              <input
                type="radio"
                name="audience"
                checked={audience === 'all'}
                onChange={() => setAudience('all')}
                className="accent-accent"
              />
              <span className="text-sm font-medium text-text-primary">Tüm kayıtlı kullanıcılar</span>
            </label>
          </div>
        </div>

        {sent && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary">Demo modu</p>
            <p className="mt-1">
              Gerçek bildirim gönderilmedi. Backend ve push altyapısı hazır olduğunda bu form aynı
              yerden bağlanacak.
            </p>
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} disabled={!canSubmit}>
          Gönder (demo)
        </Button>
      </form>
    </div>
  );
}
