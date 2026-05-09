'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

type Step = 1 | 2 | 3 | 4;

const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya',
  'Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik',
  'Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli',
  'Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep',
  'Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir',
  'Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale',
  'Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa',
  'Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize',
  'Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ',
  'Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak',
];

const PURPOSE_OPTIONS = [
  { id: 'rent', icon: '🏠', title: 'Kira Ödemesi', subtitle: 'Ev sahibime düzenli kira ödemek istiyorum' },
  { id: 'dues', icon: '🏢', title: 'Aidat Ödemesi', subtitle: 'Apartman veya site yönetimine aidat ödemek istiyorum' },
  { id: 'all', icon: '✨', title: 'Hepsi', subtitle: 'Tüm ev giderlerimi tek yerden yönetmek istiyorum' },
];

const PURPOSE_LABELS: Record<string, string> = {
  rent: '🏠 Kira Ödemesi',
  dues: '🏢 Aidat Ödemesi',
  all: '✨ Hepsi',
};

function validateTCKN(tckn: string) {
  if (tckn.length !== 11) return false;
  if (tckn[0] === '0') return false;
  const digits = tckn.split('').map(Number);
  const sum10 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7
    - (digits[1] + digits[3] + digits[5] + digits[7]);
  if ((sum10 % 10) !== digits[9]) return false;
  const sum11 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  return (sum11 % 10) === digits[10];
}

