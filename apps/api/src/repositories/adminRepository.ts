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
