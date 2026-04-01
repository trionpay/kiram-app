'use client';

import { useEffect, useMemo, useState } from 'react';
import { initialMockUsers, type AdminUserRow } from '@/lib/admin/mockUsers';
import { userListFilterFromSegmentParam } from '@/lib/admin/adminQueryParams';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  PAGE_SIZE_OPTIONS,
  defaultSortDirForColumn,
  filterUsersPipeline,
  type AllTabRefine,
  type SortColumn,
  type SortDir,
  type UserTabFilter,
} from '@/lib/admin/adminUserListPipeline';

function formatTcknDisplay(tckn: string): string {
  const d = tckn.replace(/\D/g, '');
  if (d.length !== 11) return tckn;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
}

function SortableTh({
  label,
  column,
  sortColumn,
  sortDir,
  onSort,
  className = '',
}: {
  label: string;
  column: SortColumn;
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (c: SortColumn) => void;
  className?: string;
}) {
  const active = sortColumn === column;
  return (
    <th
      className={`px-4 py-3 font-semibold text-text-secondary ${className}`}
      scope="col"
      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex max-w-full items-center gap-1 rounded-lg px-1 py-0.5 -mx-1 text-left font-semibold transition-colors hover:bg-border/60 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`${label} sütununa göre sırala`}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span className={`shrink-0 tabular-nums ${active ? 'text-accent' : 'text-text-tertiary'}`} aria-hidden>
          {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  );
}

