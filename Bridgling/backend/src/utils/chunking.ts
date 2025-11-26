// Simple token estimation (1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

interface ChunkOptions {
  chunkSize?: number;
  overlapSize?: number;
}

export function chunkText(
  text: string,
  options: ChunkOptions = {}
): string[] {
  const { chunkSize = 600, overlapSize = 80 } = options;

  const chunks: string[] = [];
  let currentPos = 0;
  const targetChunkTokens = chunkSize;
  const overlapTokens = overlapSize;
  const chunkCharSize = targetChunkTokens * 4;
  const overlapCharSize = overlapTokens * 4;

  while (currentPos < text.length) {
    const chunkEnd = Math.min(currentPos + chunkCharSize, text.length);
    const chunk = text.slice(currentPos, chunkEnd).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move forward by chunk size minus overlap
    const moveSize = chunkCharSize - overlapCharSize;
    currentPos += moveSize;

    if (currentPos >= text.length) break;
  }

  return chunks;
}

export function cleanText(html: string): string {
  // Remove script and style tags
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize whitespace
  text = text
    .replace(/\s+/g, " ")
    .trim();

  return text;
}
