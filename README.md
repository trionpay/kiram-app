# Kiram.com / Trion Pay

Fintech platformu: mobil uygulama (Expo) + web uygulaması (Next.js) + yönetim paneli. Monorepo.

## Yapı

- **apps/mobile** — React Native (Expo). iOS & Android. Midas App tarzı UI hedefleniyor.
- **apps/web** — Next.js. Mobil ile aynı özellik seti, responsive.
- **apps/admin** — Yönetim paneli (kullanıcı listesi, işlem logları, istatistikler). İleride.
- **packages/shared-types** — Ortak TypeScript tipleri (Transaction, Recipient, UserProfile vb.).
- **packages/api-client** — API client iskeleti. Ödeme kuruluşu API’si geldiğinde doldurulacak.
- **docs/Blueprint-Scope.md** — Kapsam ve kullanıcı hikayeleri referansı.

## Gereksinimler

- Node.js 18+
- (Mobil) iOS: Xcode, Android: Android Studio veya Expo Go ile test.

## Komutlar (repo kökünden)

```bash
npm install
npm run dev:web      # Web: http://localhost:3000
npm run dev:mobile   # Mobil: Expo dev server
npm run build:web
```

## Mobil build ve store

- **EAS Build:** `cd apps/mobile && eas build --profile production --platform all`
- **EAS Submit:** Build tamamlandıktan sonra `eas submit --platform ios --latest` / `--platform android --latest`
- Detay: [apps/mobile/README.md](apps/mobile/README.md)

## GitHub

Bu repoyu kendi GitHub hesabınızda yeni bir repo olarak oluşturup bağlayın:

```bash
git init
git add .
git commit -m "chore: monorepo iskeleti, Blueprint referansı, Expo + Next.js"
git remote add origin https://github.com/<org>/<repo>.git
git branch -M main
git push -u origin main
```

## Referans

- Kapsam: [docs/Blueprint-Scope.md](docs/Blueprint-Scope.md)
- Teklif: Trion Pay Teklif Sözleşmesi 24345535 (v2.0)
