'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Ana Sayfa',
  '/payment': 'Ödeme Yap',
  '/history': 'Geçmiş',
  '/recipients': 'Alıcılar',
  '/profile': 'Profil',
};

export function Topbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname === key || (key !== '/dashboard' && pathname.startsWith(key))
  )?.[1] ?? '';

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-6 h-16 flex items-center gap-4">
        {/* Hamburger — sadece mobilde */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-surface transition-colors"
          aria-label="Menü"
        >
          <span className="w-5 h-0.5 bg-text-primary rounded-full" />
          <span className="w-5 h-0.5 bg-text-primary rounded-full" />
          <span className="w-3.5 h-0.5 bg-text-primary rounded-full self-start" />
        </button>

        {/* Mobil logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <span className="font-bold text-primary tracking-tight">kiram</span>
        </Link>

        {/* Sayfa başlığı — desktop */}
        <span className="hidden lg:block text-sm font-semibold text-text-secondary">{title}</span>

        <div className="flex-1" />

        {/* Sağ aksiyonlar */}
        <div className="flex items-center gap-3">
          {/* Bildirim */}
          <button className="w-9 h-9 rounded-xl hover:bg-surface flex items-center justify-center transition-colors relative">
            <span className="text-text-secondary text-base">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* Avatar */}
          <Link href="/profile">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-white text-xs font-bold">AY</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Mobil sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-primary shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
