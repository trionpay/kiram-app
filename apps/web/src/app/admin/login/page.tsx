import { Suspense } from 'react';
import { AdminLoginForm } from './AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#061018] text-white/50">
          Yükleniyor…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
