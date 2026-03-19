'use client';

import { FadeIn } from './FadeIn';

const STEPS = [
  {
    number: '01',
    icon: '👤',
    title: 'Hesap Oluştur',
    description: 'Telefon numaranla 30 saniyede kayıt ol.',
  },
  {
    number: '02',
    icon: '📝',
    title: 'Alıcı Ekle',
    description: 'Ev sahibi, site yönetimi veya kurum bilgilerini kaydet.',
  },
  {
    number: '03',
    icon: '💳',
    title: 'Kartla Öde',
    description: 'Kredi veya banka kartınla güvenli ödeme yap.',
  },
  {
    number: '04',
    icon: '✅',
    title: 'Dekont Al',
    description: 'Anında dijital dekont ile ödemeni belgele.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              4 kolay adımda ödemeni tamamla.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
