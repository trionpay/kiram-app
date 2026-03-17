# Trion Pay — Mobil Uygulama (Expo)

React Native + Expo. iOS ve Android için tek kod tabanı.

## Çalıştırma

```bash
# Monorepo kökünden
npm run dev:mobile

# veya apps/mobile içinden
npm start
```

- **iOS simülatör:** `npm run ios`
- **Android emülatör:** `npm run android`

## EAS Build (Store için paket üretme)

1. [Expo](https://expo.dev) hesabı açın, `eas login`
2. Projeyi bağlayın: `eas build:configure` (zaten yapılandırıldı)
3. **Preview (test):** `eas build --profile preview --platform all`
4. **Production (store):** `eas build --profile production --platform ios` veya `--platform android`

Çıktı: iOS için `.ipa`, Android için `.aab` (production) veya `.apk` (preview).

## EAS Submit (Store’a yükleme)

Build tamamlandıktan sonra:

- **iOS:** App Store Connect’te uygulama + bundle ID oluşturun. `eas.json` içinde `submit.production.ios` alanlarına `appleId`, `ascAppId`, `appleTeamId` yazın. Sonra: `eas submit --platform ios --latest`
- **Android:** Play Console’da uygulama oluşturun. Service account key alın, `submit.production.android.serviceAccountKeyPath` ile verin. Sonra: `eas submit --platform android --latest`

Detay: [EAS Submit docs](https://docs.expo.dev/submit/introduction/)
