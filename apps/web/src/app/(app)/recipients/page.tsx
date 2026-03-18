'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Recipient {
  id: string;
  nickname: string;
  iban: string;
  type: 'person' | 'company';
  emoji: string;
  color: string;
  lastPaid?: string;
}

const INITIAL: Recipient[] = [
  { id: '1', nickname: 'Apartman', iban: 'TR33 0006 1005 1978 6457 8413 26', type: 'company', emoji: '🏢', color: '#5B7FA6', lastPaid: '15 Oca' },
  { id: '2', nickname: 'Ev Sahibi', iban: 'TR17 0001 2009 4520 0058 0000 01', type: 'person', emoji: '🏠', color: '#4A9B7F', lastPaid: '1 Oca' },
  { id: '3', nickname: 'Site Yön.', iban: 'TR26 0004 6009 1488 0000 0187 69', type: 'company', emoji: '🏡', color: '#B56B6B', lastPaid: '20 Ara' },
  { id: '4', nickname: 'Elektrik', iban: 'TR98 0001 0017 4538 0073 5099 72', type: 'company', emoji: '⚡', color: '#B8894A' },
];

const EMOJIS = ['🏠', '🏢', '🏡', '⚡', '💧', '🔥', '📱', '💰', '🔑', '👤'];
const COLORS = ['#5B7FA6', '#4A9B7F', '#B56B6B', '#B8894A', '#6B7FA6', '#7F6B9B', '#6B9B7F', '#9B6B7F'];

function formatIBAN(raw: string) {
  const clean = raw.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') ?? clean;
}

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Recipient | null>(null);

  const [form, setForm] = useState({ nickname: '', iban: '', type: 'person' as 'person' | 'company', emoji: '👤', color: COLORS[0] });

  const filtered = recipients.filter(r =>
    r.nickname.toLowerCase().includes(search.toLowerCase()) ||
    r.iban.replace(/\s/g, '').includes(search.replace(/\s/g, ''))
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ nickname: '', iban: '', type: 'person', emoji: '👤', color: COLORS[0] });
    setModalOpen(true);
  };

  const openEdit = (r: Recipient) => {
    setEditTarget(r);
    setForm({ nickname: r.nickname, iban: r.iban, type: r.type, emoji: r.emoji, color: r.color });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nickname || !form.iban) return;
    if (editTarget) {
      setRecipients(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...form } : r));
    } else {
      setRecipients(prev => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Alıcılar</h1>
          <p className="text-text-secondary text-sm mt-1">Kayıtlı alıcılarınız</p>
        </div>
        <Button onClick={openAdd} size="sm">+ Yeni Ekle</Button>
      </div>

      {/* Arama */}
      <div className="flex items-center gap-2 bg-elevated border border-border rounded-2xl px-4 h-11 focus-within:border-accent transition-colors">
        <span className="text-text-tertiary text-sm">🔍</span>
        <input
          type="text"
          placeholder="Alıcı veya IBAN ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      {/* Liste */}
      <div className="bg-elevated rounded-3xl border border-border divide-y divide-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-text-secondary font-medium">Alıcı bulunamadı</p>
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: r.color + '30', border: `1.5px solid ${r.color}40` }}
              >
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm">{r.nickname}</p>
                <p className="text-text-tertiary text-xs font-mono">{formatIBAN(r.iban.slice(0, 10))}...</p>
              </div>
              {r.lastPaid && (
                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-text-tertiary text-xs">Son ödeme</p>
                  <p className="text-text-secondary text-xs font-semibold">{r.lastPaid}</p>
                </div>
              )}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(r)}
                  className="text-text-tertiary hover:text-accent transition-colors text-sm px-3 py-1.5 rounded-xl hover:bg-accent/10"
                >
                  Düzenle
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-elevated rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary text-lg">
                {editTarget ? 'Alıcıyı Düzenle' : 'Yeni Alıcı Ekle'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text-tertiary hover:text-text-primary text-xl w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface">
                ✕
              </button>
            </div>

            {/* Emoji seçici */}
            <div>
              <p className="text-sm font-semibold text-text-secondary mb-2">İkon</p>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(em => (
                  <button
                    key={em}
                    onClick={() => setForm(f => ({ ...f, emoji: em }))}
                    className={`w-10 h-10 rounded-xl text-xl transition-all ${form.emoji === em ? 'bg-accent/15 ring-2 ring-accent' : 'bg-surface hover:bg-border'}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Renk seçici */}
            <div>
              <p className="text-sm font-semibold text-text-secondary mb-2">Renk</p>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-text-primary scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Input
              label="İsim / Takma ad"
              placeholder="Apartman, Ev Sahibi..."
              value={form.nickname}
              onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
            />
            <Input
              label="IBAN"
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              value={form.iban}
              onChange={e => setForm(f => ({ ...f, iban: e.target.value }))}
            />

            <div className="flex gap-3 pt-2">
              {editTarget && (
                <Button variant="outline" onClick={() => handleDelete(editTarget.id)} className="flex-1 text-error border-error hover:bg-error hover:border-error">
                  Sil
                </Button>
              )}
              <Button className="flex-1" onClick={handleSave} disabled={!form.nickname || !form.iban}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
