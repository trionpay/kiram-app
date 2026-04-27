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
