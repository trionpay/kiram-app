import { getSupabaseAdminClient } from "../lib/supabase.js";

type StoredIdempotency = {
  statusCode: number;
  response: unknown;
};

const memoryStore = new Map<string, StoredIdempotency>();

function memoryKey(scope: string, key: string) {
  return `${scope}::${key}`;
}

export async function getIdempotentResult(scope: string, key: string): Promise<StoredIdempotency | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return memoryStore.get(memoryKey(scope, key)) ?? null;
  }

  const { data, error } = await supabase
    .from("idempotency_keys")
    .select("status_code,response")
    .eq("scope", scope)
    .eq("key", key)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read idempotency key: ${error.message}`);
  }
  if (!data) return null;

  return {
    statusCode: data.status_code as number,
    response: data.response
  };
}

export async function saveIdempotentResult(
  scope: string,
  key: string,
  statusCode: number,
  response: unknown
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    memoryStore.set(memoryKey(scope, key), { statusCode, response });
    return;
  }

  const { error } = await supabase.from("idempotency_keys").insert({
    scope,
    key,
    status_code: statusCode,
    response
  });

  // Ignore duplicate insert races; first write wins.
  if (error && !error.message.toLowerCase().includes("duplicate")) {
    throw new Error(`Failed to store idempotency key: ${error.message}`);
  }
}
