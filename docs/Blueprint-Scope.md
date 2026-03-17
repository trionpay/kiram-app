# Trion Pay | Product Blueprint & Scope Matrix (v1)

Bu belge, Trion Pay mobil ve web uygulamalarının ilk sürümündeki (MVP) temel fonksiyonları, kullanıcı akışlarını ve projenin teknik sınırlarını netleştirmek amacıyla hazırlanmıştır. İşbu belge, tarafların sorumluluklarını ve "Kapsam Dışı" bırakılan modülleri netleştirerek ürünün akışını belirler.

**Referans:** Teklif 24345535 (v2.0), 23.02.2026. Kapsam dışı talepler Change Request / Faz-2 ile değerlendirilir.

---

## Kapsam Sınırı ve Teklif Referansı

- **Referans Doküman:** Bu matris, taraflarca onaylanmış "Trion Pay Teklif Sözleşmesi"ne binaen projenin teknik sınırlarını detaylandırır.
- **Kapsam Dışı Kuralı:** Teklifte ve aşağıdaki User Story'lerde yer almayan ek ekran, modül veya özellik kapsam dışıdır.
- **Ek Talepler:** Yeni talepler Faz-2 veya Change Request formu ile yeniden bütçelendirilir.

## Sistem Bağımlılığı ve API Sağlayıcı Sorumluluğu

- **API Tedariği:** Finansal altyapı (kart tahsilat, IBAN transfer, 3D Secure) BDDK/TCMB lisanslı ödeme kuruluşunun API'si ile sağlanır; Blurple entegre eder.
- **Teslimat:** API + dokümantasyon en geç 3. hafta sonunda sandbox ortamında teslim edilmelidir. Gecikmeler proje süresine eklenir.

---

## 1. Karşılama ve Doğrulama (Onboarding & Auth)

- **S1** – Splash ekranı (Trion Pay kurumsal kimlik, marka güveni).
- **S2** – SMS OTP ile kayıt/giriş.
- **S3** – Minimum KYC adımları (Ad, Soyad, TCKN, Doğum Tarihi vb.) ile hesap aktifleştirme.
- **S4** – "Şifremi Unuttum" akışı (SMS ile sıfırlama).
- **S5** – OTP ekranlarında "Kodu Tekrar Gönder" + geri sayım sayacı.
- **S6** – Tek cihaz oturumu: yeni giriş diğer oturumları sonlandırır.
- **Kapsam Dışı:** Liveness, OCR kimlik tarama (API’de hazır SDK yoksa).

## 2. Ana Dashboard (Vitrin)

- **S1** – "Yeni Ödeme Başlat" CTA odaklı, sürtünmesiz arayüz.
- **S2** – Yatay/dikey kaydırılabilir hızlı menü (sık işlemlere tek tık).
- **S3** – Son işlemler özet listesi (Başarılı/Başarısız durum ikonları).

## 3. Tek Taraflı Pürüzsüz Ödeme Akışı (Core Payment Flow)

- **S1** – İşlem Özeti: Tutar, Alıcı, Komisyon/Hizmet bedeli şeffaf gösterim.
- **S2** – Kart bilgisi girişi (Kart No, SKT, CVV); Luhn ile format doğrulama.
- **S3** – 3D Secure (WebView veya Native SDK) uygulama içinde kesintisiz.
- **S4** – Sonuç ekranları: Başarılı / Reddedildi / Bakiye Yetersiz (API response’a göre).
- **S5–S6** – Kart saklama yalnızca 3. parti (Sipay vb.) ile; Blurple sunucusunda tutulmaz (PCI-DSS).
- **S7** – Otomatik çekim talimatı (kira, aidat vb.); periyodik tahsilat ve yönetim.
- **Kapsam Dışı:** Cüzdan bakiye, kripto, IBAN→IBAN. Sadece Kart→IBAN. Alıcı kayıt olmaz; kullanıcı kendi alıcısını girer.

## 4. Alıcı Yönetimi (Saved Recipients)

- **S1** – Kayıtlı IBAN ve kişi/kurum listesi (özel sekme).
- **S2** – Yeni alıcı: IBAN doğrulama (TR + uzunluk); silme/düzenleme.
- **S3** – Nickname (örn. "Apartman Yönetimi", "Şirket Muhasebe").
- **S4** – KKB/Ödeme kuruluşu API ile IBAN + isim-soyisim eşleşmesi (API’ye bağımlı).

## 5. İşlem Geçmişi ve Dekontlar (Transaction History)

- **S1** – Ödemeler kronolojik liste; filtre: Başarılı/Başarısız/Beklemede.
- **S2** – Dekont: referans no, tarih, alıcı, hizmet bedeli. (Komisyon faturası kapsam dışı; fatura sağlayıcı ayrı anlaşma.)
- **S3** – Share API ile dekont PDF/resim paylaşımı (WhatsApp, Mail vb.).

## 6. Profil ve Ayarlar

- **S1** – İletişim ve temel profil görüntüleme.
- **S2** – KVKK, Kullanıcı Sözleşmesi, Gizlilik Politikası (statik sayfalar).
- **S3** – Logout; "Hesabımı Sil" (pasife alma).
- **S4** – E-posta/şifre güncelleme; TCKN, Ad-Soyad gibi KYC alanları değiştirilemez (veya admin onayı).

## 7. Trion Pay Web Platformu (Kullanıcı Portalı)

- **S1** – Mobil ile aynı veritabanı, Next.js, responsive Web App.
- **S2** – 15–20 ana/alt ekranın web uyarlaması (Dashboard, Ödeme, Geçmiş, Ayarlar vb.).
- **Kapsam Dışı:** Blog, CMS, mobilde olmayan ekstra özellikler. Bir kurumsal tanıtım sayfası dahil.

## 8. Admin Panel (Sistem Yönetimi)

- **S1** – Kullanıcı listesi; kullanıcı dondurabilme (Suspend).
- **S2** – İşlem logları (Başarılı/Başarısız, tutar, tarih); filtreleme.
- **S3** – Basit istatistik dashboard (günlük işlem hacmi, yeni kayıt sayısı vb.).
- **Kapsam Dışı:** Refund, iptal, bakiye/komisyon düzeltmesi (ödeme kuruluşu panelinde yürütülür).

## 9. Bildirimler ve Altyapı (Notifications & Deployment)

- **S1** – Push bildirim (ödeme başarılı/başarısız vb.).
- **S2** – Admin’den toplu duyuru (Broadcast Push).
- **S3** – Kaynak kodu GitHub; deployment Railway.
- **Kapsam Dışı (MVP):** Sadece Türkçe + Light theme. Çoklu dil, Dark Mode, SMS Gateway Faz-2.

---

## Fatura Ödeme Modülü

- **S1** – 3. parti fatura bayiliği API: kurum seçimi, abone/tesisat no ile borç sorgulama, ödeme akışı.
- **S2** – Kategori: Elektrik, Su, Doğalgaz, İnternet/Telekom. Kurum listesi ve logolar API’den dinamik.
- **S3 – Kapsam Dışı:** Tedarikçi API’de olmayan kurumlara özel entegrasyon yok. SGK, Vergi, Trafik Cezası, Harç dahil değil.
