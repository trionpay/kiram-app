# GitHub ve canlı yayın (Railway)

Blueprint §9’da deployment için **Railway** referansı var; Next.js uygulamaları için doğrudan Railway kullanılabilir (Vercel zorunlu değil).

## Kod GitHub’da

```bash
git add -A
git status   # .env dosyası eklenmediğinden emin ol
git commit -m "mesaj"
git push origin main
```

## Railway — tek servis (`apps/web`)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → `kiram-app` seç.
2. **Settings → Service** (veya ilk deploy sırasında):
   - **Root Directory:** `apps/web` (monorepo alt klasörü).
   - **Build Command:** `npm install && npm run build` (Root Directory `apps/web` iken `apps/web` içindeki `package.json` kullanılır).
   - **Start Command:** `npm run start` → Next.js `next start` (PORT ortam değişkenini Railway otomatik verir).
3. **Variables:** Production için `NODE_ENV=production`; ileride API URL, secret’lar burada.
4. **Networking → Generate Domain** ile `*.railway.app` URL; sonra **Custom Domain** ile `kiram.com` bağlanabilir.

### Monorepo kökünden build (Root Directory boş / repo kökü)

Kök dizinde çalıştırmak istersen (ör. workspace script):

- **Build:** `npm ci && npm run build --workspace=web`
- **Start:** `npm run start --workspace=web`  
  Kök [package.json](../package.json) içine şunu eklemen gerekir:  
  `"start:web": "npm run start --workspace=web"`  
  ve Start Command: `npm run start:web`.

## İkinci servis: Admin panel (`apps/admin`)

Admin ayrı Next uygulaması olduğunda aynı Railway projesine **ikinci bir service** eklersin:

- Root Directory: `apps/admin`
- Build / Start: yine `npm run build` / `npm run start` (o paketin `package.json`’ına göre).

## Vercel (isteğe bağlı)

Next.js ekibinin platformu olarak **Vercel** hâlâ geçerli bir alternatif; Railway ile çakışma yok — tercih operasyonel (fiyat, tek panel, blueprint).

## İlgili

Kısa giriş + Vercel alternatifi: [GITHUB-VE-VERCEL.md](./GITHUB-VE-VERCEL.md).
