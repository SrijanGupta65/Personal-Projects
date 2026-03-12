import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { QueryRequest, QueryResponse } from "../types.js";
import {
  detectLanguage,
  translateToEnglish,
  generateEmbedding,
  generateAnswer,
} from "../services/claude.js";
import { searchChunks } from "../db/vector.js";
import { query as dbQuery } from "../db/postgres.js";
import { logger } from "../utils/logger.js";

export async function registerQueryRoutes(app: FastifyInstance) {
  app.post<{ Body: QueryRequest }>(
    "/api/query",
    async (request: FastifyRequest<{ Body: QueryRequest }>, reply: FastifyReply) => {
      const startTime = Date.now();
      const { tenantId, query, preferredLanguage } = request.body;

      try {
        // Validate tenant exists
        const tenantResult = await dbQuery(
          "SELECT id FROM tenants WHERE id = $1",
          [tenantId]
        );

        if (tenantResult.rows.length === 0) {
          return reply.status(404).send({ error: "Tenant not found" });
        }

        // Step 1: Detect language
        const detection = await detectLanguage(query);
        const detectedLanguage = detection.language;
        logger.info({ detectedLanguage, query }, "Detected language");

        // Step 2: Translate to English
        const canonicalQuery = await translateToEnglish(query, detectedLanguage);
        logger.info({ canonicalQuery }, "Translated query to English");

        // Step 3: Generate embedding
        const embeddingResponse = await generateEmbedding({ text: canonicalQuery });
        const embedding = embeddingResponse.embedding;

        // Step 4: Vector search
        const chunks = await searchChunks(tenantId, embedding, 5, 0.5);
        logger.info({ chunksFound: chunks.length }, "Retrieved chunks");

        if (chunks.length === 0) {
          return reply.status(200).send({
            answer: "I don't have information available to answer this question.",
            language: detectedLanguage,
            sources: [],
          } as QueryResponse);
        }

        // Step 5: Build context
        const context = chunks
          .map((chunk, i) => `[${i + 1}] URL: ${chunk.url}\n${chunk.text}`)
          .join("\n\n");

        const systemPrompt = `You are Bridgeling, an institutional information assistant.
Answer using ONLY the context provided below. If you cannot answer from the context, say you don't know.
IMPORTANT: Respond in the user's language: ${detectedLanguage}

Institution: ${tenantId}`;

        const userPrompt = `User question (in ${detectedLanguage}): "${query}"

Context from institutional documents:
${context}

Please answer the user's question based ONLY on the context above. Be concise but complete.`;

        // Step 6: Generate answer with Claude
        const answerResponse = await generateAnswer({
          systemPrompt,
          userPrompt,
          temperature: 0.1,
          maxTokens: 800,
        });

        // Step 7: Extract unique URLs as sources
        const uniqueUrls = Array.from(new Set(chunks.map((c) => c.url)));
        const sources = uniqueUrls.map((url) => ({
          url,
          title: new URL(url).pathname.split("/").pop() || url,
        }));

        const responseTime = Date.now() - startTime;

        // Log query for analytics
        await dbQuery(
          `INSERT INTO queries (tenant_id, query, detected_language, response_time_ms, sources_used)
           VALUES ($1, $2, $3, $4, $5)`,
          [tenantId, query, detectedLanguage, responseTime, sources.length]
        );

        return reply.status(200).send({
          answer: answerResponse.content,
          language: detectedLanguage,
          sources,
        } as QueryResponse);
      } catch (error) {
        logger.error({ error, tenantId, query }, "Query processing failed");
        return reply.status(500).send({
          error: "Failed to process query",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );
}
