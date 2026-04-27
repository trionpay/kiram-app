import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getIdempotentResult, saveIdempotentResult } from "../repositories/idempotencyRepository.js";
import { createPayment, quotePayment } from "../repositories/paymentsRepository.js";

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

export async function paymentRoutes(app: FastifyInstance) {
  app.post(
    "/payments/quote",
    {
      preHandler: app.requireRole("user")
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
      preHandler: app.requireRole("user")
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

      await saveIdempotentResult(scope, idempotencyKeyParsed.data, 201, created);
      return reply.code(201).send(created);
    }
  );
}
