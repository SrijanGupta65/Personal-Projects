# Bridgeling Architecture

## System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Embeddable Widget (vanilla JS + Tailwind)               │   │
│  │  - Chat interface                                        │   │
│  │  - Auto-language detection (done server-side)           │   │
│  │  - Stream answers + citations                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           ↓ (JSON API)
┌─────────────────────────────────────────────────────────────────┐
│                        Backend API (Fastify)                     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ POST /api/query                                        │     │
│  │ ├─→ Claude Language Detection                         │     │
│  │ ├─→ Claude Query Translation (→ English)              │     │
│  │ ├─→ Claude Embeddings API                             │     │
│  │ ├─→ pgvector Similarity Search                        │     │
│  │ ├─→ Claude Answer Generation (user language)          │     │
│  │ └─→ Return Answer + Sources                           │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ POST /api/tenants - Create tenant                      │     │
│  │ GET  /api/tenants - List all tenants                   │     │
│  │ GET  /api/tenants/:id - Get tenant details             │     │
│  │ DELETE /api/tenants/:id - Delete tenant               │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
   ↓                    ↓                      ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Claude API  │  │   pgvector   │  │  Readability │
│              │  │  (Postgres)  │  │   Crawler    │
│ - Detect     │  │              │  │              │
│ - Translate  │  │ Vector index │  │ - HTML fetch │
│ - Embed      │  │ Similarity   │  │ - Parse      │
│ - Generate   │  │   search     │  │ - Chunk      │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Data Flow

### Query Processing Pipeline

```
1. User Query (any language)
   ├─ Language: "Où trouver des bourses?"
   └─ TenantID: "uw"

2. Claude: Language Detection
   ├─ Input: Raw query text
   ├─ Output: { language: "fr", confidence: 0.99 }
   └─ Cost: ~0.3¢ (200 input tokens)

3. Claude: Query Translation
   ├─ Input: "Où trouver des bourses?"
   ├─ Output: "Where can I find scholarships?"
   └─ Cost: ~0.3¢

4. Claude: Query Embedding
   ├─ Input: "Where can I find scholarships?"
   ├─ Vector: [0.123, -0.456, ..., 0.789]  (1024-dim)
   └─ Cost: ~0.1¢

5. pgvector: Similarity Search
   ├─ Query: embedding vector
   ├─ Database: SELECT chunks WHERE tenant_id=? ORDER BY similarity
   ├─ Results: [Chunk1 (sim=0.89), Chunk2 (sim=0.87), ...]
   └─ Cost: Free

6. Context Assembly
   ├─ Input: [Chunk1, Chunk2, ..., Chunk5]
   ├─ Output: Formatted context string with URLs
   └─ Sample:
      [1] URL: https://uw.edu/finances
      Scholarships are available through...

      [2] URL: https://uw.edu/aid
      Apply for financial aid...

7. Claude: Answer Generation
   ├─ System: "Respond in French. Use only context."
   ├─ User: "Où... [context]"
   ├─ Output: "Voici où trouver les informations..."
   └─ Cost: ~1¢ (2000 tokens)

8. Response Assembly
   ├─ Answer: "Voici où trouver les informations..."
   ├─ Language: "fr"
   ├─ Sources: [
   │    { url: "...", title: "..." },
   │    { url: "...", title: "..." }
   │  ]
   └─ Total cost: ~1.7¢ per query
```

**Total API Cost per Query: ~1-2 cents**

## Database Schema

