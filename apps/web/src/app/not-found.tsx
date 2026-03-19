import Link from 'next/link';
import type { Metadata } from 'next';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı — Kiram',
  description: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="inline-flex items-center">
            <TrionPayLogo width={100} color="#0C1929" accentColor="#0369A1" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-8xl sm:text-9xl font-bold text-primary/10 select-none leading-none" aria-hidden>
          404
        </p>
        <div className="-mt-8 sm:-mt-12 max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Bu sayfayı bulamadık
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mb-8">
            Adres yanlış yazılmış olabilir veya sayfa kaldırılmış olabilir. Ana sayfadan devam
            edebilir veya giriş yapabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-3.5 text-sm font-semibold text-text-inverse transition hover:opacity-90"
            >
              Ana sayfaya dön
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-8 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-surface"
            >
              Giriş yap
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-text-tertiary text-sm border-t border-border">
        <p>© {new Date().getFullYear()} TrionPay · Kiram</p>
      </footer>
    </div>
  );
}
