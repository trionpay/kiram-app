'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

const NAV_GROUPS = [
  {
    label: 'GENEL',
    items: [
      { href: '/dashboard', icon: '⊞', label: 'Genel bakış' },
      { href: '/payment', icon: '↗', label: 'Ödeme Yap' },
    ],
  },
  {
    label: 'HESAP',
    items: [
      { href: '/history', icon: '↻', label: 'Geçmiş' },
      { href: '/recipients', icon: '◎', label: 'Alıcılar' },
    ],
  },
];

const BOTTOM_ITEMS = [
  { href: '/profile', icon: '◉', label: 'Profil & Ayarlar' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8">
        <TrionPayLogo width={110} color="#FFFFFF" accentColor="#5FE00B" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-white/25 text-[10px] font-bold tracking-widest uppercase px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-150
                    ${isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }
                  `}
                >
                  <span className={`text-base w-5 text-center transition-all ${isActive(item.href) ? 'text-accent' : ''}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive(item.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Alt alan */}
      <div className="px-3 pb-5 border-t border-white/8 pt-4 space-y-0.5">
        {BOTTOM_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150
              ${isActive(item.href)
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }
            `}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Kullanıcı kartı */}
        <div className="mt-3 px-3 py-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-accent text-xs font-bold">AY</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Ahmet Yılmaz</p>
            <p className="text-white/35 text-xs truncate">+90 555 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
