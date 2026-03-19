# GitHub ve canlı yayın (Vercel)

## Kod GitHub’da

Bu monorepo `git push` ile GitHub’a gönderilir. Uzak repo: `origin` (ör. `baranbdrr/kiram-app`).

```bash
git add -A
git status   # .env dosyası eklenmediğinden emin ol
git commit -m "feat(web): landing, 404, bildirim paneli"
git push origin main
```

## Canlı site (deploy)

GitHub kodu barındırır; **Next.js uygulamasını** genelde **Vercel** üzerinden yayınlarsın (Next.js ile aynı ekip).

1. [vercel.com](https://vercel.com) → **Add New Project** → GitHub’dan `kiram-app` repo’sunu seç.
2. **Root Directory**: `apps/web` olarak ayarla.
3. **Framework Preset**: Next.js (otomatik).
4. **Deploy** — birkaç dakika içinde `*.vercel.app` URL’si oluşur.
5. İstersen **Domains** kısmından `kiram.com` ekle.

> Ortam değişkenleri gerektiğinde Vercel **Settings → Environment Variables** üzerinden eklenir.

## GitHub Actions (isteğe bağlı)

Vercel’in “Import from GitHub” entegrasyonu her push’ta otomatik deploy eder; ayrıca workflow şart değildir.
