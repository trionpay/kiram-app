import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { WEB_SESSION_COOKIE } from '@/lib/auth/constants';
import { validateSession, resolveDemoOtp } from '@/lib/auth/otp-store';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(WEB_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: { message: 'Oturum bulunamadı.' } }, { status: 401 });
  }

  const session = validateSession(token);
  if (!session) {
    return NextResponse.json({ error: { message: 'Oturum geçersiz.' } }, { status: 401 });
  }

  let body: { firstName?: string; lastName?: string; city?: string; tckn?: string; birthDate?: string; purposes?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: 'Geçersiz istek.' } }, { status: 400 });
  }

  const firstName = (body.firstName ?? '').trim();
  const lastName = (body.lastName ?? '').trim();
  if (!firstName || !lastName) {
    return NextResponse.json({ error: { message: 'Ad ve soyad zorunludur.' } }, { status: 400 });
  }

  const phone = session.phone;
  const rawPhone = phone.replace('+90', '');
  const demo = resolveDemoOtp(rawPhone);

  const supabase = getSupabase();
  if (supabase && !demo) {
    const fullName = `${firstName} ${lastName}`;
    const { error } = await supabase
      .from('users')
      .upsert(
        { phone, full_name: fullName, role: 'user', is_active: true },
        { onConflict: 'phone' }
      );

    if (error) {
      console.error('[onboarding] user upsert failed:', error.message);
      return NextResponse.json({ error: { message: 'Hesap oluşturulamadı.' } }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, nextStep: 'dashboard' }, { status: 200 });
}
