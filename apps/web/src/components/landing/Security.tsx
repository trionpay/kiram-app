'use client';

import { FadeIn } from './FadeIn';

const BADGES = [
  { icon: '🔒', title: '256-bit SSL', desc: 'Banka duzeyinde sifreleme' },
  { icon: '🛡️', title: 'PCI-DSS', desc: 'Kart guvenligi sertifikasi' },
  { icon: '🏛️', title: 'Regulasyon', desc: 'Odeme islemleri lisansli altyapi saglayici ile' },
  { icon: '📋', title: 'KVKK', desc: 'Kisisel veri korumasi' },
];

export function Security() {
  return (
    <section className="bg-text-primary py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <h2 className="text-[32px] font-light text-white mb-4 tracking-[-0.02em] leading-[1.15]">
                Guvenligin en ust seviyesi
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed text-sm">
                Finansal verileriniz banka duzeyinde guvenlik protokolleriyle korunur.
                Tum islemler sifreli baglanti uzerinden gerceklesir.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge, i) => (
                  <div key={i} className="bg-white/8 rounded-[6px] p-4 border border-white/10">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <p className="text-white font-normal text-sm">{badge.title}</p>
                    <p className="text-white/50 text-xs">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="relative">
              <div className="bg-white/8 rounded-[6px] p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-deep-violet rounded-[6px] flex items-center justify-center">
                    <span className="text-white text-xl">&check;</span>
                  </div>
                  <div>
                    <p className="text-white font-normal">Guvenli Odeme</p>
                    <p className="text-white/50 text-sm">3D Secure ile korunuyor</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Kart bilgileri saklanmaz', 'Her islem SMS ile onaylanir', '7/24 fraud izleme'].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <span className="text-soft-violet">&check;</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
