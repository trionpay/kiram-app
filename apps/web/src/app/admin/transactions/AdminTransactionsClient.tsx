'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  initialMockTransactions,
  type AdminTransactionRow,
  type TransactionPaymentKind,
  type TransactionStatus,
} from '@/lib/admin/mockTransactions';
import { transactionFilterFromDurumParam } from '@/lib/admin/adminQueryParams';
import { PAYMENT_KIND_META } from '@/lib/admin/transactionKinds';
import { Badge } from '@/components/ui/Badge';

type Filter = 'all' | TransactionStatus;

const TYPE_CHIP: Record<TransactionPaymentKind, string> = {
  rent: 'border-sky-200 bg-sky-50 text-sky-950',
  dues: 'border-violet-200 bg-violet-50 text-violet-950',
};

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

function PaymentTypeCell({ kind }: { kind: TransactionPaymentKind }) {
  const m = PAYMENT_KIND_META[kind];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-none ${TYPE_CHIP[kind]}`}
    >
      <span aria-hidden>{m.icon}</span>
      {m.shortLabel}
    </span>
  );
}

function transactionSearchHay(r: AdminTransactionRow): string {
  const m = PAYMENT_KIND_META[r.paymentKind];
  return [
    r.userLabel,
    r.id,
    r.recipientDetail,
    r.note,
    m.shortLabel,
    m.searchTerms,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function AdminTransactionsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const durumParam = searchParams.get('durum');
  const rows: AdminTransactionRow[] = initialMockTransactions;
  const filter: Filter = transactionFilterFromDurumParam(durumParam);
  const [query, setQuery] = useState('');
  const handleFilterChange = (next: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'all') {
      params.delete('durum');
    } else {
      params.set('durum', next);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      return transactionSearchHay(r).includes(q);
    });
  }, [rows, filter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">İşlem logları</h2>
        <p className="mt-1 text-sm text-text-secondary">
          İşlem tipi (kira / aidat), alıcı bilgisi, tutar ve hizmet bedeli; durum filtreleri ve arama (mock).
          Özet kartından geldiyseniz filtre URL ile uygulanır. Üretimde API sayfalaması önerilir.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'all' as const, label: 'Tümü' },
              { key: 'success' as const, label: 'Başarılı' },
              { key: 'failed' as const, label: 'Başarısız' },
              { key: 'pending' as const, label: 'Bekleyen' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleFilterChange(key)}
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
            placeholder="Kullanıcı, ID, alıcı, IBAN, işlem tipi…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border bg-elevated px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 font-semibold text-text-secondary">Tarih</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Kullanıcı</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">İşlem tipi</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Alıcı</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-right">Tutar</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-right">Hizmet bedeli</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Durum</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-secondary">
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
                    <td className="px-4 py-3">
                      <PaymentTypeCell kind={r.paymentKind} />
                    </td>
                    <td className="px-4 py-3 max-w-[14rem]">
                      <p className="text-text-primary text-xs leading-snug break-words">{r.recipientDetail}</p>
                      {r.note ? (
                        <p className="mt-1 text-[11px] leading-snug text-text-tertiary">{r.note}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-text-primary tabular-nums">
                      {formatTry(r.amountTry)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{formatTry(r.feeTry)}</td>
                    <td className="px-4 py-3">
                      {r.status === 'success' ? (
                        <Badge variant="success">Başarılı</Badge>
                      ) : r.status === 'failed' ? (
                        <Badge variant="error">Başarısız</Badge>
                      ) : (
                        <Badge variant="pending">Bekliyor</Badge>
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
