import { Suspense } from 'react';
import { AdminLoginForm } from './AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-text-tertiary text-sm">
          Yükleniyor…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
