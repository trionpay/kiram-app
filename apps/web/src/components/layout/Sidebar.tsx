'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

const NAV_GROUPS = [
  {
    label: 'GENEL BAKIŞ',
    items: [
      { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    ],
  },
  {
    label: 'ÖDEME',
    items: [
      { href: '/payment', icon: '↗', label: 'Hızlı ödeme' },
      { href: '/payment?type=rent', icon: '🧱', label: 'Kira öde' },
      { href: '/payment?type=dues', icon: '🧾', label: 'Aidat öde' },
    ],
  },
  {
    label: 'TAKİP',
    items: [
      { href: '/history', icon: '🕘', label: 'İşlem geçmişi' },
      { href: '/history?durum=pending', icon: '⏳', label: 'Bekleyen işlemler' },
      { href: '/recipients', icon: '👥', label: 'Alıcı listesi' },
      { href: '/recipients?new=1', icon: '＋', label: 'Yeni alıcı ekle' },
    ],
  },
];

const BOTTOM_ITEMS = [
  { href: '/profile', icon: '⚙️', label: 'Profil & Ayarlar' },
  { href: '/profile#security', icon: '🛡️', label: 'Güvenlik & KVKK' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    const [targetPath, targetQuery] = href.split('?');

    if (!targetQuery) {
      // Base payment/history links should not look active when a more specific query-tab is active.
      if (targetPath === '/payment' && searchParams.get('type')) return false;
      if (targetPath === '/history' && searchParams.get('durum')) return false;
      return pathname === targetPath || (targetPath !== '/dashboard' && pathname.startsWith(targetPath));
    }

    if (pathname !== targetPath) return false;

    const targetParams = new URLSearchParams(targetQuery);
    for (const [key, value] of targetParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <TrionPayLogo width={110} color="#244B8E" accentColor="#2E6FD6" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-text-tertiary text-[10px] font-bold tracking-widest uppercase px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-150
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-primary/14 to-accent/10 text-primary border border-primary/20'
                      : 'text-text-secondary hover:text-primary hover:bg-surface'
                    }
                  `}
                >
                  {isActive(item.href) ? (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" aria-hidden />
                  ) : null}
                  <span className={`text-base w-5 text-center transition-all ${isActive(item.href) ? 'text-primary' : 'text-text-tertiary'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive(item.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Alt alan */}
      <div className="px-3 pb-5 border-t border-border pt-4 space-y-0.5">
        {BOTTOM_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`
              relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150
              ${isActive(item.href)
                ? 'bg-gradient-to-r from-primary/14 to-accent/10 text-primary border border-primary/20'
                : 'text-text-secondary hover:text-primary hover:bg-surface'
              }
            `}
          >
            {isActive(item.href) ? (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" aria-hidden />
            ) : null}
            <span className="text-base w-5 text-center text-text-tertiary">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Kullanıcı kartı */}
        <div className="mt-3 px-3 py-3 rounded-xl border border-border bg-surface/70 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-xs font-bold">AY</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-semibold truncate">Ahmet Yılmaz</p>
            <p className="text-text-tertiary text-xs truncate">+90 555 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
