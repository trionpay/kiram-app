import { NextRequest, NextResponse } from 'next/server';
import { backendRequest } from '../_lib/backend';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search');
  const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
  const result = await backendRequest(`/api/v1/recipients${suffix}`, {}, 'user');

  if (!result.ok) {
    return NextResponse.json(
      { error: result.payload?.error ?? { message: 'Alıcılar alınamadı.' } },
      { status: result.status }
    );
  }

  return NextResponse.json(result.payload, { status: 200 });
}
