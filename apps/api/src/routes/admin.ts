import { FastifyInstance } from "fastify";
import { z } from "zod";
import { writeAuditLog } from "../repositories/auditLogRepository.js";
import { getIdempotentResult, saveIdempotentResult } from "../repositories/idempotencyRepository.js";
import {
  createBroadcast,
  getAdminTransactionSummary,
  listAdminTransactions
} from "../repositories/adminRepository.js";

const broadcastSchema = z.object({
  title: z.string().trim().min(3).max(80),
  body: z.string().trim().min(5).max(240),
  audience: z.enum(["all", "active", "test"])
});
const idempotencyKeySchema = z.string().trim().min(10).max(128);
const listAdminTransactionsQuerySchema = z.object({
  status: z.enum(["success", "pending", "failed"]).optional(),
  search: z.string().trim().max(64).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100)
});

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/transactions",
    {
      preHandler: app.requireRole("admin"),
      config: {
        rateLimit: {
          max: 60,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const parsed = listAdminTransactionsQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "BAD_REQUEST",
            message: "Geçersiz sorgu parametresi."
          }
        });
      }
      const items = await listAdminTransactions(parsed.data);
      try {
        await writeAuditLog({
          actorUserId: request.authUser!.id,
          actorRole: "admin",
          action: "admin_transactions_listed",
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

  app.get(
    "/admin/transactions/summary",
    {
      preHandler: app.requireRole("admin"),
      config: {
        rateLimit: {
          max: 60,
          timeWindow: "1 minute"
        }
      }
    },
    async (request) => {
      const summary = await getAdminTransactionSummary();
      try {
        await writeAuditLog({
          actorUserId: request.authUser!.id,
          actorRole: "admin",
          action: "admin_transactions_summary_viewed",
          entity: "transactions",
          metadata: {
            pendingCount: summary.pendingCount,
            successRate: summary.successRate
          }
        });
      } catch (error) {
        request.log.warn({ err: error }, "audit_log_failed");
      }
      return summary;
    }
  );

  app.post(
    "/admin/broadcasts",
    {
      preHandler: app.requireRole("admin"),
      config: {
        rateLimit: {
          max: 10,
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

      try {
        await writeAuditLog({
          actorUserId: request.authUser!.id,
          actorRole: "admin",
          action: "admin_broadcast_created",
          entity: "broadcasts",
          entityId: result.id,
          metadata: {
            audience: parsed.data.audience,
            titleLength: parsed.data.title.length
          }
        });
      } catch (error) {
        request.log.warn({ err: error }, "audit_log_failed");
      }

      await saveIdempotentResult(scope, idempotencyKeyParsed.data, 201, result);
      return reply.code(201).send(result);
    }
  );
}
