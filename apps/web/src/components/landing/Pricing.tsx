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
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-bold text-primary">%1,5</span>
                <span className="text-text-secondary text-lg">/ işlem</span>
              </div>
              <p className="text-text-tertiary mt-2">Hizmet bedeli</p>
            </div>

            <div className="bg-surface rounded-2xl p-6 mb-8">
              <p className="text-text-secondary text-sm mb-3">Örnek hesaplama:</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary">Kira tutarı</span>
                <span className="text-text-primary font-medium">₺10.000</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary">Hizmet bedeli (%1,5)</span>
                <span className="text-text-primary font-medium">₺150</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary font-semibold">Toplam</span>
                  <span className="text-accent font-bold text-lg">₺10.150</span>
                </div>
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
                  <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xs">✓</span>
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
