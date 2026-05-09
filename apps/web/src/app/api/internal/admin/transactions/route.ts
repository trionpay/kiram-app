import { NextRequest, NextResponse } from 'next/server';

const mockAdminTransactions = [
  { id: 'TRX-2501-0015', userId: 'u1', userName: 'Baran Bedir', paymentType: 'dues', status: 'success', amountTry: 850, feeTry: 12.75, totalTry: 862.75, description: 'Apartman aidatı', createdAt: '2025-01-15T09:42:00.000Z' },
  { id: 'TRX-2501-0001', userId: 'u1', userName: 'Baran Bedir', paymentType: 'rent', status: 'success', amountTry: 12000, feeTry: 180, totalTry: 12180, description: 'Ocak 2025 kirası', createdAt: '2025-01-01T09:00:00.000Z' },
  { id: 'TRX-2502-0001', userId: 'u2', userName: 'Ahmet Yılmaz', paymentType: 'rent', status: 'pending', amountTry: 12000, feeTry: 180, totalTry: 12180, description: 'Şubat 2025 kirası', createdAt: '2025-02-01T10:00:00.000Z' },
];

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status');
  const search = req.nextUrl.searchParams.get('search');
  const limit = Number(req.nextUrl.searchParams.get('limit')) || 50;

  let items = [...mockAdminTransactions];

  if (status) items = items.filter(t => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(t => t.id.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q) || t.userName.toLowerCase().includes(q));
  }

  return NextResponse.json({ items: items.slice(0, limit) }, { status: 200 });
}
