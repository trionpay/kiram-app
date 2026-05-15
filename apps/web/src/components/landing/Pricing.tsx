'use client';

import Link from 'next/link';
import { FadeIn } from './FadeIn';

export function Pricing() {
  return (
    <section id="pricing" className="bg-porcelain py-20">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-light text-text-primary mb-4 tracking-[-0.02em] leading-[1.15]">
              Seffaf Fiyatlandirma
            </h2>
            <p className="text-text-secondary text-sm">
              Gizli ucret yok, sadece islem basina %1,5 hizmet bedeli.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="bg-white rounded-[6px] p-8 md:p-12 shadow-xl-3">
            <div className="rounded-[6px] border border-border bg-porcelain p-6 md:p-7 mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <p className="text-text-secondary text-xs font-normal uppercase tracking-wide">Kisa ornek</p>
                <span className="rounded-[4px] bg-deep-violet/8 px-2.5 py-1 text-[11px] text-deep-violet">
                  Odemeden once net tutari gorursun
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Kira tutari</span>
                  <span className="text-text-primary font-normal tabular-nums text-sm">&pound;10.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Ek hizmet bedeli (%1,5)</span>
                  <span className="text-text-primary font-normal tabular-nums text-sm">&pound;150</span>
                </div>
                <div className="border-t border-border pt-3 mt-1">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-text-primary text-sm">Toplam</span>
                    <span className="text-deep-violet font-normal text-xl tabular-nums">&pound;10.150</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pb-8 mb-8 border-b border-border">
              <p className="text-text-tertiary text-xs mb-1">Islem basina hizmet bedeli</p>
              <div className="inline-flex items-baseline gap-2 flex-wrap justify-center">
                <span className="text-3xl md:text-4xl font-light text-deep-violet tabular-nums tracking-tight">%1,5</span>
                <span className="text-text-secondary text-sm">/ islem</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {['Sinirsiz islem', 'Aninda transfer', 'Dijital dekont', 'Otomatik odeme', '7/24 destek', 'Mobil uygulama'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-deep-violet/8 rounded-full flex items-center justify-center text-deep-violet text-xs">
                    &check;
                  </span>
                  <span className="text-text-secondary text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border flex flex-col items-center text-center gap-2">
              <Link
                href="/login"
                className="inline-flex w-full sm:w-auto sm:min-w-[240px] items-center justify-center gap-2 bg-deep-violet hover:bg-accent-dark text-white font-normal text-base px-8 py-4 rounded-[4px] transition-all"
              >
                Hemen Basla
                <span className="text-lg" aria-hidden>&rarr;</span>
              </Link>
              <p className="text-text-tertiary text-xs max-w-sm">
                Ucretsiz hesap olustur; yukari kaydirmadan devam et.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
