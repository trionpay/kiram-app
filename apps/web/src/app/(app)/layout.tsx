import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { redirect } from 'next/navigation';
import { validateUserSession } from '@/lib/auth/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await validateUserSession();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-porcelain overflow-hidden max-w-[100vw]">
      {/* Sabit sol sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 flex-shrink-0 bg-white border-r border-border overflow-hidden">
        <Suspense fallback={<div className="h-full" />}>
          <Sidebar />
        </Suspense>
      </aside>

      {/* Sağ taraf: topbar + içerik */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="relative z-[1] flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
