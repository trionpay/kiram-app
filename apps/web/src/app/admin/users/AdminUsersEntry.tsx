'use client';

import { useSearchParams } from 'next/navigation';
import { AdminUsersClient } from './AdminUsersClient';

export function AdminUsersEntry() {
  const sp = useSearchParams();
  const segment = sp.get('segment');
  return (
    <AdminUsersClient key={segment ?? ''} initialSegment={segment} />
  );
}
