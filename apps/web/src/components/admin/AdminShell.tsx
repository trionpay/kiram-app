'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function AdminShell({
  children,
  operatorEmail,
}: {
  children: React.ReactNode;
  operatorEmail?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const showBack = pathname !== '/admin';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin');
    }
  };

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar operatorEmail={operatorEmail ?? null} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-elevated px-4 sm:px-6">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-medium text-text-primary transition-colors hover:bg-surface"
              aria-label="Geri"
            >
              ←
            </button>
          ) : null}
          <h1 className="min-w-0 truncate text-sm font-semibold text-text-secondary">
            kiram.com — yönetim paneli
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
