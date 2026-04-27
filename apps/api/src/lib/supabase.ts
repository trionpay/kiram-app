import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config, isSupabaseConfigured } from "../config.js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient(config.SUPABASE_URL!, config.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return cachedClient;
}
