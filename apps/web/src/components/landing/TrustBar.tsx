'use client';

import { FadeIn } from './FadeIn';

const STATS = [
  { value: 'Hizli', label: 'Odeme' },
  { value: '256-bit', label: 'SSL Guvenligi' },
  { value: 'Anlik', label: 'Islem takibi' },
  { value: 'Tek akis', label: 'Kira + aidat' },
];

export function TrustBar() {
  return (
    <section className="bg-porcelain py-16 border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-light text-text-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-text-tertiary">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
