import { NextRequest, NextResponse } from 'next/server';
import { backendRequest } from '../_lib/backend';

export async function GET(req: NextRequest) {
  const searchParams = new URLSearchParams();
  const status = req.nextUrl.searchParams.get('status');
  const search = req.nextUrl.searchParams.get('search');
  const limit = req.nextUrl.searchParams.get('limit');

  if (status) searchParams.set('status', status);
  if (search) searchParams.set('search', search);
  if (limit) searchParams.set('limit', limit);

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const result = await backendRequest(`/api/v1/payments${suffix}`, {}, 'user');

  if (!result.ok) {
    return NextResponse.json(
      { error: result.payload?.error ?? { message: 'İşlem geçmişi alınamadı.' } },
      { status: result.status }
    );
  }

  return NextResponse.json(result.payload, { status: 200 });
}
