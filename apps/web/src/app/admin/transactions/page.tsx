'use client';

import { useMemo, useState } from 'react';
import {
  initialMockTransactions,
  type AdminTransactionRow,
  type TransactionStatus,
} from '@/lib/admin/mockTransactions';
import { Badge } from '@/components/ui/Badge';

type Filter = 'all' | TransactionStatus;

function formatTry(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
}

export default function AdminTransactionsPage() {
  const [rows] = useState<AdminTransactionRow[]>(initialMockTransactions);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      const hay = `${r.userLabel} ${r.description} ${r.id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, filter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">İşlem logları</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Başarılı / başarısız, tutar ve tarih; filtre ve arama (mock).
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'all' as const, label: 'Tümü' },
              { key: 'success' as const, label: 'Başarılı' },
              { key: 'failed' as const, label: 'Başarısız' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`
                rounded-xl px-4 py-2 text-sm font-semibold transition-colors
                ${
                  filter === key
                    ? 'bg-primary text-text-inverse'
                    : 'bg-surface text-text-secondary hover:bg-border'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="w-full sm:max-w-xs">
          <input
            type="search"
            placeholder="Açıklama, kullanıcı veya ID ara…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border bg-elevated px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 font-semibold text-text-secondary">Tarih</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Kullanıcı</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Açıklama</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-right">Tutar</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Durum</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap tabular-nums">
                      {formatDateTime(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">{r.userLabel}</td>
                    <td className="px-4 py-3 text-text-secondary">{r.description}</td>
                    <td className="px-4 py-3 text-right font-semibold text-text-primary tabular-nums">
                      {formatTry(r.amountTry)}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'success' ? (
                        <Badge variant="success">Başarılı</Badge>
                      ) : (
                        <Badge variant="error">Başarısız</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
