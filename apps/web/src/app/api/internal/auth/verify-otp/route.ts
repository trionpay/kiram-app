import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '../../_lib/backend';
import { WEB_SESSION_COOKIE } from '@/lib/auth/constants';

type VerifyPayload = {
  sessionToken?: string;
  expiresInSeconds?: number;
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const response = await fetch(`${getBackendBaseUrl()}/api/v1/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
  });

  const text = await response.text();
  let payload: VerifyPayload = {};
  if (text) {
    try {
      payload = JSON.parse(text) as VerifyPayload;
    } catch {
      payload = { error: { message: 'Doğrulama yanıtı okunamadı.' } };
    }
  }

  const res = NextResponse.json(payload, { status: response.status });
  if (response.ok && payload.sessionToken) {
    const maxAge = Math.max(60, payload.expiresInSeconds ?? 60 * 60 * 24);
    res.cookies.set({
      name: WEB_SESSION_COOKIE,
      value: payload.sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    });
  }
  return res;
}
