import { getSupabaseAdminClient } from "../lib/supabase.js";
import { PaymentType } from "../types.js";

export type AdminSummary = {
  totals: Record<PaymentType, number>;
  pendingCount: number;
  successRate: number;
};

export type BroadcastInput = {
  title: string;
  body: string;
  audience: "all" | "active" | "test";
  createdByUserId: string;
};

export type AdminTransactionListItem = {
  id: string;
  userId: string;
  userLabel: string;
  amountTry: number;
  feeTry: number;
  status: "success" | "pending" | "failed";
  createdAt: string;
  paymentKind: PaymentType;
  recipientDetail: string;
  note?: string;
};

const mockAdminTransactions: AdminTransactionListItem[] = [
  {
    id: "TRX-2501-0015",
    userId: "u-demo",
    userLabel: "Demo Kullanıcı",
    amountTry: 850,
    feeTry: 12.75,
    status: "success",
    createdAt: "2025-01-15T09:42:00.000Z",
    paymentKind: "dues",
    recipientDetail: "Aidat ödemesi",
    note: "Mock veri"
  },
  {
    id: "TRX-2501-0001",
    userId: "u-demo",
    userLabel: "Demo Kullanıcı",
    amountTry: 12000,
    feeTry: 180,
    status: "success",
    createdAt: "2025-01-01T09:00:00.000Z",
    paymentKind: "rent",
    recipientDetail: "Kira ödemesi",
    note: "Mock veri"
  }
];

export async function getAdminTransactionSummary(): Promise<AdminSummary> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      totals: { rent: 2, dues: 4 },
      pendingCount: 1,
      successRate: 99.2
    };
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("payment_type,status", { count: "exact" });

  if (error) {
    throw new Error(`Failed to fetch admin summary: ${error.message}`);
  }

  const rows = data ?? [];
  const totals: Record<PaymentType, number> = { rent: 0, dues: 0 };
  let success = 0;
  let pending = 0;

  for (const row of rows) {
    const paymentType = row.payment_type as PaymentType;
    if (paymentType === "rent" || paymentType === "dues") {
      totals[paymentType] += 1;
    }
    if (row.status === "success") success += 1;
    if (row.status === "pending") pending += 1;
  }

  const successRate = rows.length === 0 ? 0 : Number(((success / rows.length) * 100).toFixed(1));
  return {
    totals,
    pendingCount: pending,
    successRate
  };
}

export async function createBroadcast(input: BroadcastInput): Promise<{ id: string; status: "queued" }> {
  const supabase = getSupabaseAdminClient();
  const id = `br-${Date.now()}`;

  if (supabase) {
    const { error } = await supabase.from("broadcasts").insert({
      id,
      title: input.title,
      body: input.body,
      audience: input.audience,
      created_by: input.createdByUserId,
      status: "queued"
    });

    if (error) {
      throw new Error(`Failed to create broadcast: ${error.message}`);
    }
  }

  return { id, status: "queued" };
}

export async function listAdminTransactions(filters?: {
  status?: "success" | "pending" | "failed";
  search?: string;
  limit?: number;
}): Promise<AdminTransactionListItem[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    const limit = filters?.limit ?? 100;
    let rows = [...mockAdminTransactions];
    if (filters?.status) rows = rows.filter((r) => r.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter((r) =>
        [r.id, r.userLabel, r.recipientDetail, r.note].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return rows.slice(0, limit);
  }

  let query = supabase
    .from("transactions")
    .select("id,user_id,payment_type,amount_try,fee_try,status,created_at,description")
    .order("created_at", { ascending: false })
    .limit(filters?.limit ?? 100);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.search) {
    query = query.or(`id.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to list admin transactions: ${error.message}`);
  }

  const rows = data ?? [];
  const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))] as string[];
  const userNameMap = new Map<string, string>();

  if (userIds.length > 0) {
    const { data: usersData } = await supabase.from("users").select("id,full_name").in("id", userIds);
    for (const user of usersData ?? []) {
      userNameMap.set(user.id as string, (user.full_name as string | null) ?? "Kullanıcı");
    }
  }

  return rows.map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    userLabel: userNameMap.get(row.user_id as string) ?? `Kullanıcı ${String(row.user_id).slice(0, 6)}`,
    amountTry: Number(row.amount_try),
    feeTry: Number(row.fee_try),
    status: row.status as "success" | "pending" | "failed",
    createdAt: row.created_at as string,
    paymentKind: row.payment_type as PaymentType,
    recipientDetail: (row.description as string | null) ?? "Ödeme",
    note: undefined
  }));
}
