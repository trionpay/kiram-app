import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getIdempotentResult, saveIdempotentResult } from "../repositories/idempotencyRepository.js";
import { createBroadcast, getAdminTransactionSummary } from "../repositories/adminRepository.js";

const broadcastSchema = z.object({
  title: z.string().trim().min(3).max(80),
  body: z.string().trim().min(5).max(240),
  audience: z.enum(["all", "active", "test"])
});
const idempotencyKeySchema = z.string().trim().min(10).max(128);

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/transactions/summary",
    {
      preHandler: app.requireRole("admin")
    },
    async () => {
      return getAdminTransactionSummary();
    }
  );

  app.post(
    "/admin/broadcasts",
    {
      preHandler: app.requireRole("admin")
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

      const parsed = broadcastSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Geçersiz duyuru verisi."
          }
        });
      }

      const scope = `broadcast:${request.authUser!.id}`;
      const existing = await getIdempotentResult(scope, idempotencyKeyParsed.data);
      if (existing) {
        return reply.code(existing.statusCode).send(existing.response);
      }

      const result = await createBroadcast({
        ...parsed.data,
        createdByUserId: request.authUser!.id
      });
      request.log.info({ broadcastId: result.id, ...parsed.data }, "admin_broadcast_created");

      await saveIdempotentResult(scope, idempotencyKeyParsed.data, 201, result);
      return reply.code(201).send(result);
    }
  );
}
