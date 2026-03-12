import * as cheerio from "cheerio";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { createHash } from "crypto";
import { logger } from "../utils/logger.js";
import { chunkText, cleanText } from "../utils/chunking.js";
import { generateEmbedding } from "../services/claude.js";
import { query as dbQuery } from "../db/postgres.js";
import { storeChunk, deleteChunksByDocument } from "../db/vector.js";

interface CrawlOptions {
  maxDepth?: number;
  rateLimit?: number;
  allowedDomains: string[];
}

interface PageContent {
  url: string;
  title: string;
  content: string;
}

function isValidUrl(url: string, allowedDomains: string[]): boolean {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

async function fetchAndParsePage(url: string): Promise<PageContent | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": process.env.CRAWLER_USER_AGENT || "Bridgeling-Bot/1.0",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      logger.warn({ url, status: response.status }, "Failed to fetch page");
      return null;
    }

    const html = await response.text();

    // Try Readability first (cleaner content extraction)
    try {
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (article) {
        return {
          url,
          title: article.title || new URL(url).pathname,
          content: cleanText(article.content),
        };
      }
    } catch (error) {
      logger.debug({ url }, "Readability parsing failed, falling back to cheerio");
    }

    // Fallback to cheerio-based extraction
    const $ = cheerio.load(html);
    const title = $("title").text() || new URL(url).pathname;
    const bodyText = cleanText($("body").html() || "");

    return {
      url,
      title,
      content: bodyText,
    };
  } catch (error) {
    logger.error({ error, url }, "Failed to fetch/parse page");
    return null;
  }
}

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export async function crawlDomain(
  tenantId: string,
  startUrl: string,
  options: CrawlOptions
): Promise<{ docsCreated: number; chunksCreated: number }> {
  const visited = new Set<string>();
  const toVisit = [startUrl];
  let docsCreated = 0;
  let chunksCreated = 0;

  const maxDepth = options.maxDepth || 3;
  const rateLimit = options.rateLimit || 100; // ms between requests

  while (toVisit.length > 0) {
    const url = toVisit.shift()!;

    if (visited.has(url) || visited.size > 100) break; // Limit crawl size
    if (!isValidUrl(url, options.allowedDomains)) continue;

    visited.add(url);
    logger.info({ url }, "Crawling page");

    // Fetch and parse
    const pageContent = await fetchAndParsePage(url);
    if (!pageContent) continue;

    const contentHash = hashContent(pageContent.content);

    // Check if document exists and has changed
    const docResult = await dbQuery(
      `SELECT id, hash FROM documents WHERE tenant_id = $1 AND url = $2`,
      [tenantId, url]
    );

    let documentId: string;

    if (docResult.rows.length > 0) {
      const existingDoc = docResult.rows[0];
      if (existingDoc.hash === contentHash) {
        logger.debug({ url }, "Document unchanged, skipping");
        continue;
      }

      // Update document
      documentId = existingDoc.id;
      await dbQuery(
        `UPDATE documents SET hash = $1, updated_at = NOW() WHERE id = $2`,
        [contentHash, documentId]
      );

      // Delete old chunks
      await deleteChunksByDocument(documentId);
    } else {
      // Create new document
      const insertResult = await dbQuery(
        `INSERT INTO documents (tenant_id, url, title, hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [tenantId, url, pageContent.title, contentHash]
      );

      documentId = insertResult.rows[0].id;
      docsCreated++;
    }

    // Chunk and embed
    const chunks = chunkText(pageContent.content);

    for (let i = 0; i < chunks.length; i++) {
      try {
        const embedding = await generateEmbedding({ text: chunks[i] });
        await storeChunk(
          documentId,
          tenantId,
          chunks[i],
          embedding.embedding,
          i,
          url,
          "en",
          { title: pageContent.title }
        );
        chunksCreated++;
      } catch (error) {
        logger.error({ error, url }, "Failed to embed and store chunk");
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, rateLimit));
    }

    // Extract links for BFS
    try {
      const $ = cheerio.load(pageContent.content);
      $("a[href]").each((i, el) => {
        const href = $(el).attr("href");
        if (href && !visited.has(href)) {
          try {
            const absoluteUrl = new URL(href, url).href;
            if (isValidUrl(absoluteUrl, options.allowedDomains)) {
              toVisit.push(absoluteUrl);
            }
          } catch {
            // Invalid URL
          }
        }
      });
    } catch (error) {
      logger.debug({ error }, "Failed to extract links");
    }

    await new Promise((resolve) => setTimeout(resolve, rateLimit));
  }

  return { docsCreated, chunksCreated };
}
