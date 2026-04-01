import Link from 'next/link';
import { mockDashboardStats, PENDING_QUEUE_ALERT_THRESHOLD } from '@/lib/admin/mockStats';
import {
  getRecentRegistrationsForDashboard,
  getRecentTransactionsForDashboard,
} from '@/lib/admin/mockDashboardHelpers';
import { Badge } from '@/components/ui/Badge';
import { PAYMENT_KIND_META } from '@/lib/admin/transactionKinds';

function formatTry(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatTryFull(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(n);
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export default function AdminDashboardPage() {
  const s = mockDashboardStats;
  const recentTx = getRecentTransactionsForDashboard(5);
  const recentUsers = getRecentRegistrationsForDashboard(5);
  const maxVol = Math.max(...s.volumeLast7DaysTry.map(d => d.amountTry), 1);
  const pendingQueueAlert = s.pendingCount > PENDING_QUEUE_ALERT_THRESHOLD;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Özet</h2>
          <p className="mt-1 text-sm text-text-secondary max-w-xl">
            Operasyonel metrikler (mock). API bağlanınca canlı veriyle güncellenecek.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/admin/users" label="Kullanıcılar" />
          <QuickLink href="/admin/transactions" label="İşlem logları" />
          <QuickLink href="/admin/broadcast" label="Toplu duyuru" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Bugünkü hacim"
          value={formatTryFull(s.todayVolumeTry)}
          subtitle="TRY"
          detailHref="/admin/transactions?durum=tumu"
        />
        <StatCard
          title="Başarılı işlem (bugün)"
          value={String(s.successfulCount)}
          subtitle="adet"
          detailHref="/admin/transactions?durum=basarili"
        />
        <StatCard
          title="Başarısız işlem (bugün)"
          value={String(s.failedCount)}
          subtitle="adet"
          detailHref="/admin/transactions?durum=basarisiz"
        />
        <StatCard
          title="Yeni kayıt (bugün)"
          value={String(s.newRegistrationsToday)}
          subtitle="kullanıcı"
          detailHref="/admin/users?segment=tumu"
        />
        <StatCard
          title="Bekleyen işlem"
          value={String(s.pendingCount)}
          subtitle={
            pendingQueueAlert
              ? `Eşik aşıldı (>${PENDING_QUEUE_ALERT_THRESHOLD}). Kuyruk birikimi — banka entegrasyonu veya webhook gecikmesi olası.`
              : 'mock kuyruk'
          }
          tone={pendingQueueAlert ? 'alert' : 'default'}
          detailHref="/admin/transactions?durum=bekleyen"
        />
        <StatCard
          title="Başarı oranı (24s)"
          value={`%${s.successRateLast24hPercent.toLocaleString('tr-TR', { minimumFractionDigits: 1 })}`}
          subtitle="başarılı / toplam deneme"
          detailHref="/admin/transactions?durum=tumu"
        />
        <StatCard
          title="Aktif kullanıcı"
          value={s.activeUsersCount.toLocaleString('tr-TR')}
          subtitle="askıda ve arşiv hariç (mock)"
          detailHref="/admin/users?segment=aktif"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-elevated p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Son 7 gün işlem hacmi</h3>
              <p className="mt-1 text-xs text-text-tertiary">Günlük toplam TRY (örnek trend)</p>
            </div>
            <Link
              href="/admin/transactions?durum=tumu"
              className="shrink-0 text-xs font-semibold text-accent hover:underline"
            >
              Git →
            </Link>
          </div>
          <div className="mt-6 flex items-end justify-between gap-1 sm:gap-2 min-h-[140px] px-1">
            {s.volumeLast7DaysTry.map(day => {
              const barPx = Math.max(8, Math.round((day.amountTry / maxVol) * 112));
              return (
                <div key={day.label} className="flex flex-1 flex-col items-center gap-2 min-w-0">
                  <span className="text-[10px] text-text-tertiary tabular-nums truncate w-full text-center leading-tight">
                    {formatTry(day.amountTry)}
                  </span>
                  <div
                    className="w-full max-w-9 sm:max-w-10 mx-auto rounded-t-lg bg-accent/80 flex-shrink-0"
                    style={{ height: barPx }}
                    title={formatTryFull(day.amountTry)}
                  />
                  <span className="text-xs font-semibold text-text-secondary">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-elevated p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary">Son işlemler</h3>
            <Link
              href="/admin/transactions?durum=tumu"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Tümünü gör
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-tertiary text-xs uppercase tracking-wide">
                  <th className="pb-2 pr-2 font-semibold">Tarih</th>
                  <th className="pb-2 pr-2 font-semibold">Kullanıcı</th>
                  <th className="pb-2 pr-2 font-semibold">Tip</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Tutar</th>
                  <th className="pb-2 font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map(t => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-2 text-text-secondary whitespace-nowrap text-xs tabular-nums">
                      {formatShortDate(t.createdAt)}
                    </td>
                    <td className="py-2 pr-2 font-medium text-text-primary truncate max-w-[100px]">
                      {t.userLabel}
                    </td>
                    <td className="py-2 pr-2 text-text-primary text-xs" title={PAYMENT_KIND_META[t.paymentKind].shortLabel}>
                      <span aria-hidden>{PAYMENT_KIND_META[t.paymentKind].icon}</span>{' '}
                      <span className="hidden sm:inline">{PAYMENT_KIND_META[t.paymentKind].shortLabel}</span>
                    </td>
                    <td className="py-2 pr-2 text-right tabular-nums text-text-primary">
                      {formatTry(t.amountTry)}
                    </td>
                    <td className="py-2">
                      {t.status === 'success' ? (
                        <Badge variant="success">OK</Badge>
                      ) : t.status === 'failed' ? (
                        <Badge variant="error">Hata</Badge>
                      ) : (
                        <Badge variant="pending">Bekliyor</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-elevated p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Son kayıtlar</h3>
          <Link href="/admin/users" className="text-xs font-semibold text-accent hover:underline">
            Kullanıcılar
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-tertiary text-xs uppercase tracking-wide">
                <th className="pb-2 pr-2 font-semibold">Ad Soyad</th>
                <th className="pb-2 pr-2 font-semibold">Telefon</th>
                <th className="pb-2 font-semibold">Kayıt tarihi</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-2 font-medium text-text-primary">{u.name}</td>
                  <td className="py-2 pr-2 text-text-secondary tabular-nums">{u.phone}</td>
                  <td className="py-2 text-text-secondary tabular-nums">{u.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  tone = 'default',
  detailHref,
  detailLabel = 'Git →',
}: {
  title: string;
  value: string;
  subtitle: string;
  tone?: 'default' | 'alert';
  detailHref?: string;
  detailLabel?: string;
}) {
  const alert = tone === 'alert';
  return (
    <div
      className={`
        rounded-2xl border p-5 shadow-sm
        ${
          alert
            ? 'border-amber-400/70 bg-gradient-to-br from-amber-50 via-amber-50/95 to-orange-50 ring-1 ring-amber-400/25'
            : 'border-border bg-elevated'
        }
      `}
      role={alert ? 'status' : undefined}
      aria-live={alert ? 'polite' : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide ${alert ? 'text-amber-900/65' : 'text-text-tertiary'}`}
        >
          {title}
        </p>
        {detailHref ? (
          <Link
            href={detailHref}
            className="shrink-0 text-xs font-semibold text-accent hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {detailLabel}
          </Link>
        ) : null}
      </div>
      <p
        className={`mt-2 text-xl sm:text-2xl font-bold tabular-nums break-words ${alert ? 'text-amber-950' : 'text-text-primary'}`}
      >
        {value}
      </p>
      <p className={`mt-1 text-xs leading-snug ${alert ? 'font-medium text-amber-900/85' : 'text-text-secondary'}`}>
        {subtitle}
      </p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:border-accent hover:bg-elevated transition-colors"
    >
      {label}
      <span className="ml-1 text-accent">→</span>
    </Link>
  );
}
