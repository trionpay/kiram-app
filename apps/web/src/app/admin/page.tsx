import { mockDashboardStats } from '@/lib/admin/mockStats';

function formatTry(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(n);
}

export default function AdminDashboardPage() {
  const s = mockDashboardStats;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Özet</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Bugünkü işlemler ve kayıtlar (mock veri — API bağlanınca güncellenecek).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Bugünkü hacim" value={formatTry(s.todayVolumeTry)} subtitle="TRY" />
        <StatCard title="Başarılı işlem" value={String(s.successfulCount)} subtitle="adet" />
        <StatCard title="Başarısız işlem" value={String(s.failedCount)} subtitle="adet" />
        <StatCard title="Yeni kayıt (bugün)" value={String(s.newRegistrationsToday)} subtitle="kullanıcı" />
      </div>

      <div className="rounded-2xl border border-border bg-elevated p-6">
        <h3 className="text-sm font-semibold text-text-primary">Toplu duyuru (broadcast)</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Bildirimler (Blueprint): kullanıcılara push ile toplu duyuru. API ve bildirim altyapısı
          sonrası burada yönetilecek; şimdilik kapsam dışı.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-tertiary cursor-not-allowed"
        >
          Yakında
        </button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-elevated p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{title}</p>
      <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>
    </div>
  );
}
