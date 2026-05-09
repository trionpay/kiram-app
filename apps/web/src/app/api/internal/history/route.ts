import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const mockTransactions = [
  { id: 'TRX-2501-0015', paymentType: 'dues', status: 'success', amountTry: 850, feeTry: 12.75, totalTry: 862.75, description: 'Apartman aidatı', createdAt: '2025-01-15T09:42:00.000Z' },
  { id: 'TRX-2501-0001', paymentType: 'rent', status: 'success', amountTry: 12000, feeTry: 180, totalTry: 12180, description: 'Ocak 2025 kirası', createdAt: '2025-01-01T09:00:00.000Z' },
  { id: 'TRX-2502-0001', paymentType: 'rent', status: 'pending', amountTry: 12000, feeTry: 180, totalTry: 12180, description: 'Şubat 2025 kirası', createdAt: '2025-02-01T10:00:00.000Z' },
  { id: 'TRX-2501-0012', paymentType: 'dues', status: 'success', amountTry: 620, feeTry: 9.30, totalTry: 629.30, description: 'Site aidatı', createdAt: '2025-01-12T14:18:00.000Z' },
  { id: 'TRX-2501-0008', paymentType: 'dues', status: 'success', amountTry: 740, feeTry: 11.10, totalTry: 751.10, description: 'Bina yönetimi', createdAt: '2025-01-08T11:05:00.000Z' },
  { id: 'TRX-2501-0007', paymentType: 'dues', status: 'success', amountTry: 930, feeTry: 13.95, totalTry: 943.95, description: 'Site yönetimi', createdAt: '2025-01-07T16:30:00.000Z' },
  { id: 'TRX-2412-0003', paymentType: 'dues', status: 'failed', amountTry: 790, feeTry: 11.85, totalTry: 801.85, description: 'C Blok aidat', createdAt: '2024-12-03T13:22:00.000Z' },
];

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status');
  const search = req.nextUrl.searchParams.get('search');
  const limit = Number(req.nextUrl.searchParams.get('limit')) || 50;

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('transactions')
        .select('id, payment_type, status, amount_try, fee_try, total_try, description, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) query = query.eq('status', status);
      if (search) query = query.or(`id.ilike.%${search}%,description.ilike.%${search}%`);

      const { data, error } = await query;
      if (!error && data) {
        const items = data.map((row) => ({
          id: row.id as string,
          paymentType: row.payment_type as string,
          status: row.status as string,
          amountTry: Number(row.amount_try),
          feeTry: Number(row.fee_try),
          totalTry: Number(row.total_try),
          description: (row.description as string | null) ?? undefined,
          createdAt: row.created_at as string,
        }));
        return NextResponse.json({ items }, { status: 200 });
      }
    } catch (e) {
      console.error('[history] supabase query failed:', e);
    }
  }

  let items = [...mockTransactions];
  if (status) items = items.filter(t => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(t => t.id.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q));
  }

  return NextResponse.json({ items: items.slice(0, limit) }, { status: 200 });
}
