'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

type DashboardStatDelta = 'outflow_up' | 'outflow_down' | 'neutral';

type DashboardStatCard = {
  label: string;
  hint: string;
  value: string;
  change: string;
  changeNote?: string;
  deltaTone: DashboardStatDelta;
};

function statDeltaClass(tone: DashboardStatDelta) {
  if (tone === 'outflow_up') return 'text-warning';
  if (tone === 'outflow_down') return 'text-success';
  return 'text-text-tertiary';
}

/** Özet kartları: çıkan ödeme artışı = turuncu (dikkat), azalış = yeşil; metinler metriği açıklar */
const STATS: DashboardStatCard[] = [
  {
    label: 'Bu ay ödemeleri',
    hint: 'Bu ay hesabınızdan çıkan, tamamlanan ödemelerin toplamıdır.',
    value: '₺14.700',
    change: '+%12',
    changeNote: 'Önceki aya göre',
    deltaTone: 'outflow_up',
  },
  {
    label: 'Bekleyen',
    hint: 'Periyodik kira tahsilatina kalan sure ve bekleyen odemelerin toplam tutari.',
    value: '₺12.000',
    change: '7 gün kaldı',
    changeNote: 'Periyodik kira · 1 bekleyen işlem',
    deltaTone: 'neutral',
  },
  {
    label: 'Kayıtlı ödeme hesabı',
    hint: 'Ödeme yapabileceğiniz kayıtlı IBAN / hesap sayısı.',
    value: '4',
    change: 'aktif',
    deltaTone: 'neutral',
  },
];

const RECENT_RECIPIENTS = [
  { id: '1', nickname: 'Apartman', emoji: '🏢', color: '#5B7FA6' },
  { id: '2', nickname: 'Ev Sahibi', emoji: '🏠', color: '#4A9B7F' },
  { id: '3', nickname: 'Site Yön.', emoji: '🏡', color: '#B56B6B' },
  { id: '4', nickname: 'Aidat Merkezi', emoji: '🧾', color: '#B8894A' },
  { id: '5', nickname: 'Kira Ofisi', emoji: '🏘️', color: '#6B7FA6' },
];

/** Dashboard üst bölümü — ödeme ekranına hızlı kısayol (mock sıklık sırası) */
const QUICK_PAY_RECIPIENTS = RECENT_RECIPIENTS.slice(0, 4);

const RECENT_TRANSACTIONS = [
  {
    id: '1',
    title: 'Apartman Aidatı',
    subtitle: 'Ocak 2025',
    amount: '₺850',
    status: 'success',
    date: '15 Oca',
    icon: '🏢',
    iconTint: '#5B7FA6',
  },
  {
    id: '2',
    title: 'Site Aidatı',
    subtitle: 'B Blok',
    amount: '₺620',
    status: 'success',
    date: '12 Oca',
    icon: '🏢',
    iconTint: '#5B7FA6',
  },
  {
    id: '3',
    title: 'Kira',
    subtitle: 'Ev Sahibi — Şub',
    amount: '₺12.000',
    status: 'pending',
    date: '1 Şub',
    icon: '🏠',
    iconTint: '#4A9B7F',
  },
  {
    id: '4',
    title: 'Apartman Aidatı',
    subtitle: 'C Blok',
    amount: '₺790',
    status: 'success',
    date: '8 Oca',
    icon: '🧾',
    iconTint: '#7C3AED',
  },
] as const;

