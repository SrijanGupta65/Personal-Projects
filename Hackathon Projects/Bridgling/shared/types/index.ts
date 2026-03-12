// Tenant management
export interface Tenant {
  id: string;
  name: string;
  allowedDomains: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Query request/response
export interface QueryRequest {
  tenantId: string;
  query: string;
  preferredLanguage?: string; // "auto" or ISO 639-1 code
}

export interface QueryResponse {
  answer: string;
  language: string;
  sources: Source[];
  reasoning?: string; // internal debug field
}

export interface Source {
  url: string;
  title: string;
}

// Document and chunk storage
export interface Document {
  id: string;
  tenantId: string;
  url: string;
  title: string;
  hash: string; // for change detection
  crawledAt: Date;
  updatedAt: Date;
}

export interface Chunk {
  id: string;
  documentId: string;
  tenantId: string;
  text: string;
  embedding: number[];
  chunkIndex: number;
  url: string;
  language: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// Crawl job
export interface CrawlJob {
  id: string;
  tenantId: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt?: Date;
  completedAt?: Date;
  domainsToScan: string[];
  documentsScanned?: number;
  chunksCreated?: number;
  error?: string;
}

// Language detection result
export interface LanguageDetection {
  language: string; // ISO 639-1 code
  confidence: number; // 0-1
}

// Internal LLM service types
export interface EmbeddingRequest {
  text: string;
  modelId?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    inputTokens: number;
  };
}

export interface LLMGenerationRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMGenerationResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}
