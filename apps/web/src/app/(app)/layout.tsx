import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sabit sol sidebar — sadece desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 flex-shrink-0 bg-elevated border-r border-border overflow-hidden">
        <Sidebar />
      </aside>

      {/* Sağ taraf: topbar + içerik */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(36,75,142,0.06)_1px,transparent_1px)] bg-[size:36px_36px] opacity-35"
        />
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
