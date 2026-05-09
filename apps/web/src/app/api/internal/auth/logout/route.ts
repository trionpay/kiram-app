import { NextResponse } from 'next/server';
import { WEB_SESSION_COOKIE } from '@/lib/auth/constants';

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set({
    name: WEB_SESSION_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return res;
}
