import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const mockAdminTransactions = [
  { id: 'TRX-2501-0015', userId: 'u1', userName: 'Baran Bedir', paymentType: 'dues', status: 'success', amountTry: 850, feeTry: 12.75, totalTry: 862.75, description: 'Apartman aidatı', createdAt: '2025-01-15T09:42:00.000Z' },
  { id: 'TRX-2501-0001', userId: 'u1', userName: 'Baran Bedir', paymentType: 'rent', status: 'success', amountTry: 12000, feeTry: 180, totalTry: 12180, description: 'Ocak 2025 kirası', createdAt: '2025-01-01T09:00:00.000Z' },
  { id: 'TRX-2502-0001', userId: 'u2', userName: 'Ahmet Yılmaz', paymentType: 'rent', status: 'pending', amountTry: 12000, feeTry: 180, totalTry: 12180, description: 'Şubat 2025 kirası', createdAt: '2025-02-01T10:00:00.000Z' },
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
        .select('id, user_id, payment_type, status, amount_try, fee_try, total_try, description, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) query = query.eq('status', status);
      if (search) query = query.or(`id.ilike.%${search}%,description.ilike.%${search}%`);

      const { data, error } = await query;
      if (!error && data) {
        const userIds = [...new Set(data.map(r => r.user_id as string))];
        const userMap = new Map<string, string>();

        if (userIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', userIds);
          for (const u of users ?? []) {
            userMap.set(u.id as string, (u.full_name as string | null) ?? 'Kullanıcı');
          }
        }

        const items = data.map((row) => ({
          id: row.id as string,
          userId: row.user_id as string,
          userName: userMap.get(row.user_id as string) ?? 'Kullanıcı',
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
      console.error('[admin/transactions] supabase query failed:', e);
    }
  }

  let items = [...mockAdminTransactions];
  if (status) items = items.filter(t => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(t => t.id.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q) || t.userName.toLowerCase().includes(q));
  }

  return NextResponse.json({ items: items.slice(0, limit) }, { status: 200 });
}