```sql
-- Tenants (institutional clients)
tenants
├─ id (UUID PK)
├─ name (VARCHAR UNIQUE)
├─ allowed_domains (TEXT[])
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

-- Documents (crawled pages)
documents
├─ id (UUID PK)
├─ tenant_id (FK → tenants)
├─ url (VARCHAR, unique per tenant)
├─ title (VARCHAR)
├─ hash (VARCHAR) -- for change detection
├─ crawled_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

-- Chunks (embedded text segments)
chunks
├─ id (UUID PK)
├─ document_id (FK → documents)
├─ tenant_id (FK → tenants)
├─ text (TEXT) -- 500-800 tokens
├─ embedding (pgvector(1024))
├─ chunk_index (INT)
├─ url (VARCHAR)
├─ language (VARCHAR)
├─ metadata (JSONB)
└─ created_at (TIMESTAMP)

-- Queries (analytics)
queries
├─ id (UUID PK)
├─ tenant_id (FK → tenants)
├─ query (TEXT)
├─ detected_language (VARCHAR)
├─ response_time_ms (INT)
├─ sources_used (INT)
└─ created_at (TIMESTAMP)

-- Crawl Jobs (tracking)
crawl_jobs
├─ id (UUID PK)
├─ tenant_id (FK → tenants)
├─ status (VARCHAR) -- pending, in_progress, completed, failed
├─ started_at (TIMESTAMP)
├─ completed_at (TIMESTAMP)
├─ domains_to_scan (TEXT[])
├─ documents_scanned (INT)
├─ chunks_created (INT)
├─ error (TEXT)
└─ created_at (TIMESTAMP)
```

## Claude-Only LLM Pipeline

**No external translation APIs.** Claude handles all language operations:

### 1. Language Detection
```typescript
// backend/src/services/claude.ts:detectLanguage()
const message = await client.messages.create({
  model: CLAUDE_MODEL,
  system: "You are a language detection assistant. Respond with JSON only.",
  messages: [{ role: "user", content: `Detect the language: "${text}"` }],
  max_tokens: 100,
});
// Returns: { language: "fr", confidence: 0.99 }
```

### 2. Query Translation
```typescript
// backend/src/services/claude.ts:translateToEnglish()
const message = await client.messages.create({
  model: CLAUDE_MODEL,
  system: "Translate to English. Respond with translation only.",
  messages: [{ role: "user", content: text }],
  max_tokens: 500,
});
// Returns translated English text
```

### 3. Embedding Generation
```typescript
// backend/src/services/claude.ts:generateEmbedding()
const embedding = await client.beta.embeddings.create(
  { model: CLAUDE_MODEL, input: text },
  { headers: { "anthropic-beta": "embeddings-api-2024-09-26" } }
);
// Returns: vector of 1024 dimensions
```

### 4. Answer Generation
```typescript
// backend/src/services/claude.ts:generateAnswer()
const message = await client.messages.create({
  model: CLAUDE_MODEL,
  system: `You are Bridgeling. Answer in ${detectedLanguage}. Use only provided context.`,
  messages: [{
    role: "user",
    content: `Question: ${query}\n\nContext:\n${contextChunks}`
  }],
  temperature: 0.1,
  max_tokens: 800,
});
// Returns answer in user's original language
```

## Crawler Design

### BFS Crawl Strategy

```
Start URL: https://washington.edu/
  ├─ Fetch & parse (Readability)
  ├─ Extract links
  ├─ Chunk content (500-800 tokens, 80-token overlap)
  ├─ Generate embeddings
  ├─ Store in pgvector
  └─ Queue discovered links
    ├─ https://washington.edu/admissions
    ├─ https://washington.edu/financialaid
    ├─ https://washington.edu/housing
    └─ ...

Limits:
- Max 100 pages per crawl
- Max depth: 5
- Rate limit: 100ms between requests
- Change detection: Only re-embed if content hash changed
```

### Chunking Strategy

```
Full page text (10,000 characters)
  ↓
Split into chunks (500-800 tokens each)
  ├─ Chunk 0: tokens 0-600 (overlap: 0-80)
  ├─ Chunk 1: tokens 520-1120 (overlap with prev: 520-600)
  ├─ Chunk 2: tokens 1040-1640
  └─ ...

Each chunk stores:
- Document ID
- Chunk index
- Full text
- Embedding (1024-dim vector)
- Source URL
- Metadata (title, etc.)
```

## Frontend Widget

### Embedding

```html
<!-- One-line embed, any website -->
<script src="https://api.bridgeling.com/widget.js"
  data-tenant-id="uw"
  data-api-url="https://api.bridgeling.com"></script>

<!-- Or manual init -->
<script src="https://api.bridgeling.com/widget.js"></script>
<script>
  Bridgeling.init({
    tenantId: "uw",
    apiUrl: "https://api.bridgeling.com"
  });
</script>
```

### Widget Features

