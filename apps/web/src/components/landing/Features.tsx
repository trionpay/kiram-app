'use client';

import { FadeIn } from './FadeIn';

const FEATURES = [
  { emoji: '💳', title: 'Kredi kartiyla odeme', description: 'Kira ve aidat odemelerini tek akista tamamla, kart avantajlarini kullan.' },
  { emoji: '🧭', title: 'Net odeme takibi', description: 'Her islemin durumu, dekontu ve zamani tek panelde gorunur.' },
  { emoji: '⚡', title: 'Hizli onay akisi', description: 'Odeme adimlari sade ve hizlidir; birkac dokunusla tamamlanir.' },
  { emoji: '📅', title: 'Periyodik duzen', description: 'Aylik kira/aidat duzenini takip et, gecikmeleri azalt.' },
  { emoji: '🔐', title: 'Guvenli odeme katmani', description: '3D Secure ve guclu sifreleme ile islem guvenligi korunur.' },
  { emoji: '📱', title: 'Web + mobil deneyim', description: 'Ayni hesapla web ve mobilde tutarli, modern bir odeme deneyimi.' },
];

export function Features() {
  return (
    <section id="features" className="bg-powder-blue py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-light text-text-primary mb-4 tracking-[-0.02em] leading-[1.15]">
              Kira ve aidat icin tasarlanmis
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm leading-relaxed">
              Genel bir odeme uygulamasi degil; dogrudan kira ve aidat akisini hizlandiran odakli urun deneyimi.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {FEATURES.map((feature, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-white rounded-[6px] p-6 hover:shadow-xl-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="text-3xl mb-4">{feature.emoji}</div>
                <h3 className="text-[18px] font-normal text-text-primary mb-2 leading-[1.25]">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
