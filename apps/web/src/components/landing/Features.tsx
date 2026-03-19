'use client';

import { FadeIn } from './FadeIn';

const FEATURES = [
  {
    emoji: '💳',
    title: 'Kredi Kartıyla Öde',
    description: 'Kira, aidat ve faturalarını kredi kartınla öde, taksit imkanından yararlan.',
  },
  {
    emoji: '🏠',
    title: 'Ev Ödemelerini Kolaylaştır',
    description: 'Ev sahibine kira, siteye aidat — tek platformdan yönet.',
  },
  {
    emoji: '⚡',
    title: 'Anında Transfer',
    description: 'Ödemeler anında alıcı hesabına aktarılır. Bekleme yok.',
  },
  {
    emoji: '🔄',
    title: 'Otomatik Ödeme',
    description: 'Tekrarlayan ödemeler için talimat oluştur, unutma derdi bitsin.',
  },
  {
    emoji: '📱',
    title: 'Mobil Uygulama',
    description: 'iOS ve Android uygulamalarıyla her yerden ödeme yap.',
  },
  {
    emoji: '🧾',
    title: 'Dijital Dekont',
    description: 'Her ödeme sonrası anında dekont. Paylaş, sakla.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-surface py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Neden Kiram?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Ev ödemelerini yönetmenin en kolay ve güvenli yolu.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
