import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp-store';
import { WEB_SESSION_COOKIE } from '@/lib/auth/constants';

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

  const result = verifyOtp(phone, code);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const res = NextResponse.json(result, { status: 200 });
  res.cookies.set({
    name: WEB_SESSION_COOKIE,
    value: result.sessionToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: result.expiresInSeconds,
  });
  return res;
}
