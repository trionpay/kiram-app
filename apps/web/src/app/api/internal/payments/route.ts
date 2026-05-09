import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

function calcFee(amount: number) {
  return Number((amount * 0.015).toFixed(2));
}

export async function POST(req: NextRequest) {
  let body: { paymentType?: string; amountTry?: number; recipientIban?: string; cardToken?: string; description?: string; userId?: string };
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
  const total = Number((amount + fee).toFixed(2));
  const transactionId = `TRX-${Date.now()}-${randomUUID().slice(0, 4)}`;
  const paymentType = body.paymentType ?? 'rent';

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('transactions').insert({
        id: transactionId,
        user_id: body.userId ?? '22222222-2222-2222-2222-222222222222',
        payment_type: paymentType,
        amount_try: amount,
        fee_try: fee,
        total_try: total,
        status: 'success',
        description: body.description ?? null,
        provider_ref: body.cardToken ?? 'demo',
      });

      if (error) {
        console.error('[payments] insert failed:', error.message);
      }
    } catch (e) {
      console.error('[payments] supabase error:', e);
    }
  }

  return NextResponse.json({
    transactionId,
    paymentType,
    amountTry: amount,
    feeTry: fee,
    totalTry: total,
    status: 'success',
  }, { status: 201 });
}
