import { Suspense } from 'react';
import { AdminTransactionsClient } from './AdminTransactionsClient';

function TransactionsFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 rounded-lg bg-border" />
        <div className="mt-2 h-4 max-w-md rounded bg-border" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 w-24 rounded-xl bg-border" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-border bg-surface" />
    </div>
  );
}

export default function AdminTransactionsPage() {
  return (
    <Suspense fallback={<TransactionsFallback />}>
      <AdminTransactionsClient />
    </Suspense>
  );
}
