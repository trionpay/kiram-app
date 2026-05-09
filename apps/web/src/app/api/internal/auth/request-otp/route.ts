import { NextRequest, NextResponse } from 'next/server';
import { requestOtp } from '@/lib/auth/otp-store';

export async function POST(req: NextRequest) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: 'Geçersiz istek.' } }, { status: 400 });
  }

  const phone = (body.phone ?? '').trim();
  if (!/^5\d{9}$/.test(phone)) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Telefon formatı geçersiz.' } },
      { status: 400 }
    );
  }

  const result = requestOtp(phone);
  return NextResponse.json(result, { status: 200 });
}
