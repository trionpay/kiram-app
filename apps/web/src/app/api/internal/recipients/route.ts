import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const mockRecipients = [
  { id: 'r1', nickname: 'Ev Sahibi', accountHolder: 'Ahmet Yılmaz', iban: 'TR170001200945200058000001', paymentType: 'rent' },
  { id: 'r2', nickname: 'Site Yönetimi', accountHolder: 'Site Yönetimi A Blok', iban: 'TR330006100519786457841326', paymentType: 'dues' },
  { id: 'r3', nickname: 'Apartman Aidatı', accountHolder: 'Apartman Yönetimi', iban: 'TR980001001745380073509972', paymentType: 'dues' },
];

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search');

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('recipients')
        .select('id, nickname, account_holder, iban, payment_type')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`nickname.ilike.%${search}%,account_holder.ilike.%${search}%,iban.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        const items = data.map((row) => ({
          id: row.id as string,
          nickname: row.nickname as string,
          accountHolder: row.account_holder as string,
          iban: row.iban as string,
          paymentType: row.payment_type as string,
        }));
        return NextResponse.json({ items }, { status: 200 });
      }
    } catch (e) {
      console.error('[recipients] supabase query failed:', e);
    }
  }

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
