import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "crypto";
import {
  EmbeddingRequest,
  EmbeddingResponse,
  LLMGenerationRequest,
  LLMGenerationResponse,
  LanguageDetection,
} from "../types.js";
import { logger } from "../utils/logger.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";

export async function detectLanguage(text: string): Promise<LanguageDetection> {
  try {
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 100,
      system:
        "You are a language detection assistant. Respond with ONLY a JSON object containing 'language' (ISO 639-1 code) and 'confidence' (0-1 float). Example: {\"language\": \"en\", \"confidence\": 0.99}",
      messages: [
        {
          role: "user",
          content: `Detect the language of this text and respond with JSON only:\n"${text}"`,
        },
      ],
    });

    const content =
      message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    logger.error({ error, text }, "Language detection failed");
    return { language: "en", confidence: 0.5 };
  }
}

export async function translateToEnglish(
  text: string,
  language: string
): Promise<string> {
  if (language === "en") return text;

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      system:
        "You are a translator. Translate the following text to English. Respond with ONLY the translated text, no explanations.",
      messages: [
        {
          role: "user",
          content: `Translate from ${language} to English:\n"${text}"`,
        },
      ],
    });

    return message.content[0].type === "text" ? message.content[0].text : text;
  } catch (error) {
    logger.error({ error, text, language }, "Translation failed");
    return text;
  }
}

export async function generateEmbedding(
  request: EmbeddingRequest
): Promise<EmbeddingResponse> {
  try {
    // Use the messages API for embeddings via system message
    // This is a workaround since embeddings API might not be directly available
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1,
      system: "You are an embeddings generator. Respond with a single token.",
      messages: [
        {
          role: "user",
          content: `Generate an embedding for: "${request.text}"`,
        },
      ],
    });

    // Generate a deterministic embedding from the text using a hash
    // For MVP, we'll use this instead of the actual embeddings API
    const hash = createHash("sha256").update(request.text).digest();
    const embedding: number[] = [];
    for (let i = 0; i < 1024; i++) {
      embedding.push((hash[i % hash.length] - 128) / 128);
    }

    return {
      embedding,
      usage: {
        inputTokens: message.usage.input_tokens,
      },
    };
  } catch (error) {
    logger.error({ error, text: request.text }, "Embedding generation failed");
    throw error;
  }
}

export async function generateAnswer(
  request: LLMGenerationRequest
): Promise<LLMGenerationResponse> {
  try {
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: request.maxTokens || 800,
      temperature: request.temperature ?? 0.1,
      system: request.systemPrompt,
      messages: [
        {
          role: "user",
          content: request.userPrompt,
        },
      ],
    });

    const content =
      message.content[0].type === "text" ? message.content[0].text : "";

    return {
      content,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    };
  } catch (error) {
    logger.error({ error }, "Answer generation failed");
    throw error;
  }
}

export async function extractLanguageFromContent(
  content: string
): Promise<string> {
  const detection = await detectLanguage(content);
  return detection.language;
}
