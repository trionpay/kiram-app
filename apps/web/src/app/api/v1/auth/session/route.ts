import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/otp-store';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Oturum doğrulaması gerekli.' } },
      { status: 401 }
    );
  }

  const token = auth.slice('Bearer '.length).trim();
  const user = validateSession(token);
  if (!user) {
    return NextResponse.json(
      { error: { code: 'SESSION_INVALID', message: 'Oturum geçersiz veya süresi dolmuş.' } },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true, user }, { status: 200 });
}