export function AdminUsersClient({ initialSegment }: { initialSegment: string | null }) {
  const [users, setUsers] = useState<AdminUserRow[]>(initialMockUsers);
  const [filter, setFilter] = useState<UserTabFilter>(() =>
    userListFilterFromSegmentParam(initialSegment) as UserTabFilter,
  );
  const [userSearch, setUserSearch] = useState('');
  const [registeredFrom, setRegisteredFrom] = useState('');
  const [registeredTo, setRegisteredTo] = useState('');
  const [allTabRefine, setAllTabRefine] = useState<AllTabRefine>('any');
  const [sortColumn, setSortColumn] = useState<SortColumn>('registeredAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(20);
  const [page, setPage] = useState(1);
  const [suspendConfirmUserId, setSuspendConfirmUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!suspendConfirmUserId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSuspendConfirmUserId(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [suspendConfirmUserId]);

  const filtered = useMemo(
    () =>
      filterUsersPipeline(users, {
        tab: filter,
        allRefine: allTabRefine,
        search: userSearch,
        registeredFrom,
        registeredTo,
        sortColumn,
        sortDir,
      }),
    [users, filter, allTabRefine, userSearch, registeredFrom, registeredTo, sortColumn, sortDir],
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const effectivePage = Math.min(Math.max(1, page), pageCount);
  const pageStart = total === 0 ? 0 : (effectivePage - 1) * pageSize + 1;
  const pageEnd = Math.min(effectivePage * pageSize, total);
  const pageRows = useMemo(
    () => filtered.slice((effectivePage - 1) * pageSize, effectivePage * pageSize),
    [filtered, effectivePage, pageSize],
  );

  const handleSortColumn = (col: SortColumn) => {
    setPage(1);
    if (sortColumn === col) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortDir(defaultSortDirForColumn(col));
    }
  };

  const setSuspended = (id: string, suspended: boolean) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== id || u.archived) return u;
        return { ...u, suspended };
      }),
    );
  };

  const handleSuspendSwitchClick = (u: AdminUserRow) => {
    if (u.archived) return;
    if (u.suspended) {
      setSuspended(u.id, false);
      return;
    }
    setSuspendConfirmUserId(u.id);
  };

  const confirmSuspend = () => {
    if (suspendConfirmUserId) {
      setSuspended(suspendConfirmUserId, true);
    }
    setSuspendConfirmUserId(null);
  };

  const suspendPendingUser = suspendConfirmUserId
    ? users.find(x => x.id === suspendConfirmUserId)
    : undefined;

  const setArchived = (id: string, archived: boolean) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== id) return u;
        return { ...u, archived, suspended: archived ? false : u.suspended };
      }),
    );
  };

  const dateRangeInvalid = Boolean(
    registeredFrom && registeredTo && registeredFrom > registeredTo,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Kullanıcılar</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Liste büyük ölçek için arama, kayıt tarihi aralığı, durum ve sayfalama ile daraltılır; sütun başlıklarından
          sıralama yapılır. API bağlandığında aynı parametreler sunucu tarafında uygulanır (Blueprint admin).
        </p>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Askıda ve arşiv farkı</p>
        <p className="mt-1">
          <strong>Askıda:</strong> Hesap bloke; kullanıcı listede kalır. <strong>Arşiv:</strong> Kayıt arşivlenir
          (silme değil); varsayılan listede gösterilmez. Arşivlenen kullanıcı askıda olamaz — arşivlemede askı kalkar
          (mock kuralı).
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
            onClick={() => {
              setPage(1);
              setFilter(key);
            }}
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

      <div className="rounded-2xl border border-border bg-elevated p-4 shadow-sm space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Arama ve filtreler</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="sm:col-span-2 lg:col-span-5">
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary" htmlFor="admin-user-search">
              Genel arama
            </label>
            <input
              id="admin-user-search"
              type="search"
              placeholder="Ad, soyad, telefon veya TCKN…"
              value={userSearch}
              onChange={e => {
                setPage(1);
                setUserSearch(e.target.value);
              }}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
              autoComplete="off"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary" htmlFor="reg-from">
              Kayıt başlangıç
            </label>
            <input
              id="reg-from"
              type="date"
              value={registeredFrom}
              onChange={e => {
                setPage(1);
                setRegisteredFrom(e.target.value);
              }}
              className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary" htmlFor="reg-to">
              Kayıt bitiş
            </label>
            <input
              id="reg-to"
              type="date"
              value={registeredTo}
              onChange={e => {
                setPage(1);
                setRegisteredTo(e.target.value);
              }}
              className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary" htmlFor="all-refine">
              Durum (yalnız &quot;Tümü&quot; sekmesi)
            </label>
            <select
              id="all-refine"
              disabled={filter !== 'all'}
              value={allTabRefine}
              onChange={e => {
                setPage(1);
                setAllTabRefine(e.target.value as AllTabRefine);
              }}
              className="h-11 w-full cursor-pointer rounded-2xl border border-border bg-background px-3 text-sm font-medium text-text-primary outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="any">Tüm durumlar</option>
              <option value="active">Sadece aktif</option>
              <option value="suspended">Sadece askıda</option>
              <option value="archived">Sadece arşiv</option>
            </select>
          </div>
        </div>
        {dateRangeInvalid ? (
          <p className="text-xs font-medium text-error" role="alert">
            Başlangıç tarihi bitişten sonra olamaz; sonuçlar boş dönebilir.
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <SortableTh
                  label="Ad Soyad"
                  column="name"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSortColumn}
                />
                <SortableTh
                  label="Telefon"
                  column="phone"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSortColumn}
                />
                <SortableTh
                  label="TCKN"
                  column="tckn"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSortColumn}
                />
                <SortableTh
                  label="Kayıt"
                  column="registeredAt"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSortColumn}
                />
                <SortableTh
                  label="KYC durumu"
                  column="kyc"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSortColumn}
                />
                <SortableTh
                  label="Durum"
                  column="status"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSortColumn}
                />
                <th className="px-4 py-3 text-right font-semibold text-text-secondary" scope="col">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-secondary">
                    {userSearch.trim() || registeredFrom || registeredTo || (filter === 'all' && allTabRefine !== 'any')
                      ? 'Filtrelerinizle eşleşen kullanıcı yok.'
                      : 'Bu filtreye uygun kullanıcı yok.'}
                  </td>
                </tr>
              ) : (
                pageRows.map(u => (
                  <tr
                    key={u.id}
                    className={`border-b border-border last:border-0 ${u.archived ? 'opacity-75' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums">{u.phone}</td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums text-xs tracking-tight">
                      {formatTcknDisplay(u.tckn)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums">{u.registeredAt}</td>
                    <td className="px-4 py-3">
                      {u.kycApproved ? (
                        <Badge variant="success">Onaylı</Badge>
                      ) : (
                        <Badge variant="default">Onaysız</Badge>
                      )}
                    </td>
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
                              onClick={() => handleSuspendSwitchClick(u)}
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

        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-secondary tabular-nums">
            {total === 0
              ? 'Kayıt yok'
              : `Gösterilen ${pageStart}–${pageEnd} / ${total.toLocaleString('tr-TR')} kullanıcı`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
              Sayfa başına
              <select
                value={pageSize}
                onChange={e => {
                  setPage(1);
                  setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                }}
                className="h-9 cursor-pointer rounded-xl border border-border bg-background px-2 text-sm font-medium text-text-primary outline-none focus:border-accent"
              >
                {PAGE_SIZE_OPTIONS.map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={effectivePage <= 1}
                onClick={() => setPage(Math.max(1, effectivePage - 1))}
                className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
              >
                Önceki
              </button>
              <span className="min-w-[5rem] text-center text-xs font-semibold tabular-nums text-text-secondary">
                {total === 0 ? '—' : `${effectivePage} / ${pageCount}`}
              </span>
              <button
                type="button"
                disabled={effectivePage >= pageCount}
                onClick={() => setPage(Math.min(pageCount, effectivePage + 1))}
                className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </div>

      {suspendConfirmUserId && suspendPendingUser ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="presentation"
          onClick={() => setSuspendConfirmUserId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="suspend-confirm-title"
            className="w-full max-w-md rounded-2xl border border-border bg-elevated p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="suspend-confirm-title" className="text-lg font-bold text-text-primary">
              Askıya almayı onaylayın
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Kullanıcıyı askıya almak istediğinize emin misiniz?
            </p>
            <p className="mt-2 text-sm font-semibold text-text-primary">{suspendPendingUser.name}</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => setSuspendConfirmUserId(null)}
              >
                Vazgeç
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={confirmSuspend}>
                Evet, askıya al
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
