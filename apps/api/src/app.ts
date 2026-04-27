import Fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { authPlugin } from "./plugins/auth.js";
import { healthRoutes } from "./routes/health.js";
import { recipientRoutes } from "./routes/recipients.js";
import { paymentRoutes } from "./routes/payments.js";
import { adminRoutes } from "./routes/admin.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: { translateTime: "SYS:standard", colorize: true }
            }
          : undefined
    },
    bodyLimit: 1_000_000
  });

  app.register(cors, {
    origin: config.CORS_ORIGIN === "*" ? true : config.CORS_ORIGIN.split(",").map((v) => v.trim()),
    credentials: true
  });

  app.register(helmet, {
    global: true
  });

  app.register(rateLimit, {
    max: 120,
    timeWindow: "1 minute"
  });

  app.register(authPlugin);
  app.register(healthRoutes);
  app.register(apiV1Routes, { prefix: config.API_PREFIX });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: {
        code: "NOT_FOUND",
        message: `Route not found: ${request.method} ${request.url}`
      }
    });
  });

  app.setErrorHandler((error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
    app.log.error({ err: error }, "request_failed");

    if (reply.sent) {
      return;
    }

    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    reply.code(statusCode).send({
      error: {
        code: statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
        message: statusCode >= 500 ? "Beklenmeyen bir hata oluştu." : error.message
      }
    });
  });

  return app;
}

async function apiV1Routes(app: FastifyInstance) {
  app.get("/", async () => ({
    service: "kiram-api",
    version: "v1",
    scope: ["rent", "dues"]
  }));

  app.register(recipientRoutes);
  app.register(paymentRoutes);
  app.register(adminRoutes);
}
