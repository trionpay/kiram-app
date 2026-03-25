# GitHub ve deploy

**Öncelikli rehber:** Canlı ortam için **[GITHUB-RAILWAY.md](./GITHUB-RAILWAY.md)** — Railway üzerinden monorepo deploy adımları.

Aşağıdaki Vercel adımları yalnızca **alternatif** olarak kalır.

## Kod GitHub’da

```bash
git add -A
git status
git commit -m "mesaj"
git push origin main
```

## Alternatif: Vercel (Next.js)

1. [vercel.com](https://vercel.com) → repo import → **Root Directory:** `apps/web`
2. Deploy sonrası domain ayarı.

Ortam değişkenleri: Vercel **Settings → Environment Variables**.
