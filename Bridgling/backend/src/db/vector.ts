import { query } from "./postgres.js";
import { logger } from "../utils/logger.js";

export async function searchChunks(
  tenantId: string,
  embedding: number[],
  limit: number = 5,
  threshold: number = 0.5
) {
  try {
    const result = await query(
      `
      SELECT
        id,
        document_id,
        text,
        url,
        chunk_index,
        1 - (embedding <=> $2::vector) as similarity
      FROM chunks
      WHERE tenant_id = $1
        AND 1 - (embedding <=> $2::vector) > $3
      ORDER BY embedding <=> $2::vector
      LIMIT $4;
    `,
      [tenantId, JSON.stringify(embedding), threshold, limit]
    );

    return result.rows;
  } catch (error) {
    logger.error({ error, tenantId }, "Chunk search failed");
    throw error;
  }
}

export async function storeChunk(
  documentId: string,
  tenantId: string,
  text: string,
  embedding: number[],
  chunkIndex: number,
  url: string,
  language: string,
  metadata: Record<string, any> = {}
) {
  try {
    const result = await query(
      `
      INSERT INTO chunks (document_id, tenant_id, text, embedding, chunk_index, url, language, metadata)
      VALUES ($1, $2, $3, $4::vector, $5, $6, $7, $8)
      RETURNING id;
    `,
      [documentId, tenantId, text, JSON.stringify(embedding), chunkIndex, url, language, JSON.stringify(metadata)]
    );

    return result.rows[0].id;
  } catch (error) {
    logger.error({ error }, "Chunk storage failed");
    throw error;
  }
}

export async function deleteChunksByDocument(documentId: string) {
  try {
    await query("DELETE FROM chunks WHERE document_id = $1", [documentId]);
  } catch (error) {
    logger.error({ error, documentId }, "Failed to delete chunks");
    throw error;
  }
}
