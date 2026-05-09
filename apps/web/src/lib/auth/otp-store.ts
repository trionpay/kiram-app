import { randomInt, randomUUID } from 'crypto';
import { getSupabase } from '@/lib/supabase';

type OtpRecord = {
  code: string;
  expiresAt: number;
  attemptsLeft: number;
};

type SessionRecord = {
  phone: string;
  userId: string;
  expiresAt: number;
};

type DemoKind = 'login' | 'signup';

const otpStore = new Map<string, OtpRecord>();
const sessionStore = new Map<string, SessionRecord>();

const OTP_ATTEMPT_LIMIT = 5;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;
const DEFAULT_USER_ID = process.env.INTERNAL_USER_ID ?? '22222222-2222-2222-2222-222222222222';

function otpTtlSeconds() {
  return Number(process.env.OTP_TTL_SECONDS) || 180;
}

function normalizePhone(phone: string) {
  return phone.trim().replace(/\D/g, '');
}

export function maskPhone(phone: string) {
  return `+90 ${phone.slice(0, 3)} *** ${phone.slice(-2)}`;
}

export function resolveDemoOtp(phone: string) {
  const sp = process.env.AUTH_TEST_SIGNUP_PHONE;
  const sc = process.env.AUTH_TEST_SIGNUP_CODE;
  if (sp && sc && phone === sp) return { kind: 'signup' as DemoKind, code: sc };

  const lp = process.env.AUTH_TEST_LOGIN_PHONE;
  const lc = process.env.AUTH_TEST_LOGIN_CODE;
  if (lp && lc && phone === lp) return { kind: 'login' as DemoKind, code: lc };

  const tp = process.env.AUTH_TEST_PHONE;
  const tc = process.env.AUTH_TEST_CODE;
  if (tp && tc && phone === tp) return { kind: 'login' as DemoKind, code: tc };

  return null;
}

async function findUserByPhone(phone: string): Promise<{ id: string; fullName: string | null } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('phone', `+90${phone}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[auth] user lookup failed:', error.message);
    return null;
  }

  if (!data) return null;
  return { id: data.id as string, fullName: (data.full_name as string | null) ?? null };
}

function cleanup() {
  const now = Date.now();
  for (const [k, v] of otpStore.entries()) {
    if (v.expiresAt <= now) otpStore.delete(k);
  }
  for (const [k, v] of sessionStore.entries()) {
    if (v.expiresAt <= now) sessionStore.delete(k);
  }
}

export function requestOtp(rawPhone: string) {
  cleanup();
  const phone = normalizePhone(rawPhone);
  const demo = resolveDemoOtp(phone);

  const code = demo?.code ?? String(randomInt(100000, 999999));
  const ttl = otpTtlSeconds();
  otpStore.set(phone, { code, expiresAt: Date.now() + ttl * 1000, attemptsLeft: OTP_ATTEMPT_LIMIT });

  if (!demo) {
    console.log(`[otp] code=${code} phone=+90${phone}`);
  }

  return {
    ok: true,
    channel: 'sms',
    maskedPhone: maskPhone(phone),
    expiresInSeconds: ttl,
    isTestPhone: Boolean(demo),
  };
}

type VerifyResult =
  | { ok: true; sessionToken: string; expiresInSeconds: number; user: { id: string; phone: string; isTestUser: boolean }; nextStep: 'dashboard' | 'onboarding' }
  | { ok: false; status: number; error: { code: string; message: string } };

export async function verifyOtp(rawPhone: string, code: string): Promise<VerifyResult> {
  cleanup();
  const phone = normalizePhone(rawPhone);
  const record = otpStore.get(phone);

  if (!record || record.expiresAt <= Date.now()) {
    otpStore.delete(phone);
    return { ok: false, status: 401, error: { code: 'OTP_EXPIRED', message: 'Kodun süresi dolmuş. Lütfen yeni kod isteyin.' } };
  }

  if (record.code !== code) {
    record.attemptsLeft -= 1;
    if (record.attemptsLeft <= 0) {
      otpStore.delete(phone);
    }
    return { ok: false, status: 401, error: { code: 'OTP_INVALID', message: 'Doğrulama kodu hatalı.' } };
  }

  otpStore.delete(phone);

  const demo = resolveDemoOtp(phone);
  const existingUser = await findUserByPhone(phone);

  const isDemoSignup = demo?.kind === 'signup';
  const isNewUser = !existingUser && !demo;
  const isSignupFlow = isDemoSignup || isNewUser;

  const userId = existingUser?.id ?? DEFAULT_USER_ID;

  const sessionToken = randomUUID();
  sessionStore.set(sessionToken, {
    phone,
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  return {
    ok: true,
    sessionToken,
    expiresInSeconds: Math.floor(SESSION_TTL_MS / 1000),
    user: { id: userId, phone: `+90${phone}`, isTestUser: Boolean(demo) },
    nextStep: isSignupFlow ? 'onboarding' : 'dashboard',
  };
}

export function validateSession(token: string) {
  cleanup();
  const session = sessionStore.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessionStore.delete(token);
    return null;
  }
  return { id: session.userId, phone: `+90${session.phone}` };
}
