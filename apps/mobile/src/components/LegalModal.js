import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, screenPaddingHorizontal } from '../theme';

export const LEGAL_DOCS = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    content: `KİŞİSEL VERİLERİN KORUNMASI KANUNU AYDINLATMA METNİ

Kiram (Trion Pay Ödeme Hizmetleri A.Ş.), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla aşağıdaki bilgilendirmeyi yapmaktadır.

1. İŞLENEN KİŞİSEL VERİLER
Kimlik bilgileri (ad, soyad, T.C. Kimlik Numarası, doğum tarihi), iletişim bilgileri (telefon numarası, e-posta adresi, şehir), finansal bilgiler (IBAN bilgisi, ödeme geçmişi) ve işlem bilgileri işlenmektedir.

2. KİŞİSEL VERİLERİN İŞLENME AMACI
Toplanan veriler; hizmet sözleşmesinin ifası, yasal yükümlülüklerin yerine getirilmesi, kimlik doğrulama ve güvenlik süreçlerinin yürütülmesi, müşteri hizmetleri ve destek faaliyetleri amacıyla işlenmektedir.

3. KİŞİSEL VERİLERİN AKTARILMASI
Kişisel verileriniz; BDDK/TCMB lisanslı ödeme kuruluşlarına, yasal zorunluluk kapsamında kamu kurumlarına ve KKB'ye aktarılabilir. Yurt dışına aktarım yapılmamaktadır.

4. KİŞİSEL VERİLERİN SAKLANMA SÜRESİ
Verileriniz, hizmet ilişkisi süresince ve akabinde yasal yükümlülükler kapsamında belirlenen süreler boyunca saklanmaktadır.

5. VERİ SAHİBİNİN HAKLARI
KVKK'nın 11. maddesi uyarınca; verilerinize erişim, düzeltme, silme, işlemenin kısıtlanması, itiraz etme ve taşınabilirlik haklarına sahipsiniz. Başvurularınızı kvkk@kiram.com adresine iletebilirsiniz.`,
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
