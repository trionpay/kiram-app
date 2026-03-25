'use client';

import { useMemo, useState } from 'react';
import { initialMockUsers, type AdminUserRow } from '@/lib/admin/mockUsers';

type UserFilter = 'all' | 'active' | 'archived' | 'suspended';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>(initialMockUsers);
  const [filter, setFilter] = useState<UserFilter>('active');

  const filtered = useMemo(() => {
    let list = [...users];
    switch (filter) {
      case 'active':
        list = list.filter(u => !u.archived && !u.suspended);
        break;
      case 'archived':
        list = list.filter(u => u.archived);
        break;
      case 'suspended':
        list = list.filter(u => u.suspended && !u.archived);
        break;
      default:
        break;
    }
    return list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }, [users, filter]);

  const toggleSuspend = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== id || u.archived) return u;
        return { ...u, suspended: !u.suspended };
      }),
    );
  };

  const setArchived = (id: string, archived: boolean) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== id) return u;
        return { ...u, archived, suspended: archived ? false : u.suspended };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Kullanıcılar</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Askıya alma geçici erişim kısıtıdır. Arşiv, kaydı operasyonel listeden çıkarır (soft delete); geri alınabilir.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Askıda ve arşiv farkı</p>
        <p className="mt-1">
          <strong>Askıda:</strong> Hesap bloke; kullanıcı listede kalır. <strong>Arşiv:</strong> Kayıt arşivlenir
          (silme değil); varsayılan listede gösterilmez. Arşivlenen kullanıcı askıda olamaz — arşivlemede askı
          kalkar (mock kuralı).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'active' as const, label: 'Aktif' },
            { key: 'suspended' as const, label: 'Askıda' },
            { key: 'archived' as const, label: 'Arşiv' },
            { key: 'all' as const, label: 'Tümü' },
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

      <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 font-semibold text-text-secondary">Ad Soyad</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Telefon</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Kayıt</th>
                <th className="px-4 py-3 font-semibold text-text-secondary">Durum</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-text-secondary">
                    Bu filtreye uygun kullanıcı yok.
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr
                    key={u.id}
                    className={`border-b border-border last:border-0 ${u.archived ? 'opacity-75' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums">{u.phone}</td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums">{u.registeredAt}</td>
                    <td className="px-4 py-3">
                      {u.archived ? (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-surface text-text-secondary border border-border">
                          Arşiv
                        </span>
                      ) : u.suspended ? (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-error border border-red-100">
                          Askıda
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-success border border-green-100">
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end sm:items-center">
                        {!u.archived && (
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <span className="text-xs text-text-tertiary whitespace-nowrap">Askıya al</span>
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
                        )}
                        {u.archived ? (
                          <button
                            type="button"
                            onClick={() => setArchived(u.id, false)}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 whitespace-nowrap"
                          >
                            Geri al
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setArchived(u.id, true)}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface border border-border whitespace-nowrap"
                          >
                            Arşivle
                          </button>
                        )}
                      </div>
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
