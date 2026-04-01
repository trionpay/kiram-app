export interface AdminUserRow {
  id: string;
  phone: string;
  /** Ad soyad (arama ad / soyad kelimelerinde eşleşir) */
  name: string;
  /** 11 hane TCKN — admin arama ve doğrulama (mock) */
  tckn: string;
  suspended: boolean;
  /** Soft delete / arşiv — listeden operasyonel olarak çıkar */
  archived: boolean;
  registeredAt: string;
  /** Kimlik doğrulama (KYC) tamamlandı mı — Blueprint minimum KYC */
  kycApproved: boolean;
}

const SEED_USERS: AdminUserRow[] = [
  {
    id: 'u1',
    phone: '+90 532 111 2233',
    name: 'Ayşe Yılmaz',
    tckn: '28590123456',
    suspended: false,
    archived: false,
    registeredAt: '2025-03-10',
    kycApproved: true,
  },
  {
    id: 'u2',
    phone: '+90 533 444 5566',
    name: 'Mehmet Kaya',
    tckn: '47210895634',
    suspended: false,
    archived: false,
    registeredAt: '2025-03-18',
    kycApproved: false,
  },
  {
    id: 'u3',
    phone: '+90 534 777 8899',
    name: 'Zeynep Demir',
    tckn: '61827394501',
    suspended: true,
    archived: false,
    registeredAt: '2025-02-01',
    kycApproved: true,
  },
  {
    id: 'u4',
    phone: '+90 535 000 1122',
    name: 'Can Öztürk',
    tckn: '90123456782',
    suspended: false,
    archived: false,
    registeredAt: '2025-03-22',
    kycApproved: false,
  },
  {
    id: 'u5',
    phone: '+90 536 999 8877',
    name: 'Deniz Arslan',
    tckn: '15678901234',
    suspended: false,
    archived: true,
    registeredAt: '2024-11-05',
    kycApproved: true,
  },
];

const FN = [
  'Elif',
  'Burak',
  'Selin',
  'Emre',
  'Ceren',
  'Oğuz',
  'Defne',
  'Kaan',
  'Melis',
  'Tolga',
  'Pınar',
  'Onur',
  'Sude',
  'Barış',
  'İrem',
] as const;
const LN = [
  'Şahin',
  'Çelik',
  'Aydın',
  'Özdemir',
  'Koç',
  'Polat',
  'Yıldız',
  'Kılıç',
  'Aslan',
  'Doğan',
  'Erdoğan',
  'Kurt',
] as const;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

/** Sayfalama / filtre demosu için çok kayıt (üretimde API sayfalı döner). */
function generatedUsers(count: number): AdminUserRow[] {
  const out: AdminUserRow[] = [];
  for (let i = 0; i < count; i++) {
    const n = 6 + i;
    const d = 1 + (n % 28);
    const m = 1 + (n % 12);
    const y = n % 3 === 0 ? 2025 : 2024;
    const tcknRaw = (100_000_000_00 + (n * 9_876_543) % 899_999_999_99).toString().slice(0, 11);
    const tckn = tcknRaw.length < 11 ? tcknRaw.padStart(11, '1') : tcknRaw;
    out.push({
      id: `u${n}`,
      phone: `+90 5${30 + (n % 10)} ${pad2(n % 99)} ${1000 + (n % 9000)}`,
      name: `${FN[n % FN.length]} ${LN[(n * 2) % LN.length]}`,
      tckn,
      suspended: n % 9 === 0,
      archived: n % 13 === 0,
      registeredAt: `${y}-${pad2(m)}-${pad2(d)}`,
      kycApproved: n % 4 !== 0,
    });
  }
  return out;
}

export const initialMockUsers: AdminUserRow[] = [...SEED_USERS, ...generatedUsers(47)];
