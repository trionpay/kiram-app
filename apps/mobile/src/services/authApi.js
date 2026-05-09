const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

function getApiBaseUrl() {
  const base = API_BASE_URL.trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL tanımlı değil.');
  }
  return base;
}

async function request(path, body) {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = {};
    }
  }
  if (!res.ok) {
    throw new Error(payload?.error?.message ?? 'İstek başarısız.');
  }
  return payload;
}

export function requestOtp(phone, intent = 'login') {
  return request('/api/v1/auth/otp/request', { phone, intent });
}

export function verifyOtp(phone, code, intent = 'login') {
  return request('/api/v1/auth/otp/verify', { phone, code, intent });
}
