import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp-store';

export async function POST(req: NextRequest) {
  let body: { phone?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: 'Geçersiz istek.' } }, { status: 400 });
  }

  const phone = (body.phone ?? '').trim();
  const code = (body.code ?? '').trim();

  if (!/^5\d{9}$/.test(phone)) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Telefon formatı geçersiz.' } },
      { status: 400 }
    );
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Kod 6 haneli olmalıdır.' } },
      { status: 400 }
    );
  }

  const result = await verifyOtp(phone, code);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result, { status: 200 });
}
