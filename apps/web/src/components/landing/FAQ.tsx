'use client';

import { useState } from 'react';
import { FadeIn } from './FadeIn';

const FAQS = [
  {
    q: 'Kiram nedir?',
    a: 'Kiram, kira ve aidat odemelerinizi kredi kartiyla yapmanizi saglayan bir odeme platformudur. Ev sahibinize veya site yonetimine kolayca odeme yapabilirsiniz.',
  },
  {
    q: 'Hangi kartlarla ödeme yapabilirim?',
    a: 'Tüm Visa, Mastercard ve Troy logolu kredi ve banka kartlarıyla ödeme yapabilirsiniz. Taksit seçeneği de mevcuttur.',
  },
  {
    q: 'Ödemeler ne kadar sürede ulaşır?',
    a: 'Ödemeler anında işleme alınır ve genellikle aynı gün içinde alıcı hesabına aktarılır.',
  },
  {
    q: 'Hizmet bedeli ne kadar?',
    a: 'İşlem başına %1,5 hizmet bedeli alınmaktadır. Gizli ücret yoktur.',
  },
  {
    q: 'Güvenli mi?',
    a: 'Evet, tüm ödemeler 256-bit SSL şifreleme ve 3D Secure ile korunur. PCI-DSS sertifikalı altyapımız banka düzeyinde güvenlik sağlar.',
  },
  {
    q: 'Otomatik ödeme nasıl çalışır?',
    a: 'Belirlediğiniz tarihte ve tutarda otomatik ödeme talimatı oluşturabilirsiniz. Kartınızdan otomatik olarak çekim yapılır.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-text-secondary">
              Merak ettikleriniz için cevaplar.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={i * 50}>
              <div className="border border-border rounded-2xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-medium text-text-primary">{faq.q}</span>
                  <span className={`text-text-tertiary transition-transform ${open === i ? 'rotate-180' : ''}`}>
                    ▼
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
