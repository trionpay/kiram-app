import { getSupabaseAdminClient } from "../lib/supabase.js";
import { PaymentType } from "../types.js";

export type PaymentQuoteInput = {
  paymentType: PaymentType;
  amountTry: number;
  recipientIban: string;
};

export type CreatePaymentInput = PaymentQuoteInput & {
  userId: string;
  cardToken: string;
  description?: string;
};

export type PaymentQuote = {
  paymentType: PaymentType;
  amountTry: number;
  feeTry: number;
  totalTry: number;
};

export type CreatedPayment = PaymentQuote & {
  transactionId: string;
  status: "success";
};

export type PaymentTransactionStatus = "success" | "pending" | "failed";

export type PaymentTransactionItem = {
  id: string;
  paymentType: PaymentType;
  status: PaymentTransactionStatus;
  amountTry: number;
  feeTry: number;
  totalTry: number;
  description?: string;
  createdAt: string;
};

const mockTransactions: PaymentTransactionItem[] = [
  {
    id: "TRX-2501-0015",
    paymentType: "dues",
    status: "success",
    amountTry: 850,
    feeTry: 12.75,
    totalTry: 862.75,
    description: "Apartman aidatı",
    createdAt: "2025-01-15T09:42:00.000Z"
  },
  {
    id: "TRX-2501-0001",
    paymentType: "rent",
    status: "success",
    amountTry: 12000,
    feeTry: 180,
    totalTry: 12180,
    description: "Ocak 2025 kirası",
    createdAt: "2025-01-01T09:00:00.000Z"
  },
  {
    id: "TRX-2502-0001",
    paymentType: "rent",
    status: "pending",
    amountTry: 12000,
    feeTry: 180,
    totalTry: 12180,
    description: "Şubat 2025 kirası",
    createdAt: "2025-02-01T10:00:00.000Z"
  }
];

function calcFee(amount: number) {
  return Number((amount * 0.015).toFixed(2));
}

export function quotePayment(input: PaymentQuoteInput): PaymentQuote {
  const feeTry = calcFee(input.amountTry);
  return {
    paymentType: input.paymentType,
    amountTry: input.amountTry,
    feeTry,
    totalTry: Number((input.amountTry + feeTry).toFixed(2))
  };
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatedPayment> {
  const quoted = quotePayment(input);
  const supabase = getSupabaseAdminClient();
  const transactionId = `TRX-${Date.now()}`;

  if (!supabase) {
    return {
      transactionId,
      status: "success",
      ...quoted
    };
  }

  const { error } = await supabase.from("transactions").insert({
    id: transactionId,
    user_id: input.userId,
    payment_type: input.paymentType,
    amount_try: input.amountTry,
    fee_try: quoted.feeTry,
    total_try: quoted.totalTry,
    status: "success",
    description: input.description ?? null,
    provider_ref: input.cardToken
  });

  if (error) {
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  return {
    transactionId,
    status: "success",
    ...quoted
  };
}

export async function listPaymentsByUser(
  userId: string,
  filters?: {
    status?: PaymentTransactionStatus;
    search?: string;
    limit?: number;
  }
): Promise<PaymentTransactionItem[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    const limit = filters?.limit ?? 50;
    let rows = [...mockTransactions];
    if (filters?.status) {
      rows = rows.filter((row) => row.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter(
        (row) => row.id.toLowerCase().includes(q) || (row.description ?? "").toLowerCase().includes(q)
      );
    }
    return rows.slice(0, limit);
  }

  let query = supabase
    .from("transactions")
    .select("id,payment_type,status,amount_try,fee_try,total_try,description,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(filters?.limit ?? 50);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(`id.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to list payments: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    paymentType: row.payment_type as PaymentType,
    status: row.status as PaymentTransactionStatus,
    amountTry: Number(row.amount_try),
    feeTry: Number(row.fee_try),
    totalTry: Number(row.total_try),
    description: (row.description as string | null) ?? undefined,
    createdAt: row.created_at as string
  }));
}