const STATUS_BADGE: Record<string, React.ReactNode> = {
  success: <Badge variant="success">Başarılı</Badge>,
  pending: <Badge variant="pending">Beklemede</Badge>,
  failed: <Badge variant="error">Başarısız</Badge>,
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome kartı — daha net CTA hiyerarşisi */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/15 via-white to-accent/10 p-6 sm:p-7 shadow-[0_8px_30px_rgba(36,75,142,0.10)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Hoş geldiniz, Ahmet</h1>
            <p className="mt-2 text-sm sm:text-base text-text-secondary">
              Bu hafta <strong className="text-text-primary font-semibold">1 bekleyen ödeme</strong> bulunuyor.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/payment"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              Ödeme Yap
            </Link>
            <Link
              href="/history?durum=pending"
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface"
            >
              Bekleyenleri Gör
            </Link>
          </div>
        </div>
      </div>

      {/* Stats — etiket + kısa açıklama; gider artışı yeşil gösterilmez */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STATS.map(stat => (
          <div key={stat.label} className="rounded-2xl border border-border bg-elevated p-5 shadow-sm">
            <p className="text-xs font-semibold text-text-primary">{stat.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-text-secondary">{stat.hint}</p>
            <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">{stat.value}</p>
            <div className="mt-1.5">
              <p className={`text-xs font-semibold tabular-nums ${statDeltaClass(stat.deltaTone)}`}>
                {stat.change}
              </p>
              {stat.changeNote ? (
                <p className="mt-0.5 text-[11px] leading-snug text-text-tertiary">{stat.changeNote}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı ödeme — giriş yapmış kullanıcı için işlevsel alan (landing sloganı yok) */}
      <section
        className="rounded-2xl border border-border bg-elevated p-5 sm:p-6 shadow-sm"
        aria-labelledby="dashboard-quick-pay-heading"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 id="dashboard-quick-pay-heading" className="text-lg font-bold text-text-primary">
              Hızlı ödeme
            </h2>
            <p className="mt-1 text-sm text-text-secondary max-w-xl">
              Sık kullandığınız alıcılardan birini seçerek ödeme akışına geçin. Tutar ve kart adımlarını bir sonraki
              ekranda tamamlarsınız.
            </p>
          </div>
          <Link
            href="/payment"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light active:scale-[0.98]"
          >
            Ödeme akışına git <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">
            Sık kullanılan alıcılar
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PAY_RECIPIENTS.map(r => (
              <Link
                key={r.id}
                href="/payment"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                  style={{ backgroundColor: `${r.color}22`, border: `1px solid ${r.color}40` }}
                  aria-hidden
                >
                  {r.emoji}
                </span>
                <span className="max-w-[140px] truncate">{r.nickname}</span>
              </Link>
            ))}
            <Link
              href="/recipients"
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-text-tertiary" aria-hidden>
                +
              </span>
              Alıcı yönet
            </Link>
          </div>
        </div>
      </section>

      {/* İki kolon: Alıcılar + Son işlemler — üst başlıklar aynı grid hizasında */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        {/* Son Alıcılar — dar kolon */}
        <div className="flex h-full flex-col rounded-2xl border border-border bg-elevated p-5 lg:col-span-2">
          <header className="mb-4 flex min-h-11 shrink-0 items-center justify-between gap-3 border-b border-border pb-3">
            <h2 className="text-sm font-bold leading-tight text-text-primary">Son Alıcılar</h2>
            <Link href="/recipients" className="shrink-0 text-xs font-semibold text-accent hover:underline">
              Tümünü Gör
            </Link>
          </header>
          <div className="space-y-3">
            {RECENT_RECIPIENTS.map(r => (
              <Link
                key={r.id}
                href="/payment"
                className="flex items-center gap-3 hover:bg-surface rounded-xl px-2 py-2 -mx-2 transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                  style={{ backgroundColor: r.color + '25', border: `1.5px solid ${r.color}35` }}
                >
                  {r.emoji}
                </div>
                <span className="text-sm font-medium text-text-primary flex-1 truncate">{r.nickname}</span>
                <span className="text-text-tertiary text-xs group-hover:text-accent transition-colors">→</span>
              </Link>
            ))}
            <Link
              href="/recipients"
              className="flex items-center gap-3 px-2 py-2 -mx-2 hover:bg-surface rounded-xl transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-surface border border-dashed border-border flex items-center justify-center flex-shrink-0 text-sm text-text-tertiary">
                +
              </div>
              <span className="text-sm text-text-tertiary">Yeni alıcı ekle</span>
            </Link>
          </div>
        </div>

        {/* Son İşlemler — geniş kolon; durum + tutar sabit sütunlarda hizalı */}
        <div className="flex h-full flex-col rounded-2xl border border-border bg-elevated p-5 lg:col-span-3">
          <header className="mb-4 flex min-h-11 shrink-0 items-center justify-between gap-3 border-b border-border pb-3">
            <h2 className="text-sm font-bold leading-tight text-text-primary">Son İşlemler</h2>
            <Link href="/history" className="shrink-0 text-xs font-semibold text-accent hover:underline">
              Tümünü Gör
            </Link>
          </header>
          <div className="min-w-0 divide-y divide-border">
            {RECENT_TRANSACTIONS.map(tx => (
              <div
                key={tx.id}
                className="flex min-w-0 items-center gap-3 py-3.5 first:pt-0 last:pb-0 max-[380px]:flex-wrap max-[380px]:gap-y-2"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{
                    backgroundColor: `${tx.iconTint}22`,
                    border: `1.5px solid ${tx.iconTint}44`,
                  }}
                  aria-hidden
                >
                  {tx.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{tx.title}</p>
                  <p className="text-xs text-text-tertiary">{tx.subtitle}</p>
                </div>
                <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4 max-[380px]:w-full max-[380px]:basis-full max-[380px]:justify-between max-[380px]:pl-14">
                  <div className="flex w-[5.5rem] shrink-0 justify-center sm:w-[6rem]">
                    {STATUS_BADGE[tx.status]}
                  </div>
                  <div className="w-[4.5rem] shrink-0 text-right sm:w-[5.25rem]">
                    <p className="text-sm font-bold tabular-nums leading-tight text-text-primary">{tx.amount}</p>
                    <p className="text-xs tabular-nums leading-tight text-text-tertiary">{tx.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
