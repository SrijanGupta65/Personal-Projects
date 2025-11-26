import Fastify from "fastify";
import cors from "@fastify/cors";
import { initializeDatabase, closePool } from "./db/postgres.js";
import { registerQueryRoutes } from "./api/query.js";
import { registerTenantRoutes } from "./api/tenants.js";
import { logger } from "./utils/logger.js";

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = "0.0.0.0";

async function main() {
  // Initialize database
  try {
    await initializeDatabase();
    logger.info("Database initialized");
  } catch (error) {
    logger.error({ error }, "Failed to initialize database");
    process.exit(1);
  }

  // Create Fastify app
  const app = Fastify({
    logger: false, // Use our custom logger
  });

  // Register CORS
  await app.register(cors, {
    origin: true,
  });

  // Register routes
  await registerTenantRoutes(app);
  await registerQueryRoutes(app);

  // Health check
  app.get("/health", async (request, reply) => {
    return { status: "ok" };
  });

  // Start server
  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info({ port: PORT }, "Server running");
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, shutting down gracefully");
    await app.close();
    await closePool();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    logger.info("SIGINT received, shutting down gracefully");
    await app.close();
    await closePool();
    process.exit(0);
  });
}

main().catch((error) => {
  logger.error({ error }, "Fatal error");
  process.exit(1);
});
