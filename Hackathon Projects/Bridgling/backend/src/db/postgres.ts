import { Pool, PoolClient } from "pg";
import { logger } from "../utils/logger.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (error) => {
  logger.error({ error }, "Unexpected error on idle client");
});

export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

export async function query(sql: string, params?: any[]) {
  return pool.query(sql, params);
}

export async function initializeDatabase() {
  const client = await getClient();

  try {
    // Enable pgvector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Create tenants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        allowed_domains TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        url VARCHAR(2048) NOT NULL,
        title VARCHAR(512),
        hash VARCHAR(64),
        crawled_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(tenant_id, url)
      );
    `);

    // Create chunks table with pgvector
    await client.query(`
      CREATE TABLE IF NOT EXISTS chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        embedding vector(1024),
        chunk_index INT NOT NULL,
        url VARCHAR(2048),
        language VARCHAR(10),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chunks_tenant_id ON chunks(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
      CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON documents(tenant_id);
    `);

    // Create crawl_jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS crawl_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        domains_to_scan TEXT[],
        documents_scanned INT DEFAULT 0,
        chunks_created INT DEFAULT 0,
        error TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create queries table for analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS queries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        query TEXT NOT NULL,
        detected_language VARCHAR(10),
        response_time_ms INT,
        sources_used INT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    logger.info("Database initialized successfully");
  } catch (error) {
    logger.error({ error }, "Database initialization failed");
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
