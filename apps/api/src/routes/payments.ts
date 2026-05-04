import { FastifyInstance } from "fastify";
import { z } from "zod";
import { writeAuditLog } from "../repositories/auditLogRepository.js";
import { getIdempotentResult, saveIdempotentResult } from "../repositories/idempotencyRepository.js";
import { createPayment, listPaymentsByUser, quotePayment } from "../repositories/paymentsRepository.js";

const paymentTypeSchema = z.enum(["rent", "dues"]);

const quoteBodySchema = z.object({
  paymentType: paymentTypeSchema,
  amountTry: z.number().positive().max(1_000_000),
  recipientIban: z.string().trim().regex(/^TR[0-9A-Z]{24}$/, "IBAN formatı geçersiz.")
});

const createPaymentBodySchema = z.object({
  paymentType: paymentTypeSchema,
  amountTry: z.number().positive().max(1_000_000),
  recipientIban: z.string().trim().regex(/^TR[0-9A-Z]{24}$/, "IBAN formatı geçersiz."),
  cardToken: z.string().trim().min(8),
  description: z.string().trim().max(140).optional()
});

const idempotencyKeySchema = z.string().trim().min(10).max(128);
const listPaymentsQuerySchema = z.object({
  status: z.enum(["success", "pending", "failed"]).optional(),
  search: z.string().trim().max(64).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});

export async function paymentRoutes(app: FastifyInstance) {
  app.get(
    "/payments",
    {
      preHandler: app.requireRole("user"),
      config: {
        rateLimit: {
          max: 60,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const parsed = listPaymentsQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "BAD_REQUEST",
            message: "Geçersiz sorgu parametresi."
          }
        });
      }

      const items = await listPaymentsByUser(request.authUser!.id, parsed.data);
      try {
        await writeAuditLog({
          actorUserId: request.authUser!.id,
          actorRole: "user",
          action: "payments_listed",
          entity: "transactions",
          metadata: {
            count: items.length,
            status: parsed.data.status ?? null
          }
        });
      } catch (error) {
        request.log.warn({ err: error }, "audit_log_failed");
      }
      return { items };
    }
  );

  app.post(
    "/payments/quote",
    {
      preHandler: app.requireRole("user"),
      config: {
        rateLimit: {
          max: 40,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const parsed = quoteBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Geçersiz ödeme verisi."
          }
        });
      }

      return quotePayment(parsed.data);
    }
  );

  app.post(
    "/payments",
    {
      preHandler: app.requireRole("user"),
      config: {
        rateLimit: {
          max: 20,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const idempotencyKeyParsed = idempotencyKeySchema.safeParse(request.headers["idempotency-key"]);
      if (!idempotencyKeyParsed.success) {
        return reply.code(400).send({
          error: {
            code: "IDEMPOTENCY_KEY_REQUIRED",
            message: "Idempotency-Key header zorunludur."
          }
        });
      }

      const parsed = createPaymentBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Geçersiz ödeme verisi."
          }
        });
      }

      const scope = `payments:${request.authUser!.id}`;
      const existing = await getIdempotentResult(scope, idempotencyKeyParsed.data);
      if (existing) {
        return reply.code(existing.statusCode).send(existing.response);
      }

      const created = await createPayment({
        userId: request.authUser!.id,
        ...parsed.data
      });

      request.log.info(
        {
          transactionId: created.transactionId,
          paymentType: created.paymentType,
          amountTry: created.amountTry,
          feeTry: created.feeTry,
          userId: request.authUser?.id
        },
        "payment_created"
      );

      try {
        await writeAuditLog({
          actorUserId: request.authUser!.id,
          actorRole: "user",
          action: "payment_created",
          entity: "transactions",
          entityId: created.transactionId,
          metadata: {
            paymentType: created.paymentType,
            amountTry: created.amountTry,
            feeTry: created.feeTry
          }
        });
      } catch (error) {
        request.log.warn({ err: error }, "audit_log_failed");
      }

      await saveIdempotentResult(scope, idempotencyKeyParsed.data, 201, created);
      return reply.code(201).send(created);
    }
  );
}
