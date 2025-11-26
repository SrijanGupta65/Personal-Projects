# Bridgeling

No-code text → text AI assistant for institutional Q&A. Claude-only, multilingual, embeddable.

## Overview

Bridgeling is a lightweight, drop-in AI layer for any institution. It:

- **Crawls** public institutional websites
- **Embeds** content using Claude's embeddings API
- **Retrieves** relevant chunks via vector search (pgvector)
- **Generates** answers using Claude 3.5 Sonnet
- **Handles** multilingual queries → answers in user's language
- **Embeds** as a single-line JavaScript widget

## Architecture

```
User Query (any language)
  ↓
Claude: Language Detection + Translation to English
  ↓
Claude Embeddings API (canonical query)
  ↓
Vector Search (pgvector)
  ↓
Claude: Answer Generation (user's language)
  ↓
Widget: Display Answer + Sources
```

## Tech Stack

- **Backend**: Node.js + Fastify + TypeScript
- **Database**: Postgres + pgvector
- **Queue**: Redis + BullMQ (optional for MVP)
- **LLM**: Claude 3.5 Sonnet (100% of reasoning + generation)
- **Frontend**: Vanilla TypeScript (embeddable widget)
- **Crawler**: Cheerio + Readability + Node-Fetch

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ with pgvector
- Redis (optional)
- Anthropic API key

### Setup

1. **Clone and install**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with your API key and DB credentials
   ```

4. **Run backend**
   ```bash
   cd backend
   npm run dev
   ```

5. **Build widget**
   ```bash
   cd frontend
   npm run build
   ```

### API Usage

#### Create Tenant
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "uw",
    "allowedDomains": ["washington.edu"]
  }'
```

#### Query
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "uw",
    "query": "Donde encuentro informacion sobre becas?",
    "preferredLanguage": "auto"
  }'
```

### Widget Embed

```html
<script src="https://api.bridgeling.com/widget.js"
  data-tenant-id="uw"
  data-api-url="https://api.bridgeling.com"></script>
```

Or manual init:

```html
<script src="https://api.bridgeling.com/widget.js"></script>
<script>
  Bridgeling.init({
    tenantId: "uw",
    apiUrl: "https://api.bridgeling.com"
  });
</script>
```

## File Structure

```
bridgeling/
├── backend/
│   ├── src/
│   │   ├── api/           # Fastify route handlers
│   │   ├── services/      # Claude, embeddings, LLM
│   │   ├── db/            # Postgres, pgvector
│   │   ├── crawler/       # BFS crawl + ingestion
│   │   └── utils/         # Chunking, logging
│   ├── migrations/        # DB schema
│   └── package.json
├── frontend/
│   ├── src/widget.ts      # Embeddable widget
│   └── public/            # Built JS
├── shared/
│   └── types/             # TS interfaces
└── docker-compose.yml
```

## Development

### Language Detection

Claude detects language directly from user query text, returns ISO 639-1 code:

```typescript
const { language, confidence } = await detectLanguage(query);
```

### Query Translation

If `language !== "en"`, Claude translates query to English:

```typescript
const canonical = await translateToEnglish(query, language);
```

### Embeddings

Claude Embeddings API generates multilingual embeddings:

```typescript
const embedding = await generateEmbedding({ text: canonicalQuery });
```

### Vector Search

pgvector + similarity matching:

```typescript
const chunks = await searchChunks(tenantId, embedding, limit, threshold);
```

### Answer Generation

Claude generates answer in user's original language (passed in system prompt):

```typescript
const answer = await generateAnswer({
  systemPrompt: `Respond in ${detectedLanguage}`,
  userPrompt: `Answer based on:\n${context}`,
});
```

## Crawler

Crawls tenant's allowed domains, respects robots.txt, chunks content with overlap:

```typescript
await crawlDomain(tenantId, startUrl, {
  allowedDomains: ["uw.edu"],
  maxDepth: 5,
  rateLimit: 100,
});
```

- Tracks document hash for change detection
- Auto-re-embeds if content changes
- Limits crawl size to 100 pages per run

## Costs (MVP)

- Claude 3.5 Sonnet: ~$0.003 per query (language detect + translate + embed + generate)
- pgvector: Free (Postgres extension)
- No translation API costs

## Future Enhancements

- Canvas/SIS integration
- Real-time document sync
- Analytics dashboard
- Custom domain routing
- Webhook support for crawl completion
- Fine-tuned tenant-specific prompts
