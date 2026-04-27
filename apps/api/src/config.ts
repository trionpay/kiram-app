import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  CORS_ORIGIN: z.string().default("*"),
  API_PREFIX: z.string().default("/api/v1"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  INTERNAL_ADMIN_USER_ID: z.string().uuid().default("11111111-1111-1111-1111-111111111111"),
  INTERNAL_USER_ID: z.string().uuid().default("22222222-2222-2222-2222-222222222222"),
  INTERNAL_ADMIN_TOKEN: z.string().min(16).default("change-me-admin-token"),
  INTERNAL_USER_TOKEN: z.string().min(16).default("change-me-user-token")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast for invalid env values. API must not boot with unsafe config.
  const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const config = parsed.data;

export function isSupabaseConfigured() {
  return Boolean(config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY);
}
