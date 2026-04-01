'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  audienceLabelTr,
  estimateBroadcastRecipients,
  formatRecipientCountTr,
  type BroadcastAudience,
} from '@/lib/admin/broadcastAudienceEstimate';
import {
  initialBroadcastHistory,
  loadBroadcastHistoryFromStorage,
  saveBroadcastHistoryToStorage,
  type BroadcastHistoryRow,
} from '@/lib/admin/mockBroadcastHistory';
import { BroadcastDevicePreview } from '@/components/admin/BroadcastDevicePreview';

function formatHistoryDateTime(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export default function AdminBroadcastPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<BroadcastAudience>('test_users');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [history, setHistory] = useState<BroadcastHistoryRow[]>(initialBroadcastHistory);

  useEffect(() => {
    const stored = loadBroadcastHistoryFromStorage();
    if (stored) {
      queueMicrotask(() => {
        setHistory(stored);
      });
    }
  }, []);

  const recipientCount = estimateBroadcastRecipients(audience);
  const countLabel = formatRecipientCountTr(recipientCount);
  const isMassAudience = audience === 'active_only' || audience === 'all';

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  const executeSend = () => {
    const t = title.trim();
    const b = body.trim();
    const count = estimateBroadcastRecipients(audience);
    setConfirmOpen(false);
    setLoading(true);
    setSent(false);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      const row: BroadcastHistoryRow = {
        id: `b-${Date.now()}`,
        createdAt: new Date().toISOString(),
        audience,
        recipientCount: count,
        title: t,
        bodyPreview: b.length > 140 ? `${b.slice(0, 140)}…` : b,
        channel: 'demo',
        sentByEmail: 'admin@kiram.com',
      };
      setHistory(h => {
        const next = [row, ...h].slice(0, 80);
        saveBroadcastHistoryToStorage(next);
        return next;
      });
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Toplu duyuru</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Push bildirim ile kullanıcılara duyuru (Blueprint: bildirimler modülü — gönderimler izlenebilir olmalı).
          Önce <strong className="font-semibold text-text-primary">test kullanıcıları</strong> ile deneyin; gönderimden
          önce çift onay istenir.           Aşağıdaki geçmiş üretimde veritabanı ve denetim günlüğünde tutulmalıdır. Şu an demo: tarayıcıda yerel
          saklama + örnek satırlar; gerçek gönderim ve operatör kimliği API ile yazılır.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(260px,300px)] lg:items-start">
        <form onSubmit={handleFormSubmit} className="space-y-5 rounded-2xl border border-border bg-elevated p-6">
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
          <span className="text-sm font-semibold text-text-secondary" id="audience-label">
            Hedef kitle (demo)
          </span>
          <div
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
            role="radiogroup"
            aria-labelledby="audience-label"
          >
            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5">
              <input
                type="radio"
                name="audience"
                checked={audience === 'test_users'}
                onChange={() => setAudience('test_users')}
                className="accent-accent mt-0.5"
              />
              <span>
                <span className="block text-sm font-medium text-text-primary">Test kullanıcıları</span>
                <span className="mt-0.5 block text-xs leading-snug text-text-tertiary">
                  Yalnızca tanımlı test hesapları / cihaz tokenları (ör. sizin telefonunuz, operasyon veya güvenilir
                  ekip cihazları). Canlı kitlenize gitmez — binlerce kişiye yanlış mesaj gitmeden önce metni ve
                  görünümü doğrulamak için kullanın.
                </span>
              </span>
            </label>
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
              Gerçek bildirim gönderilmedi. Backend ve push altyapısı hazır olduğunda bu form aynı yerden
              bağlanacak.
              {audience === 'test_users' ? (
                <>
                  {' '}
                  Üretimde <strong className="font-semibold text-text-primary">test kullanıcıları</strong> seçildiğinde
                  yalnızca yapılandırılmış test cihazlarına push gidecek; canlı segmentler etkilenmeyecek.
                </>
              ) : null}
            </p>
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} disabled={!canSubmit || confirmOpen}>
          {audience === 'test_users' ? 'Test bildirimi gönder (demo)' : 'Gönder (demo)'}
        </Button>
        </form>

        <BroadcastDevicePreview title={title} body={body} />
      </div>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="presentation"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="broadcast-confirm-title"
            className="w-full max-w-md rounded-2xl border border-border bg-elevated p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="broadcast-confirm-title" className="text-lg font-bold text-text-primary">
              Gönderimi onaylayın
            </h3>
            {isMassAudience ? (
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Bu mesaj tahmini <strong className="font-semibold text-text-primary">{countLabel}</strong> kullanıcıya
                gönderilecektir. Push bildirimleri geri alınamaz; yanlış içerik büyük kitleye ulaşır. Onaylıyor
                musunuz?
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Bu bildirim yalnızca tanımlı test cihazlarına (tahmini{' '}
                <strong className="font-semibold text-text-primary">{countLabel}</strong> alıcı) gönderilecektir.
                Onaylıyor musunuz?
              </p>
            )}
            {isMassAudience ? (
              <div
                className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950"
                role="alert"
              >
                Canlı gönderim: çift kontrol. Üretimde kesin alıcı sayısı sunucu önizlemesi ile doğrulanır.
              </div>
            ) : null}
            <div className="mt-4 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-secondary">
              <p className="font-semibold text-text-primary line-clamp-2">{title.trim() || '—'}</p>
              <p className="mt-1 line-clamp-3 text-text-tertiary">{body.trim() || '—'}</p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setConfirmOpen(false)}>
                Vazgeç
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={executeSend}>
                Evet, gönder
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="space-y-3" aria-labelledby="broadcast-history-heading">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 id="broadcast-history-heading" className="text-lg font-bold text-text-primary">
            Geçmiş duyurular
          </h3>
          <p className="text-xs text-text-tertiary">Ne zaman · kime (segment + tahmini sayı) · ne gönderildi · kim</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 font-semibold text-text-secondary">Tarih / saat</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Hedef kitle</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Başlık</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Mesaj özeti</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Gönderen</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Kayıt</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                      Henüz kayıt yok.
                    </td>
                  </tr>
                ) : (
                  history.map(row => (
                    <tr key={row.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums text-text-secondary">
                        {formatHistoryDateTime(row.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary">{audienceLabelTr(row.audience)}</p>
                        <p className="text-xs text-text-tertiary tabular-nums">
                          ~{formatRecipientCountTr(row.recipientCount)} alıcı
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium text-text-primary max-w-[10rem]">
                        <span className="line-clamp-2">{row.title}</span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary max-w-[14rem]">
                        <span className="line-clamp-2 text-xs leading-snug">{row.bodyPreview}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary tabular-nums">{row.sentByEmail ?? '—'}</td>
                      <td className="px-4 py-3">
                        {row.channel === 'demo' ? (
                          <Badge variant="warning">Demo</Badge>
                        ) : (
                          <Badge variant="success">Push</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
