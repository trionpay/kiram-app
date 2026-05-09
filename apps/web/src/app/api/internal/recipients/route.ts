import { NextRequest, NextResponse } from 'next/server';

const mockRecipients = [
  { id: 'r1', nickname: 'Ev Sahibi', accountHolder: 'Ahmet Yılmaz', iban: 'TR170001200945200058000001', paymentType: 'rent' },
  { id: 'r2', nickname: 'Site Yönetimi', accountHolder: 'Site Yönetimi A Blok', iban: 'TR330006100519786457841326', paymentType: 'dues' },
  { id: 'r3', nickname: 'Apartman Aidatı', accountHolder: 'Apartman Yönetimi', iban: 'TR980001001745380073509972', paymentType: 'dues' },
];

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search');

  let items = [...mockRecipients];
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(r =>
      r.nickname.toLowerCase().includes(q) ||
      r.accountHolder.toLowerCase().includes(q) ||
      r.iban.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ items }, { status: 200 });
}
