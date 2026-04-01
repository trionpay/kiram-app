'use client';

import { FadeIn } from './FadeIn';

const STATS = [
  { value: '50K+', label: 'Aktif Kullanıcı' },
  { value: '₺120M+', label: 'İşlem Hacmi' },
  { value: '%99+', label: 'Başarılı ödeme oranı' },
  { value: '4.8', label: 'App Store Puanı', suffix: '⭐' },
];

export function TrustBar() {
  return (
    <section className="bg-white py-16 border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                  {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
                </p>
                <p className="mt-2 text-sm font-medium text-primary/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
