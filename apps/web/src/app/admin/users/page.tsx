'use client';

import { useMemo, useState } from 'react';
import { initialMockUsers, type AdminUserRow } from '@/lib/admin/mockUsers';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>(initialMockUsers);

  const sorted = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name, 'tr')),
    [users],
  );

  const toggleSuspend = (id: string) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, suspended: !u.suspended } : u)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Kullanıcılar</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Liste ve askıya alma (mock — gerçek API ile senkronize edilecek).
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 font-semibold text-text-secondary">Ad Soyad</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Telefon</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Kayıt</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Durum</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                  <td className="px-4 py-3 text-text-secondary tabular-nums">{u.phone}</td>
                  <td className="px-4 py-3 text-text-secondary tabular-nums">{u.registeredAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.suspended
                          ? 'bg-red-50 text-error border border-red-100'
                          : 'bg-green-50 text-success border border-green-100'
                      }`}
                    >
                      {u.suspended ? 'Askıda' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <span className="text-xs text-text-tertiary">Askıya al</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={u.suspended}
                        onClick={() => toggleSuspend(u.id)}
                        className={`
                          relative h-7 w-12 rounded-full p-0.5 transition-colors
                          ${u.suspended ? 'bg-error' : 'bg-success'}
                        `}
                      >
                        <span
                          className={`
                            block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200
                            ${u.suspended ? 'translate-x-0' : 'translate-x-5'}
                          `}
                        />
                      </button>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
