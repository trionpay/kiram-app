'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Abstract gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(circle at 70% 40%, rgba(83,58,253,0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(128,135,255,0.08), transparent 50%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Sol: Icerik */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-deep-violet/8 border border-deep-violet/15 rounded-md px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-deep-violet rounded-full" />
              <span className="text-text-secondary text-xs font-normal tracking-wide">Kira ve aidat icin odakli odeme deneyimi</span>
            </div>

            <h1 className="text-5xl sm:text-[56px] lg:text-[56px] font-light text-text-primary leading-[1.07] tracking-[-0.03em] mb-6">
              Kira ve aidati
              <br />
              <span className="text-deep-violet">kartinla ode,</span>
              <br />
              sureci takip et.
            </h1>

            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
              Ev sahibine kira ve site yonetimine aidat odemeni tek akista tamamla; islem durumunu, dekontlarini ve gecmisini her an kontrol et.
            </p>

            <div className="flex flex-col gap-5 justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 self-center lg:self-start bg-deep-violet hover:bg-accent-dark text-white font-normal text-base px-6 py-4 rounded-[4px] transition-all"
              >
                Hemen Basla
                <span className="text-lg" aria-hidden>
                  &rarr;
                </span>
              </Link>
              <div className="flex flex-col items-center lg:items-start gap-2">
                <p className="text-text-tertiary text-xs font-normal uppercase tracking-wider">
                  Uygulamayi indir
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-washed-violet bg-transparent px-4 py-2.5 text-sm font-normal text-deep-violet transition-colors hover:bg-deep-violet/5"
                  >
                    <AppleIcon />
                    App Store
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-washed-violet bg-transparent px-4 py-2.5 text-sm font-normal text-deep-violet transition-colors hover:bg-deep-violet/5"
                  >
                    <PlayStoreIcon />
                    Play Store
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sag: Ev gorseli */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <Image
                src="/hero-home.png"
                alt="Kiram - ev odeme konsepti"
                width={520}
                height={520}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
              {/* Floating card */}
              <div className="absolute -left-4 bottom-1/4 bg-white rounded-[6px] shadow-xl-2 p-4 w-48 hidden sm:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                    <span className="text-success text-base">&check;</span>
                  </div>
                  <div>
                    <p className="text-text-primary text-xs font-normal">Odeme Basarili</p>
                    <p className="text-text-tertiary text-[10px]">Az once</p>
                  </div>
                </div>
                <p className="text-text-primary font-normal text-xl">&pound;12.000</p>
                <p className="text-text-tertiary text-xs">Kira odemesi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-text-tertiary text-xs">Kesfet</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-tertiary">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
