import { getSupabaseAdminClient } from "../lib/supabase.js";
import { PaymentType } from "../types.js";

export type RecipientItem = {
  id: string;
  nickname: string;
  accountHolder: string;
  iban: string;
  paymentType: PaymentType;
};

const mockRecipients: RecipientItem[] = [
  {
    id: "r1",
    nickname: "Ev Sahibi",
    accountHolder: "Ahmet Yılmaz",
    iban: "TR170001200945200058000001",
    paymentType: "rent"
  },
  {
    id: "r2",
    nickname: "Site Yönetimi",
    accountHolder: "Site Yönetimi A Blok",
    iban: "TR330006100519786457841326",
    paymentType: "dues"
  },
  {
    id: "r3",
    nickname: "Apartman Aidatı",
    accountHolder: "Apartman Yönetimi",
    iban: "TR980001001745380073509972",
    paymentType: "dues"
  }
];

function filterMock(search?: string) {
  if (!search) return mockRecipients;
  const q = search.toLowerCase();
  return mockRecipients.filter(
    (item) =>
      item.nickname.toLowerCase().includes(q) ||
      item.accountHolder.toLowerCase().includes(q) ||
      item.iban.toLowerCase().includes(q)
  );
}

export async function listRecipientsByUser(userId: string, search?: string): Promise<RecipientItem[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return filterMock(search);
  }

  let query = supabase
    .from("recipients")
    .select("id,nickname,account_holder,iban,payment_type")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`nickname.ilike.%${search}%,account_holder.ilike.%${search}%,iban.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to list recipients: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    nickname: row.nickname as string,
    accountHolder: row.account_holder as string,
    iban: row.iban as string,
    paymentType: row.payment_type as PaymentType
  }));
}
