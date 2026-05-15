'use client';

import { FadeIn } from './FadeIn';

const STEPS = [
  { number: '01', icon: '👤', title: 'Hesap Olustur', description: 'Telefon numaranla 30 saniyede kayit ol.' },
  { number: '02', icon: '📝', title: 'Alici Ekle', description: 'Ev sahibi veya site yonetimi bilgilerini bir kez kaydet.' },
  { number: '03', icon: '💳', title: 'Kartla Ode', description: 'Kredi veya banka kartinla guvenli odeme yap.' },
  { number: '04', icon: '📊', title: 'Takip Et', description: 'Durum, gecmis ve dekontlari panel uzerinden aninda izle.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-light text-text-primary mb-4 tracking-[-0.02em] leading-[1.15]">
              4 adimda tamamla
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm">
              Kira ve aidat odemesi icin net, modern ve hizli akis.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-powder-blue rounded-[6px] flex items-center justify-center text-4xl">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-deep-violet text-white text-sm font-normal rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-[18px] font-normal text-text-primary mb-2 leading-[1.25]">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
