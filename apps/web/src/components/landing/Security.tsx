'use client';

import { FadeIn } from './FadeIn';

const BADGES = [
  { icon: '🔒', title: '256-bit SSL', desc: 'Banka düzeyinde şifreleme' },
  { icon: '🛡️', title: 'PCI-DSS', desc: 'Kart güvenliği sertifikası' },
  { icon: '🏛️', title: 'Regülasyon', desc: 'Ödeme işlemleri lisanslı altyapı sağlayıcı ile' },
  { icon: '📋', title: 'KVKK', desc: 'Kişisel veri koruması' },
];

export function Security() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Güvenliğin en üst seviyesi
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Finansal verileriniz banka düzeyinde güvenlik protokolleriyle korunur. 
                Tüm işlemler şifreli bağlantı üzerinden gerçekleşir.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {BADGES.map((badge, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <p className="text-white font-semibold text-sm">{badge.title}</p>
                    <p className="text-white/60 text-xs">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Güvenli Ödeme</p>
                    <p className="text-white/60 text-sm">3D Secure ile korunuyor</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="text-accent">✓</span>
                    <span>Kart bilgileri saklanmaz</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="text-accent">✓</span>
                    <span>Her işlem SMS ile onaylanır</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="text-accent">✓</span>
                    <span>7/24 fraud izleme</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
