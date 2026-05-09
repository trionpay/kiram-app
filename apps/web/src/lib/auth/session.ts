import { cookies } from 'next/headers';
import { validateSession } from './otp-store';
import { WEB_SESSION_COOKIE } from './constants';

export async function validateUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(WEB_SESSION_COOKIE)?.value;
  if (!sessionToken) return null;
  return validateSession(sessionToken);
}
