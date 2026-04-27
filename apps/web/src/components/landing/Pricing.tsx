'use client';

import Link from 'next/link';
import { FadeIn } from './FadeIn';

export function Pricing() {
  return (
    <section id="pricing" className="bg-surface py-20">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Şeffaf Fiyatlandırma
            </h2>
            <p className="text-text-secondary">
              Gizli ücret yok, sadece işlem başına %1,5 hizmet bedeli.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-lg">
            {/* İlk bakışta daha yumuşak örnek kutusu */}
            <div className="rounded-2xl border border-border bg-surface p-6 md:p-7 mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <p className="text-text-secondary text-sm font-semibold uppercase tracking-wide">Kısa örnek</p>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  Ödemeden önce net tutarı görürsün
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Kira tutarı</span>
                  <span className="text-text-primary font-semibold tabular-nums">₺10.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Ek hizmet bedeli (%1,5)</span>
                  <span className="text-text-primary font-semibold tabular-nums">₺150</span>
                </div>
                <div className="border-t border-border pt-3 mt-1">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-text-primary font-semibold">Toplam</span>
                    <span className="text-primary font-bold text-xl tabular-nums">₺10.150</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Oran ikincil — başlık ve tabloyu gölgelemez */}
            <div className="text-center pb-8 mb-8 border-b border-border">
              <p className="text-text-tertiary text-sm mb-1">İşlem başına hizmet bedeli</p>
              <div className="inline-flex items-baseline gap-2 flex-wrap justify-center">
                <span className="text-3xl md:text-4xl font-bold text-primary tabular-nums">%1,5</span>
                <span className="text-text-secondary text-base font-medium">/ işlem</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Sınırsız işlem',
                'Anında transfer',
                'Dijital dekont',
                'Otomatik ödeme',
                '7/24 destek',
                'Mobil uygulama',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xs">
                    ✓
                  </span>
                  <span className="text-text-secondary text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border flex flex-col items-center text-center gap-2">
              <Link
                href="/login"
                className="inline-flex w-full sm:w-auto sm:min-w-[240px] items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold text-base px-8 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25"
              >
                Hemen Başla
                <span className="text-lg" aria-hidden>
                  →
                </span>
              </Link>
              <p className="text-text-tertiary text-xs max-w-sm">
                Ücretsiz hesap oluştur; yukarı kaydırmadan devam et.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
