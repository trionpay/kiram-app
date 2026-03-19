'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #152D4A 50%, #0C1929 100%)',
      }}
    >
      {/* Dekoratif elementler */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-[10%] w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #5FE00B 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-32 left-[5%] w-64 h-64 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #0369A1 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 50%)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Sol: İçerik */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Türkiye&apos;nin ödeme platformu</span>
            </div>

            {/* Başlık */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Kira, aidat ve
              <br />
              faturalarını
              <br />
              <span className="text-accent">tek yerden</span> öde.
            </h1>

            {/* Açıklama */}
            <p className="text-lg text-white/60 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
              Ev sahibine kira, siteye aidat, kurumlara fatura — hepsini kredi kartınla, tek uygulamadan, saniyeler içinde.
            </p>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold text-base px-8 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25"
              >
                Hemen Başla
                <span className="text-lg">→</span>
              </Link>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium text-sm px-5 py-3 rounded-xl transition-all"
                >
                  <AppleIcon />
                  App Store
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium text-sm px-5 py-3 rounded-xl transition-all"
                >
                  <PlayStoreIcon />
                  Play Store
                </a>
              </div>
            </div>

            {/* Alt not */}
            <p className="mt-6 text-white/40 text-sm">
              Ücretsiz hesap oluştur, hemen kullanmaya başla.
            </p>
          </div>

          {/* Sağ: Mockup / UI Preview */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Telefon çerçevesi — geniş ve temiz */}
              <div className="w-[300px] sm:w-[340px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/50">
                <div className="bg-background rounded-[2.5rem] overflow-hidden">
                  {/* Notch */}
                  <div className="h-8 bg-background flex justify-center items-end pb-1">
                    <div className="w-28 h-6 bg-gray-900 rounded-full" />
                  </div>
                  {/* Ekran içeriği */}
                  <div className="px-5 pb-8 pt-3 space-y-4">
                    {/* Mini dashboard header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-tertiary text-xs">Hoş geldin</p>
                        <p className="text-text-primary font-bold text-base">Ahmet</p>
                      </div>
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                    </div>
                    {/* Hero card mini */}
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: 'linear-gradient(135deg, #1E3A5F, #0C1929)' }}
                    >
                      <p className="text-white/50 text-xs mb-1">Toplam ödeme</p>
                      <p className="text-white font-bold text-2xl">₺14.850</p>
                      <div className="mt-4 bg-white/20 rounded-xl py-2.5 text-center">
                        <span className="text-white text-sm font-semibold">Ödeme Yap →</span>
                      </div>
                    </div>
                    {/* Son alıcılar mini */}
                    <div>
                      <p className="text-text-tertiary text-xs mb-2">Son Alıcılar</p>
                      <div className="flex gap-3">
                        {['🏢', '🏠', '⚡', '💧'].map((emoji, i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-lg"
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* İşlem satırları */}
                    <div className="space-y-2">
                      {[
                        { title: 'Apartman Aidatı', amount: '₺850' },
                        { title: 'Doğalgaz', amount: '₺320' },
                      ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-border rounded-lg" />
                            <span className="text-text-primary text-sm font-medium">{tx.title}</span>
                          </div>
                          <span className="text-text-primary text-sm font-bold">{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating card - sağda */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 w-48 hidden sm:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-base">✓</span>
                  </div>
                  <div>
                    <p className="text-text-primary text-xs font-semibold">Ödeme Başarılı</p>
                    <p className="text-text-tertiary text-[10px]">Az önce</p>
                  </div>
                </div>
                <p className="text-text-primary font-bold text-xl">₺12.000</p>
                <p className="text-text-tertiary text-xs">Kira ödemesi</p>
              </div>
              
              {/* Floating badge - solda */}
              <div className="absolute -left-2 bottom-1/4 bg-accent text-white rounded-2xl shadow-xl px-4 py-3 hidden sm:flex items-center gap-2">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-xs font-semibold">256-bit SSL</p>
                  <p className="text-[10px] text-white/70">Güvenli ödeme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-xs">Keşfet</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/40">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.04c-.6-.32-1.03-.86-1.18-1.52V2.48c.15-.66.58-1.2 1.18-1.52l10.46 11.04L3.18 23.04zm11.3-10.28l2.67-2.83 3.43 1.97c.71.41 1.14 1.14 1.14 1.94s-.43 1.53-1.14 1.94l-3.43 1.97-2.67-2.83-1.3 1.38 2.48 2.62-8.16 4.69 10.98-11.65zm-10.3 8.72L12.34 12 4.18 2.52v18.96z"/>
    </svg>
  );
}
