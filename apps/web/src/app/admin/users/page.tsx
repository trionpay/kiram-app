import { Suspense } from 'react';
import { AdminUsersEntry } from './AdminUsersEntry';

function UsersFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-56 rounded-lg bg-border" />
        <div className="mt-2 h-4 max-w-lg rounded bg-border" />
      </div>
      <div className="h-24 rounded-2xl bg-border" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 w-20 rounded-xl bg-border" />
        ))}
      </div>
      <div className="h-72 rounded-2xl border border-border bg-surface" />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UsersFallback />}>
      <AdminUsersEntry />
    </Suspense>
  );
}
