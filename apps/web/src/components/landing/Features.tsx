'use client';

import { FadeIn } from './FadeIn';

const FEATURES = [
  { emoji: '💳', title: 'Kredi kartıyla ödeme', description: 'Kira ve aidat ödemelerini tek akışta tamamla, kart avantajlarını kullan.' },
  { emoji: '🧭', title: 'Net ödeme takibi', description: 'Her işlemin durumu, dekontu ve zamanı tek panelde görünür.' },
  { emoji: '⚡', title: 'Hızlı onay akışı', description: 'Ödeme adımları sade ve hızlıdır; birkaç dokunuşla tamamlanır.' },
  { emoji: '📅', title: 'Periyodik düzen', description: 'Aylık kira/aidat düzenini takip et, gecikmeleri azalt.' },
  { emoji: '🔐', title: 'Güvenli ödeme katmanı', description: '3D Secure ve güçlü şifreleme ile işlem güvenliği korunur.' },
  { emoji: '📱', title: 'Web + mobil deneyim', description: 'Aynı hesapla web ve mobilde tutarlı, modern bir ödeme deneyimi.' },
];

export function Features() {
  return (
    <section id="features" className="bg-powder-blue py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Kira ve aidat için tasarlanmış
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-base leading-relaxed">
              Genel bir ödeme uygulaması değil; doğrudan kira ve aidat akışını hızlandıran odaklı ürün deneyimi.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-white rounded-xl p-6 border border-border/50 hover:shadow-xl-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="text-3xl mb-4">{feature.emoji}</div>
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
