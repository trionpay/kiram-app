'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';
import { clearAdminMockSession } from '@/lib/admin/session';

const NAV_ITEMS = [
  { href: '/admin', icon: '⊞', label: 'Özet' },
  { href: '/admin/users', icon: '◎', label: 'Kullanıcılar' },
  { href: '/admin/transactions', icon: '↻', label: 'İşlem logları' },
  { href: '/admin/broadcast', icon: '◆', label: 'Toplu duyuru' },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  const handleLogout = () => {
    clearAdminMockSession();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex w-56 xl:w-60 flex-shrink-0 flex-col bg-primary text-white overflow-hidden">
      <div className="px-6 py-6 border-b border-white/8">
        <TrionPayLogo width={110} color="#FFFFFF" accentColor="#5FE00B" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="text-white/25 text-[10px] font-bold tracking-widest uppercase px-3 mb-2">
          Yönetim
        </p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${isActive(href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'}
              `}
            >
              <span
                className={`text-base w-5 text-center ${isActive(href) ? 'text-accent' : ''}`}
              >
                {icon}
              </span>
              {label}
              {isActive(href) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <div className="px-3 pb-5 pt-2 border-t border-white/8">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <span className="text-base w-5 text-center">⎋</span>
          Çıkış
        </button>
      </div>
    </aside>
  );
}
