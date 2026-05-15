'use client';

import { FadeIn } from './FadeIn';

const STATS = [
  { value: 'Hızlı', label: 'Ödeme' },
  { value: '256-bit', label: 'SSL Güvenliği' },
  { value: 'Anlık', label: 'İşlem takibi' },
  { value: 'Tek akış', label: 'Kira + aidat' },
];

export function TrustBar() {
  return (
    <section className="bg-porcelain py-16 border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-deep-violet tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
