'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

const STATS = [
  { label: 'Bu Ay Ödeme', value: '₺14.700', change: '+%12', up: true },
  { label: 'Bekleyen', value: '₺12.000', change: '1 işlem', up: null },
  { label: 'Kayıtlı Alıcı', value: '4', change: 'aktif', up: null },
];

const RECENT_RECIPIENTS = [
  { id: '1', nickname: 'Apartman', emoji: '🏢', color: '#5B7FA6' },
  { id: '2', nickname: 'Ev Sahibi', emoji: '🏠', color: '#4A9B7F' },
  { id: '3', nickname: 'Site Yön.', emoji: '🏡', color: '#B56B6B' },
  { id: '4', nickname: 'Elektrik', emoji: '⚡', color: '#B8894A' },
  { id: '5', nickname: 'Su İdaresi', emoji: '💧', color: '#6B7FA6' },
];

const RECENT_TRANSACTIONS = [
  { id: '1', title: 'Apartman Aidatı', subtitle: 'Ocak 2025', amount: '₺850', status: 'success', date: '15 Oca' },
  { id: '2', title: 'Doğalgaz', subtitle: 'İGDAŞ', amount: '₺320', status: 'success', date: '12 Oca' },
  { id: '3', title: 'Kira', subtitle: 'Ev Sahibi — Şub', amount: '₺12.000', status: 'pending', date: '1 Şub' },
  { id: '4', title: 'İnternet', subtitle: 'Türk Telekom', amount: '₺199', status: 'success', date: '8 Oca' },
];

const STATUS_BADGE: Record<string, React.ReactNode> = {
  success: <Badge variant="success">Başarılı</Badge>,
  pending: <Badge variant="pending">Beklemede</Badge>,
  failed: <Badge variant="error">Başarısız</Badge>,
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Üst başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Hoş geldiniz, Ahmet 👋</h1>
          <p className="text-text-secondary text-sm mt-1">İşte hesabınızın özeti.</p>
        </div>
        <Link
          href="/payment"
          className="hidden sm:inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-primary-light transition-colors active:scale-[0.98]"
        >
          <span className="text-accent">↗</span> Yeni Ödeme
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-elevated rounded-2xl border border-border p-5">
            <p className="text-text-tertiary text-xs font-medium mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className={`text-xs mt-1 font-medium ${stat.up === true ? 'text-success' : stat.up === false ? 'text-error' : 'text-text-tertiary'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Hero aksiyonu */}
      <div
        className="relative rounded-3xl p-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #102A43, #0C1929, #061018)' }}
      >
        <div className="absolute top-[-40px] right-[-40px] w-56 h-56 rounded-full opacity-10" style={{ background: '#0369A1' }} />
        <div className="absolute bottom-[-60px] right-[100px] w-36 h-36 rounded-full opacity-5" style={{ background: '#0369A1' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm mb-1.5">Hızlı işlem</p>
            <h2 className="text-2xl font-bold text-white">Kira, aidat, fatura<br />tek yerden öde.</h2>
          </div>
          <Link
            href="/payment"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3 rounded-2xl hover:bg-white/90 transition-colors active:scale-[0.98] whitespace-nowrap flex-shrink-0"
          >
            Ödeme Başlat <span>→</span>
          </Link>
        </div>
      </div>

      {/* İki kolon: Alıcılar + Son işlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Son Alıcılar — dar kolon */}
        <div className="lg:col-span-2 bg-elevated rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text-primary text-sm">Son Alıcılar</h2>
            <Link href="/recipients" className="text-accent text-xs font-semibold hover:underline">
              Tümünü Gör
            </Link>
          </div>
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

        {/* Son İşlemler — geniş kolon */}
        <div className="lg:col-span-3 bg-elevated rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text-primary text-sm">Son İşlemler</h2>
            <Link href="/history" className="text-accent text-xs font-semibold hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_TRANSACTIONS.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                  <span className="text-text-tertiary text-xs">₺</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary text-sm truncate">{tx.title}</p>
                  <p className="text-text-tertiary text-xs">{tx.subtitle}</p>
                </div>
                <div className="flex-shrink-0 hidden sm:block">
                  {STATUS_BADGE[tx.status]}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-text-primary text-sm">{tx.amount}</p>
                  <p className="text-text-tertiary text-xs">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
