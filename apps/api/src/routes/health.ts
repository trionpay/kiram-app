import { FastifyInstance } from "fastify";
import { config, isSupabaseConfigured } from "../config.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "kiram-api",
      env: config.NODE_ENV,
      supabaseConfigured: isSupabaseConfigured()
    };
  });
}
