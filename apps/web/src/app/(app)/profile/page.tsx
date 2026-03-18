'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Modal = 'email' | 'password' | 'password-otp' | 'legal' | null;
type LegalKey = 'privacy' | 'terms' | 'kvkk';

const LEGAL_DOCS: Record<LegalKey, { title: string; content: string }> = {
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
};

export default function ProfilePage() {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [legalKey, setLegalKey] = useState<LegalKey>('privacy');

  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewEmail('');
    setCurrentPassword('');
    setNewPassword('');
    setOtpDigits(['', '', '', '', '', '']);
  };

  const handleSendPasswordOtp = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setActiveModal('password-otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value.slice(-1);
    setOtpDigits(next);
    if (value && index < 5) {
      document.getElementById(`otp-profile-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-profile-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    closeModal();
    showToast('Şifreniz başarıyla güncellendi.');
  };

  const handleEmailSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    closeModal();
    showToast('Doğrulama bağlantısı gönderildi.');
  };

  const openLegal = (key: LegalKey) => {
    setLegalKey(key);
    setActiveModal('legal');
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profil</h1>
        <p className="text-text-secondary text-sm mt-1">Hesap bilgileriniz ve ayarlar</p>
      </div>

      {toast && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <p className="text-green-800 text-sm font-medium">{toast}</p>
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-5 bg-elevated rounded-3xl p-6 border border-border">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">AY</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Ahmet Yılmaz</h2>
          <p className="text-text-secondary text-sm">+90 555 123 4567</p>
          <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-success border border-green-100">
            Doğrulandı
          </span>
        </div>
      </div>

      {/* Hesap Bilgileri */}
      <section className="space-y-2">
        <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary px-1">Hesap Bilgileri</p>
        <div className="bg-elevated rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {[
            { label: 'Ad Soyad', value: 'Ahmet Yılmaz', action: false },
            { label: 'Telefon', value: '+90 555 123 4567', action: false },
            { label: 'E-posta', value: 'ahmet@email.com', action: true, onClick: () => setActiveModal('email') },
          ].map(row => (
            <div key={row.label} className="flex items-center px-5 py-4">
              <div className="flex-1">
                <p className="text-text-tertiary text-xs mb-0.5">{row.label}</p>
                <p className="font-semibold text-text-primary text-sm">{row.value}</p>
              </div>
              {row.action && (
                <button onClick={row.onClick} className="text-accent text-sm font-semibold hover:underline">
                  Değiştir
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Güvenlik */}
      <section className="space-y-2">
        <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary px-1">Güvenlik</p>
        <div className="bg-elevated rounded-2xl border border-border divide-y divide-border overflow-hidden">
          <div className="flex items-center px-5 py-4">
            <div className="flex-1">
              <p className="text-text-tertiary text-xs mb-0.5">Şifre</p>
              <p className="font-semibold text-text-primary text-sm">••••••••</p>
            </div>
            <button onClick={() => setActiveModal('password')} className="text-accent text-sm font-semibold hover:underline">
              Değiştir
            </button>
          </div>
          <div className="flex items-center px-5 py-4">
            <div className="flex-1">
              <p className="text-text-tertiary text-xs mb-0.5">İki Faktörlü Doğrulama</p>
              <p className="font-semibold text-text-primary text-sm">SMS ile aktif</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-success border border-green-100">Aktif</span>
          </div>
        </div>
      </section>

      {/* Yasal */}
      <section className="space-y-2">
        <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary px-1">Yasal</p>
        <div className="bg-elevated rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {([
            { label: 'Gizlilik Politikası', key: 'privacy' },
            { label: 'Kullanım Koşulları', key: 'terms' },
            { label: 'KVKK Aydınlatma Metni', key: 'kvkk' },
          ] as const).map(item => (
            <button
              key={item.key}
              onClick={() => openLegal(item.key)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors text-left"
            >
              <span className="text-text-primary text-sm font-medium">{item.label}</span>
              <span className="text-text-tertiary">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* Çıkış */}
      <Button
        variant="outline"
        className="w-full !border-error !text-error hover:!bg-error hover:!border-error hover:!text-white"
        onClick={() => (window.location.href = '/login')}
      >
        Çıkış Yap
      </Button>

      {/* ─── MODAL: E-posta Değiştir ─── */}
      {activeModal === 'email' && (
        <ModalWrapper title="E-posta Değiştir" onClose={closeModal}>
          <p className="text-text-secondary text-sm">Yeni e-posta adresinize doğrulama bağlantısı gönderilecektir.</p>
          <Input
            label="Yeni e-posta"
            type="email"
            placeholder="yeni@email.com"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
          <Button className="w-full" onClick={handleEmailSave} loading={saving} disabled={!newEmail}>
            Doğrulama Gönder
          </Button>
        </ModalWrapper>
      )}

      {/* ─── MODAL: Şifre Değiştir (adım 1) ─── */}
      {activeModal === 'password' && (
        <ModalWrapper title="Şifre Değiştir" onClose={closeModal}>
          <p className="text-text-secondary text-sm">
            Yeni şifrenizi girin. Kaydetmeden önce telefonunuza SMS kodu gönderilecektir.
          </p>
          <Input
            label="Mevcut şifre"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <Input
            label="Yeni şifre"
            type="password"
            placeholder="••••••••"
            hint="En az 8 karakter"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleSendPasswordOtp}
            loading={saving}
            disabled={!currentPassword || newPassword.length < 8}
          >
            SMS Kodu Gönder
          </Button>
        </ModalWrapper>
      )}

      {/* ─── MODAL: Şifre OTP (adım 2) ─── */}
      {activeModal === 'password-otp' && (
        <ModalWrapper title="Doğrulama Kodu" onClose={closeModal}>
          <p className="text-text-secondary text-sm">
            <span className="font-semibold text-text-primary">+90 555 123 4567</span> numarasına gönderilen kodu girin.
          </p>
          <div className="flex gap-2 justify-center py-2">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                id={`otp-profile-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className={`w-11 h-13 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-colors bg-surface text-text-primary ${digit ? 'border-accent' : 'border-border focus:border-accent'}`}
              />
            ))}
          </div>
          <Button
            className="w-full"
            onClick={handleVerifyOtp}
            loading={saving}
            disabled={otpDigits.some(d => !d)}
          >
            Şifreyi Güncelle
          </Button>
          <button className="w-full text-center text-accent text-sm font-semibold hover:underline py-1">
            Kodu tekrar gönder
          </button>
        </ModalWrapper>
      )}

      {/* ─── MODAL: Yasal Belge ─── */}
      {activeModal === 'legal' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-elevated rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
              <h3 className="font-bold text-text-primary">{LEGAL_DOCS[legalKey].title}</h3>
              <button onClick={closeModal} className="text-text-tertiary hover:text-text-primary w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface text-xl">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {LEGAL_DOCS[legalKey].content}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-border flex-shrink-0">
              <Button className="w-full" onClick={closeModal}>Kapat</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalWrapper({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-elevated rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-text-primary text-lg">{title}</h3>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary text-xl w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
