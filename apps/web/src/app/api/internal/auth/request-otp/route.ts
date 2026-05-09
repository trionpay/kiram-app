import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '../../_lib/backend';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const response = await fetch(`${getBackendBaseUrl()}/api/v1/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
  });

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: { message: 'OTP yanıtı okunamadı.' } };
    }
  }

  return NextResponse.json(payload, { status: response.status });
}
