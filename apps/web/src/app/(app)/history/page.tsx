'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type Filter = 'all' | 'success' | 'pending' | 'failed';

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  fee: number;
  type: 'bill' | 'rent';
  status: 'success' | 'pending' | 'failed';
  date: string;
  time: string;
  iban: string;
  description?: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'TRX-2501-0015', title: 'Apartman Aidatı', subtitle: 'Ocak 2025', amount: 850, fee: 12.75, type: 'bill', status: 'success', date: '15 Oca 2025', time: '09:42', iban: 'TR33 0006 1005 1978 6457 8413 26' },
  { id: 'TRX-2501-0012', title: 'Doğalgaz', subtitle: 'İGDAŞ', amount: 320, fee: 4.80, type: 'bill', status: 'success', date: '12 Oca 2025', time: '14:18', iban: 'TR17 0001 2009 4520 0058 0000 01' },
  { id: 'TRX-2502-0001', title: 'Kira', subtitle: 'Ev Sahibi — Şubat', amount: 12000, fee: 180, type: 'rent', status: 'pending', date: '1 Şub 2025', time: '10:00', iban: 'TR26 0004 6009 1488 0000 0187 69', description: 'Şubat 2025 kirası' },
  { id: 'TRX-2501-0008', title: 'İnternet', subtitle: 'Türk Telekom', amount: 199, fee: 2.99, type: 'bill', status: 'success', date: '8 Oca 2025', time: '11:05', iban: 'TR98 0001 0017 4538 0073 5099 72' },
  { id: 'TRX-2501-0007', title: 'Elektrik', subtitle: 'TEDAŞ', amount: 445, fee: 6.68, type: 'bill', status: 'success', date: '7 Oca 2025', time: '16:30', iban: 'TR12 0003 2000 0000 0027 5041 67' },
  { id: 'TRX-2501-0001', title: 'Kira', subtitle: 'Ev Sahibi — Ocak', amount: 12000, fee: 180, type: 'rent', status: 'success', date: '1 Oca 2025', time: '09:00', iban: 'TR26 0004 6009 1488 0000 0187 69', description: 'Ocak 2025 kirası' },
  { id: 'TRX-2412-0003', title: 'Su', subtitle: 'İSKİ', amount: 185, fee: 2.78, type: 'bill', status: 'failed', date: '3 Ara 2024', time: '13:22', iban: 'TR45 0006 7010 0000 0059 3902 49' },
  { id: 'TRX-2412-0015', title: 'Apartman Aidatı', subtitle: 'Aralık 2024', amount: 850, fee: 12.75, type: 'bill', status: 'success', date: '15 Ara 2024', time: '10:11', iban: 'TR33 0006 1005 1978 6457 8413 26' },
];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'success', label: 'Başarılı' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'failed', label: 'Başarısız' },
];

const STATUS_BADGE: Record<string, React.ReactNode> = {
  success: <Badge variant="success">Başarılı</Badge>,
  pending: <Badge variant="pending">Beklemede</Badge>,
  failed: <Badge variant="error">Başarısız</Badge>,
};

const TYPE_EMOJI: Record<string, string> = { rent: '🏠', bill: '📋' };

const fmt = (n: number) => n.toFixed(2).replace('.', ',');

