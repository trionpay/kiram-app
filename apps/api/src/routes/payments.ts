import { FastifyInstance } from "fastify";
import { z } from "zod";
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
      const parsed = createPaymentBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Geçersiz ödeme verisi."
          }
        });
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

      return reply.code(201).send(created);
    }
  );
}
