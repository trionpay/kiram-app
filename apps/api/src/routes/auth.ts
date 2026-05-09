import { randomInt, randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { config } from "../config.js";
import { getSupabaseAdminClient } from "../lib/supabase.js";

const requestOtpBodySchema = z.object({
  phone: z.string().trim().regex(/^5\d{9}$/, "Telefon formatı geçersiz."),
  intent: z.enum(["login", "signup"]).default("login")
});

const verifyOtpBodySchema = z.object({
  phone: z.string().trim().regex(/^5\d{9}$/, "Telefon formatı geçersiz."),
  code: z.string().trim().regex(/^\d{6}$/, "Kod 6 haneli olmalıdır."),
  intent: z.enum(["login", "signup"]).default("login")
});

type OtpRecord = {
  code: string;
  expiresAt: number;
  attemptsLeft: number;
  intent: "login" | "signup";
};

type SessionRecord = {
  phone: string;
  userId: string | null;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();
const sessionStore = new Map<string, SessionRecord>();
const OTP_ATTEMPT_LIMIT = 5;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;

type DemoKind = "login" | "signup";

function normalizePhone(phone: string) {
  return phone.trim().replace(/\D/g, "");
}

function maskPhone(phone: string) {
  return `+90 ${phone.slice(0, 3)} *** ${phone.slice(-2)}`;
}

function resolveDemoOtp(phone: string) {
  if (config.AUTH_TEST_SIGNUP_PHONE && config.AUTH_TEST_SIGNUP_CODE && phone === config.AUTH_TEST_SIGNUP_PHONE) {
    return { kind: "signup" as DemoKind, code: config.AUTH_TEST_SIGNUP_CODE };
  }
  if (config.AUTH_TEST_LOGIN_PHONE && config.AUTH_TEST_LOGIN_CODE && phone === config.AUTH_TEST_LOGIN_PHONE) {
    return { kind: "login" as DemoKind, code: config.AUTH_TEST_LOGIN_CODE };
  }
  if (config.AUTH_TEST_PHONE && config.AUTH_TEST_CODE && phone === config.AUTH_TEST_PHONE) {
    return { kind: "login" as DemoKind, code: config.AUTH_TEST_CODE };
  }
  return null;
}

async function findExistingUserByPhone(phone: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const normalizedPhone = `+90${phone}`;
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("phone", normalizedPhone)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Kullanıcı bilgisi doğrulanamadı.");
  }

  return (data?.id as string | undefined) ?? null;
}

function cleanupStores() {
  const now = Date.now();
  for (const [phone, record] of otpStore.entries()) {
    if (record.expiresAt <= now) otpStore.delete(phone);
  }
  for (const [token, session] of sessionStore.entries()) {
    if (session.expiresAt <= now) sessionStore.delete(token);
  }
}

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/otp/request",
    {
      config: {
        rateLimit: { max: 10, timeWindow: "1 minute" }
      }
    },
    async (request, reply) => {
      cleanupStores();

      const parsed = requestOtpBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Geçersiz telefon." }
        });
      }

      const phone = normalizePhone(parsed.data.phone);
      const intent = parsed.data.intent;
      const demoOtp = resolveDemoOtp(phone);
      const userId = await findExistingUserByPhone(phone);
      const hasSupabase = Boolean(getSupabaseAdminClient());

      if (!demoOtp && intent === "login" && hasSupabase && !userId) {
        return reply.code(404).send({
          error: { code: "ACCOUNT_NOT_FOUND", message: "Bu telefon numarası için hesap bulunamadı." }
        });
      }
      if (!demoOtp && intent === "signup" && hasSupabase && userId) {
        return reply.code(409).send({
          error: { code: "ACCOUNT_EXISTS", message: "Bu telefon numarası zaten kayıtlı. Lütfen giriş yapın." }
        });
      }

      const code = demoOtp?.code ?? String(randomInt(100000, 999999));
      const expiresAt = Date.now() + config.OTP_TTL_SECONDS * 1000;
      otpStore.set(phone, { code, expiresAt, attemptsLeft: OTP_ATTEMPT_LIMIT, intent });

      if (!demoOtp) {
        request.log.info({ phone: `+90${phone}`, code }, "otp_code_generated");
      }

      return reply.code(200).send({
        ok: true,
        channel: "sms",
        maskedPhone: maskPhone(phone),
        expiresInSeconds: config.OTP_TTL_SECONDS,
        isTestPhone: Boolean(demoOtp),
        intent
      });
    }
  );

  app.post(
    "/auth/otp/verify",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" }
      }
    },
    async (request, reply) => {
      cleanupStores();

      const parsed = verifyOtpBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Geçersiz doğrulama verisi." }
        });
      }

      const phone = normalizePhone(parsed.data.phone);
      const code = parsed.data.code;
      const intent = parsed.data.intent;
      const otpRecord = otpStore.get(phone);

      if (!otpRecord || otpRecord.expiresAt <= Date.now()) {
        otpStore.delete(phone);
        return reply.code(401).send({
          error: { code: "OTP_EXPIRED", message: "Kodun süresi dolmuş. Lütfen yeni kod isteyin." }
        });
      }

      if (otpRecord.code !== code) {
        otpRecord.attemptsLeft -= 1;
        if (otpRecord.attemptsLeft <= 0) {
          otpStore.delete(phone);
        } else {
          otpStore.set(phone, otpRecord);
        }
        return reply.code(401).send({
          error: { code: "OTP_INVALID", message: "Doğrulama kodu hatalı." }
        });
      }

      if (otpRecord.intent !== intent) {
        return reply.code(400).send({
          error: { code: "OTP_INTENT_MISMATCH", message: "Lütfen işlemi tekrar başlatın." }
        });
      }

      const userId = await findExistingUserByPhone(phone);
      const demoOtp = resolveDemoOtp(phone);
      const hasSupabase = Boolean(getSupabaseAdminClient());
      const isExistingUser = Boolean(userId);
      const isSignupFlow = intent === "signup" || demoOtp?.kind === "signup";

      if (!demoOtp && intent === "login" && hasSupabase && !isExistingUser) {
        return reply.code(403).send({
          error: { code: "ACCOUNT_REQUIRED", message: "Bu numara için üyelik kaydı bulunamadı." }
        });
      }
      if (!demoOtp && intent === "signup" && hasSupabase && isExistingUser) {
        return reply.code(409).send({
          error: { code: "ACCOUNT_EXISTS", message: "Bu telefon numarası zaten kayıtlı. Lütfen giriş yapın." }
        });
      }

      otpStore.delete(phone);
      const sessionToken = randomUUID();
      sessionStore.set(sessionToken, {
        phone,
        userId: userId ?? config.INTERNAL_USER_ID,
        expiresAt: Date.now() + SESSION_TTL_MS
      });

      return reply.code(200).send({
        ok: true,
        sessionToken,
        expiresInSeconds: Math.floor(SESSION_TTL_MS / 1000),
        user: {
          id: userId ?? config.INTERNAL_USER_ID,
          phone: `+90${phone}`,
          isTestUser: Boolean(demoOtp)
        },
        nextStep: isSignupFlow ? "onboarding" : "dashboard"
      });
    }
  );

  app.get("/auth/session", async (request, reply) => {
    cleanupStores();
    const auth = request.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return reply.code(401).send({
        error: { code: "UNAUTHORIZED", message: "Oturum doğrulaması gerekli." }
      });
    }

    const token = auth.slice("Bearer ".length).trim();
    const session = sessionStore.get(token);
    if (!session || session.expiresAt <= Date.now()) {
      sessionStore.delete(token);
      return reply.code(401).send({
        error: { code: "SESSION_INVALID", message: "Oturum geçersiz veya süresi dolmuş." }
      });
    }

    return reply.code(200).send({
      ok: true,
      user: {
        id: session.userId ?? config.INTERNAL_USER_ID,
        phone: `+90${session.phone}`
      }
    });
  });
}
