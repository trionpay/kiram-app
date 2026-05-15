'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Genel bakış',
  '/payment': 'Ödeme Yap',
  '/history': 'Geçmiş',
  '/recipients': 'Alıcılar',
  '/profile': 'Profil',
};

type MockNotification = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  time: string;
  href: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: MockNotification[] = [
  { id: '1', emoji: '✅', title: 'Ödeme başarılı', body: '₺12.000 kira ödemesi alıcıya iletildi.', time: '2 saat önce', href: '/history', read: false },
  { id: '2', emoji: '⏳', title: 'İşlem beklemede', body: 'Aidat ödemeniz onay bekliyor.', time: 'Dün', href: '/history', read: false },
  { id: '3', emoji: '🪪', title: 'Kimlik doğrulama', body: 'Profilinizi tamamlayın.', time: '3 gün önce', href: '/profile', read: false },
  { id: '4', emoji: '💳', title: 'Ödeme hatırlatması', body: 'Mart kirası için ödeme zamanı yaklaşıyor.', time: '5 gün önce', href: '/payment', read: true },
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<MockNotification[]>(INITIAL_NOTIFICATIONS);
  const notificationsRootRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname === key || (key !== '/dashboard' && pathname.startsWith(key)))?.[1] ?? '';
  const showBack = pathname !== '/dashboard';
  const isDashboard = pathname === '/dashboard';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/dashboard');
  };

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (notificationsRootRef.current && !notificationsRootRef.current.contains(e.target as Node)) setNotificationsOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNotificationsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick, { passive: true });
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('touchstart', handleClick); document.removeEventListener('keydown', handleKey); };
  }, [notificationsOpen]);

  const markRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border px-4 sm:px-6 h-14 flex items-center gap-2 sm:gap-4 min-w-0">
        <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden shrink-0 w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-porcelain transition-colors" aria-label="Menü">
          <span className="w-5 h-0.5 bg-text-primary rounded-full" />
          <span className="w-5 h-0.5 bg-text-primary rounded-full" />
          <span className="w-3.5 h-0.5 bg-text-primary rounded-full self-start" />
        </button>

        {showBack && (
          <button type="button" onClick={handleBack} className="lg:hidden shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-porcelain transition-colors text-text-primary text-lg" aria-label="Geri">←</button>
        )}

        <Link href="/dashboard" className="lg:hidden flex shrink-0 items-center min-w-0 overflow-hidden max-w-[min(200px,50vw)]" aria-label="Genel bakış">
          <TrionPayLogo width={88} color="#2a4bb5" accentColor="#3458c5" />
        </Link>

        {!isDashboard && title && <span className="min-w-0 flex-1 truncate pl-1 text-base font-bold text-text-primary lg:hidden">{title}</span>}

        {!isDashboard && title && (
          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            {showBack && <button type="button" onClick={handleBack} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base text-text-primary hover:bg-porcelain" aria-label="Geri">←</button>}
            <span className="truncate text-xl font-bold text-text-primary">{title}</span>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div ref={notificationsRootRef} className="relative">
            <button type="button" onClick={() => setNotificationsOpen((o) => !o)} className="w-9 h-9 rounded-lg border border-border hover:bg-porcelain flex items-center justify-center transition-colors relative" aria-label="Bildirimler">
              <span className="text-text-secondary text-base">🔔</span>
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-[min(calc(100vw-3rem),380px)] max-h-[min(70vh,420px)] flex flex-col rounded-xl border border-border bg-white shadow-xl-2 z-[60] overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold text-text-primary">Bildirimler</h2>
                  {unreadCount > 0 && <button type="button" onClick={markAllRead} className="text-xs font-medium text-accent hover:text-accent-dark">Tümünü okundu işaretle</button>}
                </div>
                <ul className="overflow-y-auto flex-1 p-2" role="list">
                  {notifications.length === 0 ? (
                    <li className="px-3 py-8 text-center text-sm text-text-tertiary">Bildirim yok</li>
                  ) : notifications.map((n) => (
                    <li key={n.id}>
                      <Link href={n.href} onClick={() => { markRead(n.id); setNotificationsOpen(false); }} className={`flex gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-porcelain ${!n.read ? 'bg-accent/5' : ''}`}>
                        <span className="text-xl shrink-0">{n.emoji}</span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-text-primary">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                          </span>
                          <span className="block text-xs text-text-secondary mt-0.5">{n.body}</span>
                          <span className="block text-[11px] text-text-tertiary mt-1">{n.time}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border px-3 py-2">
                  <Link href="/history" onClick={() => setNotificationsOpen(false)} className="block text-center text-xs font-medium text-accent py-2 rounded-lg hover:bg-porcelain transition-colors">İşlem geçmişine git</Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/profile">
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center cursor-pointer hover:bg-accent/15 transition-colors">
              <span className="text-accent text-xs font-bold">AY</span>
            </div>
          </Link>
        </div>
      </header>

      {sidebarOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div className="lg:hidden fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="lg:hidden fixed inset-y-0 left-0 z-[200] w-[min(85vw,288px)] bg-white shadow-2xl flex flex-col border-r border-border" role="dialog" aria-modal="true">
            <Suspense fallback={<div className="h-full" />}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </Suspense>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