function TransactionDetailPanel({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const isSuccess = tx.status === 'success';
  const isPending = tx.status === 'pending';

  const rows = [
    { label: 'Alıcı', value: tx.title },
    { label: 'IBAN', value: tx.iban, mono: true },
    ...(tx.description ? [{ label: 'Açıklama', value: tx.description }] : []),
    { label: 'Hizmet Bedeli', value: `₺${fmt(tx.fee)}` },
    { label: 'Toplam', value: `₺${fmt(tx.amount + tx.fee)}`, bold: true },
    { label: 'Tarih', value: `${tx.date}, ${tx.time}` },
    { label: 'Referans No', value: tx.id, mono: true },
  ];

  const handleCopyReceipt = () => {
    const text = [
      '🧾 Kiram — Ödeme Dekontu',
      '─────────────────────────',
      `Tutar:         ₺${fmt(tx.amount)}`,
      `Hizmet Bedeli: ₺${fmt(tx.fee)}`,
      `Toplam:        ₺${fmt(tx.amount + tx.fee)}`,
      '─────────────────────────',
      `Alıcı:  ${tx.title}`,
      `IBAN:   ${tx.iban}`,
      ...(tx.description ? [`Açıklama: ${tx.description}`] : []),
      '─────────────────────────',
      `Tarih:  ${tx.date}, ${tx.time}`,
      `Ref No: ${tx.id}`,
      '',
      'kiram.com üzerinden gerçekleştirilmiştir.',
    ].join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-elevated rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Üst durum alanı */}
        <div className={`px-6 pt-8 pb-6 text-center ${isSuccess ? 'bg-green-50' : isPending ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 ${isSuccess ? 'bg-green-100' : isPending ? 'bg-yellow-100' : 'bg-red-100'}`}>
            {isSuccess ? '✓' : isPending ? '⏳' : '✕'}
          </div>
          <p className={`text-sm font-semibold mb-1 ${isSuccess ? 'text-success' : isPending ? 'text-yellow-700' : 'text-error'}`}>
            {isSuccess ? 'Ödeme Başarılı' : isPending ? 'Beklemede' : 'Ödeme Başarısız'}
          </p>
          <p className="text-3xl font-bold text-text-primary">₺{fmt(tx.amount)}</p>
        </div>

        {/* Detay satırları */}
        <div className="px-6 py-4 divide-y divide-border">
          {rows.map(row => (
            <div key={row.label} className="flex justify-between items-start gap-4 py-3 first:pt-0">
              <span className="text-text-tertiary text-sm flex-shrink-0">{row.label}</span>
              <span className={`text-sm text-right flex-1 ${row.bold ? 'font-bold text-text-primary' : 'text-text-primary'} ${row.mono ? 'font-mono text-xs' : ''}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Aksiyonlar */}
        <div className="px-6 pb-6 flex gap-3">
          {isSuccess && (
            <Button variant="secondary" className="flex-1" onClick={handleCopyReceipt}>
              ↑ Dekontu Kopyala
            </Button>
          )}
          <Button className="flex-1" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = TRANSACTIONS.filter(tx => {
    if (filter !== 'all' && tx.status !== filter) return false;
    if (search && !tx.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSuccess = TRANSACTIONS.filter(t => t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalPending = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">İşlem Geçmişi</h1>
          <p className="text-text-secondary text-sm mt-1">Tüm ödeme işlemleriniz</p>
        </div>

        {/* Özet kartları */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Toplam Ödeme', value: `₺${(totalSuccess / 1000).toFixed(1)}k`, sub: `${TRANSACTIONS.filter(t => t.status === 'success').length} işlem` },
            { label: 'Bekleyen', value: `₺${totalPending.toLocaleString('tr-TR')}`, sub: `${TRANSACTIONS.filter(t => t.status === 'pending').length} işlem` },
            { label: 'Başarısız', value: `${TRANSACTIONS.filter(t => t.status === 'failed').length}`, sub: 'işlem' },
          ].map(stat => (
            <div key={stat.label} className="bg-elevated rounded-2xl p-4 border border-border">
              <p className="text-text-tertiary text-xs mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-text-tertiary text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Arama + filtreler */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-elevated border border-border rounded-2xl px-4 h-11 focus-within:border-accent transition-colors">
            <span className="text-text-tertiary text-sm">🔍</span>
            <input
              type="text"
              placeholder="İşlem ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === f.value ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-border'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tablo */}
        <div className="bg-elevated rounded-3xl border border-border overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-text-secondary font-medium">Sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(tx => (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center flex-shrink-0 text-lg">
                    {TYPE_EMOJI[tx.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm">{tx.title}</p>
                    <p className="text-text-tertiary text-xs">{tx.subtitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-text-tertiary text-xs">{tx.date}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {STATUS_BADGE[tx.status]}
                  </div>
                  <div className="text-right flex-shrink-0 w-24">
                    <p className="font-bold text-text-primary text-sm">₺{tx.amount.toLocaleString('tr-TR')}</p>
                  </div>
                  <span className="text-text-tertiary text-sm flex-shrink-0">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTx && (
        <TransactionDetailPanel tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </>
  );
}
