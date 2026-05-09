import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/otp-store';
import { WEB_SESSION_COOKIE } from '@/lib/auth/constants';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(WEB_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: { message: 'Oturum bulunamadı.' } }, { status: 401 });
  }

  const user = validateSession(token);
  if (!user) {
    const res = NextResponse.json(
      { error: { code: 'SESSION_INVALID', message: 'Oturum geçersiz veya süresi dolmuş.' } },
      { status: 401 }
    );
    res.cookies.set({ name: WEB_SESSION_COOKIE, value: '', path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.json({ ok: true, user }, { status: 200 });
}
