import { buildApp } from "./app.js";
import { config } from "./config.js";

const app = buildApp();

const start = async () => {
  try {
    await app.listen({ host: config.HOST, port: config.PORT });
    app.log.info(`API listening on ${config.HOST}:${config.PORT}`);
  } catch (error) {
    app.log.error(error, "failed_to_start_api");
    process.exit(1);
  }
};

void start();

const shutdown = async (signal: NodeJS.Signals) => {
  app.log.info({ signal }, "graceful_shutdown_started");
  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error(error, "graceful_shutdown_failed");
    process.exit(1);
  }
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
