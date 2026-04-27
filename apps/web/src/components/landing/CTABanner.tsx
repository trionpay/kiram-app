'use client';

import Link from 'next/link';
import { FadeIn } from './FadeIn';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

export function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/90 py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <div className="flex justify-center mb-6">
            <TrionPayLogo width={140} color="#FFFFFF" accentColor="#5FE00B" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ev ödemelerini kolaylaştır
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Hemen ucretsiz hesap olustur, kira ve aidatini kredi kartinla odemeye basla.
          </p>
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <p className="text-white/50 text-xs font-medium mb-2">Önerilen: web’de hesap aç</p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold text-base px-8 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/30"
            >
              Hemen Başla
              <span aria-hidden>→</span>
            </Link>
            <div className="w-full border-t border-white/15 mt-8 pt-8 flex flex-col items-center gap-3">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                İstersen uygulamayı indir
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-transparent px-3 py-2 text-xs font-medium text-white/65 transition-colors hover:border-white/40 hover:text-white/85 hover:bg-white/5"
                >
                  <AppleIcon />
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-transparent px-3 py-2 text-xs font-medium text-white/65 transition-colors hover:border-white/40 hover:text-white/85 hover:bg-white/5"
                >
                  <PlayStoreIcon />
                  Play Store
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.04c-.6-.32-1.03-.86-1.18-1.52V2.48c.15-.66.58-1.2 1.18-1.52l10.46 11.04L3.18 23.04zm11.3-10.28l2.67-2.83 3.43 1.97c.71.41 1.14 1.14 1.14 1.94s-.43 1.53-1.14 1.94l-3.43 1.97-2.67-2.83-1.3 1.38 2.48 2.62-8.16 4.69 10.98-11.65zm-10.3 8.72L12.34 12 4.18 2.52v18.96z"/>
    </svg>
  );
}
