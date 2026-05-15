'use client';

import { useState } from 'react';
import { FadeIn } from './FadeIn';

const FAQS = [
  { q: 'Kiram nedir?', a: 'Kiram, kira ve aidat odemelerinizi kredi kartiyla yapmanizi saglayan bir odeme platformudur. Ev sahibinize veya site yonetimine kolayca odeme yapabilirsiniz.' },
  { q: 'Hangi kartlarla odeme yapabilirim?', a: 'Tum Visa, Mastercard ve Troy logolu kredi ve banka kartlariyla odeme yapabilirsiniz. Taksit secenegi de mevcuttur.' },
  { q: 'Odemeler ne kadar surede ulasir?', a: 'Odemeler aninda isleme alinir ve genellikle ayni gun icinde alici hesabina aktarilir.' },
  { q: 'Hizmet bedeli ne kadar?', a: 'Seffaf ucretlendirme uygulanir, gizli masraf yoktur.' },
  { q: 'Guvenli mi?', a: 'Evet, tum odemeler 256-bit SSL sifreleme ve 3D Secure ile korunur. PCI-DSS sertifikali altyapimiz banka duzeyinde guvenlik saglar.' },
  { q: 'Otomatik odeme nasil calisir?', a: 'Belirlediginiz tarihte ve tutarda otomatik odeme talimati olusturabilirsiniz. Kartinizdan otomatik olarak cekim yapilir.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-light text-text-primary mb-4 tracking-[-0.02em] leading-[1.15]">
              Sikca Sorulan Sorular
            </h2>
            <p className="text-text-secondary text-sm">
              Merak ettikleriniz icin cevaplar.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={i * 50}>
              <div className="border border-border rounded-[6px] overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-porcelain transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-text-primary text-sm">{faq.q}</span>
                  <span className={`text-text-tertiary transition-transform text-xs ${open === i ? 'rotate-180' : ''}`}>
                    &#9660;
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-4">
                    <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
