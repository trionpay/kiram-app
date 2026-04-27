import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config.js";
import { AuthUser, UserRole } from "../types.js";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: AuthUser;
  }

  interface FastifyInstance {
    requireRole: (role: UserRole) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const tokenMap = new Map<string, AuthUser>([
  [config.INTERNAL_ADMIN_TOKEN, { id: config.INTERNAL_ADMIN_USER_ID, role: "admin" }],
  [config.INTERNAL_USER_TOKEN, { id: config.INTERNAL_USER_ID, role: "user" }]
]);

function unauthorized(reply: FastifyReply) {
  return reply.code(401).send({
    error: {
      code: "UNAUTHORIZED",
      message: "Kimlik doğrulama gerekli."
    }
  });
}

export const authPlugin = fp(async (app) => {
  app.decorate("requireRole", (role: UserRole) => {
    return async (request, reply) => {
      const raw = request.headers.authorization;
      if (!raw || !raw.startsWith("Bearer ")) {
        return unauthorized(reply);
      }

      const token = raw.slice("Bearer ".length).trim();
      const user = tokenMap.get(token);

      if (!user) {
        return unauthorized(reply);
      }

      if (role === "admin" && user.role !== "admin") {
        return reply.code(403).send({
          error: {
            code: "FORBIDDEN",
            message: "Bu işlem için admin yetkisi gerekli."
          }
        });
      }

      request.authUser = user;
    };
  });
});
