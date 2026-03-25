import { cookies } from 'next/headers';
import { AdminShell } from '@/components/admin/AdminShell';
import { ADMIN_EMAIL_COOKIE } from '@/lib/admin/constants';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_EMAIL_COOKIE)?.value;
  let operatorEmail: string | null = null;
  if (raw) {
    try {
      operatorEmail = decodeURIComponent(raw);
    } catch {
      operatorEmail = null;
    }
  }

  return <AdminShell operatorEmail={operatorEmail}>{children}</AdminShell>;
}
