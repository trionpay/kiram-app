'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminMockSession } from '@/lib/admin/session';

const nav = [
  { href: '/admin', label: 'Özet' },
  { href: '/admin/users', label: 'Kullanıcılar' },
  { href: '/admin/transactions', label: 'İşlem logları' },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAdminMockSession();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-white/10 bg-[#0C1929] text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Yönetim</p>
        <p className="mt-1 text-lg font-bold text-white">Kiram</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {nav.map(({ href, label }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`
                rounded-xl px-4 py-3 text-sm font-semibold transition-colors
                ${active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}
              `}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          Çıkış
        </button>
      </div>
    </aside>
  );
}
