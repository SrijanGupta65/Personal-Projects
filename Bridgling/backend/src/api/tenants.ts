import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { Tenant } from "../types.js";
import { query as dbQuery } from "../db/postgres.js";
import { logger } from "../utils/logger.js";

interface CreateTenantRequest {
  name: string;
  allowedDomains: string[];
}

export async function registerTenantRoutes(app: FastifyInstance) {
  // Get all tenants
  app.get("/api/tenants", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await dbQuery("SELECT id, name, allowed_domains, created_at, updated_at FROM tenants");
      return reply.status(200).send(result.rows);
    } catch (error) {
      logger.error({ error }, "Failed to fetch tenants");
      return reply.status(500).send({ error: "Failed to fetch tenants" });
    }
  });

  // Get tenant by ID
  app.get<{ Params: { id: string } }>(
    "/api/tenants/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const result = await dbQuery("SELECT id, name, allowed_domains, created_at, updated_at FROM tenants WHERE id = $1", [
          request.params.id,
        ]);

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: "Tenant not found" });
        }

        return reply.status(200).send(result.rows[0]);
      } catch (error) {
        logger.error({ error }, "Failed to fetch tenant");
        return reply.status(500).send({ error: "Failed to fetch tenant" });
      }
    }
  );

  // Create tenant
  app.post<{ Body: CreateTenantRequest }>(
    "/api/tenants",
    async (request: FastifyRequest<{ Body: CreateTenantRequest }>, reply: FastifyReply) => {
      try {
        const { name, allowedDomains } = request.body;

        const result = await dbQuery(
          `INSERT INTO tenants (id, name, allowed_domains)
           VALUES ($1, $2, $3)
           RETURNING id, name, allowed_domains, created_at, updated_at`,
          [uuidv4(), name, JSON.stringify(allowedDomains)]
        );

        return reply.status(201).send(result.rows[0]);
      } catch (error) {
        logger.error({ error }, "Failed to create tenant");
        return reply.status(500).send({ error: "Failed to create tenant" });
      }
    }
  );

  // Delete tenant
  app.delete<{ Params: { id: string } }>(
    "/api/tenants/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await dbQuery("DELETE FROM tenants WHERE id = $1", [request.params.id]);
        return reply.status(204).send();
      } catch (error) {
        logger.error({ error }, "Failed to delete tenant");
        return reply.status(500).send({ error: "Failed to delete tenant" });
      }
    }
  );
}