function formatBirthDate(text: string) {
  const digits = text.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function ProgressBar({ current }: { current: Step }) {
  return (
    <div className="space-y-2 mb-8">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full ${i <= current ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </div>
      <p className="text-text-tertiary text-xs">Adım {current} / 4</p>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [cityOpen, setCityOpen] = useState(false);

  const [tckn, setTckn] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [purposes, setPurposes] = useState<string[]>([]);

  const [agreed, setAgreed] = useState(false);

  const tcknValid = validateTCKN(tckn);
  const birthValid = birthDate.length === 10;

  const togglePurpose = (id: string) => {
    if (id === 'all') {
      setPurposes(purposes.includes('all') ? [] : ['all']);
      return;
    }
    const withoutAll = purposes.filter(s => s !== 'all');
    if (withoutAll.includes(id)) {
      setPurposes(withoutAll.filter(s => s !== id));
    } else {
      setPurposes([...withoutAll, id]);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const maskedTckn = tckn.length === 11
    ? tckn.slice(0, 3) + '*'.repeat(5) + tckn.slice(8)
    : tckn;

  if (step === 1) {
    const valid = firstName.trim().length > 1 && lastName.trim().length > 1 && city.length > 0;
    return (
      <div className="space-y-6">
        <ProgressBar current={1} />

        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Sizi tanıyalım</h2>
          <p className="text-text-secondary text-sm">
            Kimlik bilgileriniz güvenli şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary text-xs font-semibold mb-1.5">Ad</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Adınız"
              className="w-full bg-elevated border border-border rounded-2xl px-4 h-12 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-text-secondary text-xs font-semibold mb-1.5">Soyad</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Soyadınız"
              className="w-full bg-elevated border border-border rounded-2xl px-4 h-12 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="relative">
            <label className="block text-text-secondary text-xs font-semibold mb-1.5">Şehir</label>
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className={`w-full flex items-center justify-between bg-elevated border rounded-2xl px-4 h-12 text-left transition-colors ${city ? 'border-accent' : 'border-border'}`}
            >
              <span className={city ? 'text-text-primary' : 'text-text-tertiary'}>
                {city || 'Yaşadığınız şehri seçin'}
              </span>
              <span className="text-text-tertiary text-xs">▼</span>
            </button>
            {cityOpen && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-elevated border border-border rounded-2xl shadow-xl max-h-56 overflow-y-auto">
                {CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setCityOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface transition-colors ${city === c ? 'text-accent font-semibold' : 'text-text-primary'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={() => setStep(2)} disabled={!valid}>
          Devam
        </Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <ProgressBar current={2} />

        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Kimlik bilgileri</h2>
          <p className="text-text-secondary text-sm">
            Bu bilgiler hesabınızı doğrulamak için kullanılır ve değiştirilemez.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary text-xs font-semibold mb-1.5">T.C. Kimlik Numarası</label>
            <input
              type="password"
              inputMode="numeric"
              value={tckn}
              onChange={e => setTckn(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="T.C. Kimlik No"
              maxLength={11}
              className={`w-full bg-elevated border rounded-2xl px-4 h-12 text-text-primary placeholder:text-text-tertiary outline-none tracking-widest transition-colors ${
                tckn.length === 11
                  ? tcknValid ? 'border-success' : 'border-error'
                  : 'border-border focus:border-accent'
              }`}
              autoFocus
            />
            {tckn.length === 11 && !tcknValid && (
              <p className="text-error text-xs mt-1">Geçersiz T.C. Kimlik Numarası</p>
            )}
            {tcknValid && (
              <p className="text-success text-xs mt-1">Kimlik numarası doğrulandı</p>
            )}
          </div>
          <div>
            <label className="block text-text-secondary text-xs font-semibold mb-1.5">Doğum Tarihi</label>
            <input
              type="text"
              inputMode="numeric"
              value={birthDate}
              onChange={e => setBirthDate(formatBirthDate(e.target.value))}
              placeholder="GG/AA/YYYY"
              maxLength={10}
              className={`w-full bg-elevated border rounded-2xl px-4 h-12 text-text-primary placeholder:text-text-tertiary outline-none transition-colors ${
                birthValid ? 'border-success' : 'border-border focus:border-accent'
              }`}
            />
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4">
          <p className="text-text-secondary text-xs leading-relaxed">
            Kimlik bilgileriniz 256-bit şifreleme ile korunmaktadır. KVKK kapsamında işlenmektedir.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
            Geri
          </Button>
          <Button className="flex-1" onClick={() => setStep(3)} disabled={!tcknValid || !birthValid}>
            Devam
          </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        <ProgressBar current={3} />

        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Kiram&apos;ı ne için kullanacaksınız?</h2>
          <p className="text-text-secondary text-sm">
            Bu bilgi deneyiminizi kişiselleştirmek için kullanılır.
          </p>
        </div>

        <div className="space-y-3">
          {PURPOSE_OPTIONS.map(opt => {
            const active = purposes.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => togglePurpose(opt.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  active
                    ? 'border-accent bg-blue-50'
                    : 'border-border bg-elevated hover:border-border'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${active ? 'bg-blue-100' : 'bg-surface'}`}>
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${active ? 'text-accent' : 'text-text-primary'}`}>{opt.title}</p>
                  <p className="text-text-secondary text-xs">{opt.subtitle}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'bg-accent border-accent' : 'border-border'}`}>
                  {active && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>
            Geri
          </Button>
          <Button className="flex-1" onClick={() => setStep(4)} disabled={purposes.length === 0}>
            Devam
          </Button>
        </div>
      </div>
    );
  }

  const summaryRows = [
    { label: 'Ad Soyad', value: `${firstName} ${lastName}` },
    { label: 'Şehir', value: city },
    { label: 'T.C. Kimlik No', value: maskedTckn },
    { label: 'Doğum Tarihi', value: birthDate },
    { label: 'Kullanım Amacı', value: purposes.map(p => PURPOSE_LABELS[p] ?? p).join(', ') },
  ];

  return (
    <div className="space-y-6">
      <ProgressBar current={4} />

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Bilgilerinizi onaylayın</h2>
        <p className="text-text-secondary text-sm">
          Onayladıktan sonra T.C. Kimlik Numarası ve Ad Soyad bilgileri değiştirilemez.
        </p>
      </div>

      <div className="bg-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border">
        {summaryRows.map(row => (
          <div key={row.label} className="px-5 py-3.5">
            <p className="text-text-tertiary text-xs mb-0.5">{row.label}</p>
            <p className="text-text-primary font-semibold text-sm">{row.value}</p>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <button
          onClick={() => setAgreed(!agreed)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-accent border-accent' : 'border-border'}`}
        >
          {agreed && <span className="text-white text-[10px] font-bold">✓</span>}
        </button>
        <span className="text-text-secondary text-xs leading-relaxed">
          <span className="text-accent font-semibold cursor-pointer">Kullanıcı Sözleşmesi</span>,{' '}
          <span className="text-accent font-semibold cursor-pointer">KVKK Aydınlatma Metni</span> ve{' '}
          <span className="text-accent font-semibold cursor-pointer">Gizlilik Politikası</span>&apos;nı okudum, kabul ediyorum.
        </span>
      </label>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => setStep(3)}>
          Geri
        </Button>
        <Button className="flex-1" onClick={handleConfirm} disabled={!agreed} loading={loading}>
          Hesabımı Onayla
        </Button>
      </div>
    </div>
  );
}