```
┌────────────────────────────┐
│  Bridgeling         ✕      │  ← Header with close button
├────────────────────────────┤
│                            │
│  You: "Where is the lib?"  │  ← User message (blue)
│                            │
│  Bot: "The library is..."  │  ← Assistant response (gray)
│        Sources: [...]      │     with citations
│                            │
├────────────────────────────┤
│ [Input]          [Send]    │  ← Input area
└────────────────────────────┘
```

- Detects dark/light mode
- Smooth animations
- Responsive design
- No external dependencies (vanilla TS)
- ~15KB minified + gzipped

## Performance Characteristics

### Latency Breakdown

```
Query → Response: 2-5 seconds

Language Detection:     500ms
Query Translation:      500ms
Embedding Generation:   300ms
Vector Search:          100ms
Answer Generation:     1500-3000ms
Network + JSON:        100-500ms
────────────────────────────
Total:                 3-5 seconds
```

### Throughput

- Single instance: ~10 concurrent queries
- Per-region backend: ~1000 QPS with auto-scaling
- Database: PostgreSQL standard limits ~500 QPS

### Storage

```
Per tenant with 10,000 documents:

Documents table:     ~10KB (metadata only)
Chunks table:        ~2-5GB (depends on page count)
  - 1 page ≈ 5 chunks
  - 50,000 chunks × 1024 dims × 4 bytes ≈ 200MB vectors
  - + text content ≈ 2-3GB total

Index overhead:      ~500MB (pgvector HNSW index)

Per-tenant storage:  ~3-5GB
Marginal cost:       ~300KB per page
```

## Security Considerations

### Current MVP

- ✗ No authentication
- ✗ No rate limiting
- ✗ No CORS restrictions
- ✓ SQL parameterized queries (SQL injection safe)
- ✓ No user input in system prompts (prompt injection safe)

### Production Checklist

- [ ] API key authentication
- [ ] CORS allowlist
- [ ] Rate limiting (per-tenant, per-IP)
- [ ] Request validation (Zod)
- [ ] HTTPS/TLS
- [ ] Database encryption at rest
- [ ] Audit logging
- [ ] DDoS protection (WAF)

## Scaling Strategy

### Horizontal Scaling

```
Load Balancer
  ├─ Backend 1 (Fastify)
  ├─ Backend 2 (Fastify)
  └─ Backend 3 (Fastify)
      ↓
    Shared Database (RDS)
    Shared Redis (ElastiCache)
    Shared S3 (widget CDN)
```

### Database Optimization

```sql
-- Indexes for search performance
CREATE INDEX idx_chunks_tenant_embedding
  ON chunks USING hnsw (embedding vector_cosine_ops)
  WHERE tenant_id = $1;

CREATE INDEX idx_documents_tenant_url
  ON documents(tenant_id, url);

CREATE INDEX idx_queries_created
  ON queries(created_at DESC);
```

### Caching Strategy

```
Widget Cache:
├─ Cloudflare/CDN: widget.js (1 week)
├─ Browser: widget.js (1 month)

API Cache (Redis):
├─ Tenant metadata: 1 hour
├─ Popular queries: 24 hours (optional)
├─ Vector search results: 5 minutes (optional)
```

## Cost Model

```
Monthly cost breakdown (10,000 queries/day):

Claude API:
├─ Language detection: $0.003 × 30k = $90
├─ Translation: $0.003 × 30k = $90
├─ Embeddings: $0.0001 × 30k = $3
└─ Answer generation: $0.01 × 30k = $300
   Subtotal: $483/month

Infrastructure:
├─ RDS (db.t3.medium): $50/month
├─ EC2 (t3.medium × 2): $60/month
├─ Redis (cache.t3.micro): $15/month
├─ CloudFront CDN: $20/month
└─ S3 + misc: $25/month
   Subtotal: $170/month

Total: ~$650/month for 10k queries/day
```

**Per-query cost: ~$0.65 ÷ 300k queries = $0.002 (0.2 cents)**

## Future Enhancements

1. **Real-time Sync**: Webhook-based content updates
2. **Canvas/SIS Integration**: Grade books, schedules
3. **Multi-modal**: Support for PDFs, images, videos
4. **Fine-tuning**: Tenant-specific answer styles
5. **Knowledge Graphs**: Entity extraction + linking
6. **Feedback Loop**: RLHF on user satisfaction
7. **Offline Mode**: Local embeddings fallback
