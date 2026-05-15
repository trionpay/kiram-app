import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, screenPaddingHorizontal } from '../theme';

export const LEGAL_DOCS = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    content: `KVKK AYDINLATMA METNİ

TRİONPAY TEKNOLOJİ YAZILIM HİZMETLERİ ANONİM ŞİRKETİ (bundan böyle "Kiramcom" olarak anılacaktır) olarak kişisel verilerinizin korunması ve güvenliği hususuna azami önem vermekteyiz. Kiramcom'a sağladığınız kişisel verileriniz; hizmetlerimizin hızlı, kolay ve güvenilir şekilde sunulması amacıyla işlenmekte ve gerekli olması hâlinde üçüncü kişilere aktarılabilmektedir.

1. Kişisel Verilerinizin İşlenmesine İlişkin İlkeler ve Hukuki Sebepler

Kiramcom; kullanıcıların kira ve/veya aidat ödemelerine ilişkin süreçlerini dijital ortamda yönetebilmelerine, ödeme işlemlerini başlatabilmelerine, işlem durumunu ve geçmişini takip edebilmelerine imkân sağlayan bir platformdur.

Kiramcom tarafından işlenen kişisel verileriniz;
• hukuka ve dürüstlük kuralının öngördüğü biçimde,
• doğru ve güncel olarak,
• belirli, açık ve meşru amaçlar için,
• işlenme amaçları ile bağlantılı, sınırlı ve ölçülü olarak işlenmektedir.

2. Kişisel Verilerinizin Toplanma Yöntemleri ve Toplanan Kişisel Veriler

Kiramcom, kredi kartı bilgilerini kendisine ait sistemlerde kayıt altına almaz.

2.1. Hangi Kişisel Verilerinizi Nasıl Topluyoruz?
• ad, soyad; e-posta adresi; T.C. Kimlik Numarası gibi kimlik bilgileriniz; telefon numarası, ev veya iş adresi gibi iletişim verileri,
• kullanıcı hesabı/üyelik kayıtları ve işlem geçmişi,
• kira ve/veya aidat ödemelerine ilişkin işlem verileri ve ödeme bilgileri,
• internet sitesi/uygulama kullanımından elde edilen teknik veriler.

3. Kişisel Verilerin Güvenliği

Kiramcom, kişisel verilerinizin güvenliğini sağlamak üzere çeşitli güvenlik teknolojileri ve yöntemleri uygular. Kredi kartı numarası veya parola gibi yüksek gizlilik derecesine sahip veriler internet üzerinden aktarılırken, güvenli giriş katmanı (SSL) benzeri şifreleme yöntemleri kullanılabilir.

4. Kişisel Verilerin Aktarılması

Kişisel verileriniz; KVKK'da belirtilen kurallar dâhilinde, kural olarak ilgili kişilerin açık rızası bulunmaksızın üçüncü kişilere aktarılmaz. Kişisel bilgilerinizi pazarlama amacıyla üçüncü taraflarla paylaşmayız.

5. Sorumluluğun Belirlenmesi

Kiramcom, Platform'u sağlayan ve işleten şirket olarak veri sorumlusu sıfatıyla gerekli organizasyonu kurmak ve teknik/idari önlemleri almakla yükümlüdür.

6. Kişisel Verilerinize İlişkin Haklarınız ve Başvuru

KVKK m.11 kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini isteme haklarına sahipsiniz.

Başvuru adresi: Merkezefendi Mah. Mevlana Cad. No: 112/1 Zeytinburnu/İstanbul
E-posta: info@genc.partners`,
  },

  terms: {
    title: 'Kullanıcı Sözleşmesi',
    content: `KULLANICI SÖZLEŞMESİ

Bu sözleşme, Kiram platformunu kullanan kullanıcılar ile Trion Pay Ödeme Hizmetleri A.Ş. arasındaki hak ve yükümlülükleri düzenlemektedir.

1. TARAFLAR VE KONU
İşbu sözleşme, kiram.com web sitesi ve Kiram mobil uygulaması (Platform) üzerinden sunulan dijital ödeme aracılık hizmetlerine ilişkindir.

2. HİZMETİN KAPSAMI
Platform; kullanıcıların kayıtlı veya manuel girilen IBAN bilgisine sahip alıcılara kredi/banka kartı aracılığıyla ödeme yapmasına imkân tanır. Platform bir ödeme kuruluşu değildir; BDDK/TCMB lisanslı bir ödeme kuruluşuyla entegre çalışmaktadır.

3. KULLANICI YÜKÜMLÜLÜKLERİ
Kullanıcı; doğru ve güncel bilgi vermekle, hesabının güvenliğini sağlamakla, platformu hukuka aykırı amaçlarla kullanmamakla yükümlüdür.

4. GİZLİLİK
Kullanıcı bilgileri KVKK Aydınlatma Metni kapsamında işlenir. Kart bilgileri PCI-DSS standartlarında korunur ve Kiram sunucularında saklanmaz.

5. ÜCRETLER VE KOMİSYON
Her işlem için işlem tutarı üzerinden %1,5 hizmet bedeli tahsil edilir. Bu oran önceden bildirimle değiştirilebilir.

6. SORUMLULUK SINIRLAMASI
Platform, üçüncü taraf ödeme altyapısından kaynaklanabilecek gecikmeler, hatalar veya kesintilerden sorumlu tutulamaz.

7. SÖZLEŞMENİN FESHİ
Kullanıcı dilediği zaman hesabını silebilir. Platform, hizmet koşullarını ihlal eden kullanıcıların hesabını askıya alabilir veya feshedebilir.`,
  },

  privacy: {
    title: 'Gizlilik Politikası',
    content: `GİZLİLİK POLİTİKASI

Kiram olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz.

1. TOPLANAN VERİLER
Hesap oluşturma sırasında verdiğiniz kimlik ve iletişim bilgileri, uygulama kullanımı sırasında oluşan işlem verileri ve teknik veriler (cihaz bilgisi, IP adresi, uygulama sürümü) toplanmaktadır.

2. VERİLERİN KULLANIMI
Topladığımız veriler; hizmet sunumu, kimlik doğrulama, güvenlik, müşteri desteği, yasal yükümlülükler ve ürün geliştirme amacıyla kullanılmaktadır.

3. ÇEREZLER VE İZLEME
Web platformumuzda oturum yönetimi için zorunlu çerezler kullanılmaktadır. Üçüncü taraf reklam veya analitik çerezleri kullanılmamaktadır.

4. VERİ GÜVENLİĞİ
Verileriniz 256-bit SSL/TLS şifreleme ile aktarılmakta, kart bilgileri PCI-DSS standartlarında saklanmaktadır. Düzenli güvenlik denetimleri yapılmaktadır.

5. ÜÇÜNCÜ TARAFLARLA PAYLAŞIM
Verileriniz; ödeme işlemlerinin tamamlanması için lisanslı ödeme kuruluşuna, yasal zorunluluk durumunda yetkili kamu kurumlarına aktarılabilir. Reklam veya pazarlama amacıyla üçüncü taraflarla paylaşılmaz.

6. VERİLERİNİZİN KONTROLÜ
Hesap silme talebi ilettiğinizde, yasal saklama süreleri haricindeki verileriniz silinir. Detaylı bilgi için kvkk@kiram.com adresine başvurabilirsiniz.`,
  },
};

export function LegalModal({ docKey, onClose }) {
  const doc = LEGAL_DOCS[docKey];
  if (!doc) return null;

  return (
    <Modal visible animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>{doc.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.body}>{doc.content}</Text>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeFullBtn} onPress={onClose}>
            <Text style={styles.closeFullBtnText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenPaddingHorizontal,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { ...typography.h3, color: colors.textPrimary, flex: 1, paddingRight: spacing.md },
  closeBtn: { padding: spacing.xs },
  closeText: { fontSize: 18, color: colors.textSecondary },

  content: { padding: screenPaddingHorizontal, paddingBottom: spacing.xl },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeFullBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFullBtnText: { ...typography.label, color: colors.textInverse },
});
