'use client';

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
            {/* Önce cebinden çıkacak tutar — ana mesaj */}
            <div className="rounded-2xl border-2 border-accent/25 bg-accent/5 p-6 md:p-8 mb-8">
              <p className="text-text-secondary text-sm font-semibold uppercase tracking-wide mb-4">
                Örnek hesaplama
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-text-secondary">Kira tutarı</span>
                <span className="text-text-primary font-medium tabular-nums">₺10.000</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-text-secondary">Hizmet bedeli (%1,5)</span>
                <span className="text-text-primary font-medium tabular-nums">₺150</span>
              </div>
              <div className="border-t border-primary/10 pt-4 mt-2">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-text-primary font-bold text-lg">Ödeyeceğin toplam</span>
                  <span className="text-primary font-bold text-2xl md:text-3xl tabular-nums">
                    ₺10.150
                  </span>
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
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
