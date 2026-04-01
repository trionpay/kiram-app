import type { BroadcastAudience } from '@/lib/admin/broadcastAudienceEstimate';

/** Gönderilen / planlanan duyuru kaydı — audit log (üretimde DB + immutable) */
export interface BroadcastHistoryRow {
  id: string;
  createdAt: string;
  audience: BroadcastAudience;
  recipientCount: number;
  title: string;
  bodyPreview: string;
  /** demo: simülasyon; push: gerçek FCM/APNs (gelecek) */
  channel: 'demo' | 'push';
  sentByEmail?: string;
}

const STORAGE_KEY = 'kiram_admin_broadcast_history_v1';
const MAX_ROWS = 80;

export function loadBroadcastHistoryFromStorage(): BroadcastHistoryRow[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.slice(0, MAX_ROWS) as BroadcastHistoryRow[];
  } catch {
    return null;
  }
}

export function saveBroadcastHistoryToStorage(rows: BroadcastHistoryRow[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_ROWS)));
  } catch {
    /* kota / gizli mod */
  }
}

export const initialBroadcastHistory: BroadcastHistoryRow[] = [
  {
    id: 'b-20250320-001',
    createdAt: '2025-03-20T09:15:00',
    audience: 'test_users',
    recipientCount: 5,
    title: 'Yeni sürüm denemesi',
    bodyPreview: 'Uygulama güncellemesi sonrası lütfen giriş yapıp bildirimi kontrol edin.',
    channel: 'demo',
    sentByEmail: 'admin@kiram.com',
  },
  {
    id: 'b-20250318-002',
    createdAt: '2025-03-18T14:00:00',
    audience: 'active_only',
    recipientCount: 1_842,
    title: 'Planlı bakım',
    bodyPreview: 'Bu gece 02:00–04:00 arası kısa kesinti olabilir. Anlayışınız için teşekkürler.',
    channel: 'demo',
    sentByEmail: 'admin@kiram.com',
  },
];
