import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '../../_lib/backend';
import { WEB_SESSION_COOKIE } from '@/lib/auth/constants';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(WEB_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: { message: 'Oturum bulunamadı.' } }, { status: 401 });
  }

  const response = await fetch(`${getBackendBaseUrl()}/api/v1/auth/session`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: { message: 'Oturum yanıtı okunamadı.' } };
    }
  }

  const res = NextResponse.json(payload, { status: response.status });
  if (!response.ok) {
    res.cookies.set({
      name: WEB_SESSION_COOKIE,
      value: '',
      path: '/',
      maxAge: 0,
    });
  }
  return res;
}
