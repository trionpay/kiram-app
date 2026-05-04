import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { backendRequest } from '../_lib/backend';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const idempotencyKey = req.headers.get('Idempotency-Key') ?? randomUUID();

  const result = await backendRequest(
    '/api/v1/payments',
    {
      method: 'POST',
      body,
      headers: {
        'Idempotency-Key': idempotencyKey
      }
    },
    'user'
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.payload?.error ?? { message: 'Ödeme oluşturulamadı.' } },
      { status: result.status }
    );
  }

  return NextResponse.json(result.payload, { status: 201 });
}
