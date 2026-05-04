import { NextRequest, NextResponse } from 'next/server';
import { backendRequest } from '../../_lib/backend';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const result = await backendRequest(
    '/api/v1/payments/quote',
    {
      method: 'POST',
      body
    },
    'user'
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.payload?.error ?? { message: 'Ödeme hesaplaması alınamadı.' } },
      { status: result.status }
    );
  }

  return NextResponse.json(result.payload, { status: 200 });
}
