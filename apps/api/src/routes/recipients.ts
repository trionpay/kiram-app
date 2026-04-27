import { FastifyInstance } from "fastify";
import { z } from "zod";
import { listRecipientsByUser } from "../repositories/recipientsRepository.js";

const recipientsQuerySchema = z.object({
  search: z.string().trim().max(64).optional()
});

export async function recipientRoutes(app: FastifyInstance) {
  app.get(
    "/recipients",
    {
      preHandler: app.requireRole("user")
    },
    async (request, reply) => {
      const parsed = recipientsQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.code(400).send({
          error: {
            code: "BAD_REQUEST",
            message: "Geçersiz sorgu parametresi."
          }
        });
      }

      const recipients = await listRecipientsByUser(request.authUser!.id, parsed.data.search);

      return {
        items: recipients
      };
    }
  );
}
