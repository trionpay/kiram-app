import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

function calcFee(amount: number) {
  return Number((amount * 0.015).toFixed(2));
}

export async function POST(req: NextRequest) {
  let body: { paymentType?: string; amountTry?: number; recipientIban?: string; cardToken?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: 'Geçersiz istek.' } }, { status: 400 });
  }

  const amount = body.amountTry ?? 0;
  if (amount <= 0) {
    return NextResponse.json({ error: { message: 'Tutar geçersiz.' } }, { status: 400 });
  }

  const fee = calcFee(amount);
  const result = {
    transactionId: `TRX-${Date.now()}-${randomUUID().slice(0, 4)}`,
    paymentType: body.paymentType ?? 'rent',
    amountTry: amount,
    feeTry: fee,
    totalTry: Number((amount + fee).toFixed(2)),
    status: 'success',
  };

  return NextResponse.json(result, { status: 201 });
}
