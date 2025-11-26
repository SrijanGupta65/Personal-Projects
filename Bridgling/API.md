# Bridgeling API Specification

## Base URL

```
http://localhost:3000
```

## Endpoints

### Tenant Management

#### Create Tenant

```http
POST /api/tenants
Content-Type: application/json

{
  "name": "uw",
  "allowedDomains": ["washington.edu", "uw.edu"]
}
```

**Response (201)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "uw",
  "allowed_domains": ["washington.edu", "uw.edu"],
  "created_at": "2024-11-25T10:00:00Z",
  "updated_at": "2024-11-25T10:00:00Z"
}
```

#### List Tenants

```http
GET /api/tenants
```

**Response (200)**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "uw",
    "allowed_domains": ["washington.edu"],
    "created_at": "2024-11-25T10:00:00Z",
    "updated_at": "2024-11-25T10:00:00Z"
  }
]
```

#### Get Tenant

```http
GET /api/tenants/{id}
```

**Response (200)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "uw",
  "allowed_domains": ["washington.edu"],
  "created_at": "2024-11-25T10:00:00Z",
  "updated_at": "2024-11-25T10:00:00Z"
}
```

#### Delete Tenant

```http
DELETE /api/tenants/{id}
```

**Response (204 No Content)**

### Query

#### Post Query

```http
POST /api/query
Content-Type: application/json

{
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "query": "Where can I find financial aid information?",
  "preferredLanguage": "auto"
}
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenantId` | string (UUID) | Yes | Tenant ID |
| `query` | string | Yes | User question in any language |
| `preferredLanguage` | string | No | ISO 639-1 language code or "auto" (default: "auto") |

**Response (200)**

```json
{
  "answer": "Financial aid information is available through the University's Financial Aid office. You can find details at the links below.",
  "language": "en",
  "sources": [
    {
      "url": "https://www.washington.edu/financialaid/",
      "title": "Financial Aid"
    },
    {
      "url": "https://www.washington.edu/students/",
      "title": "Student Resources"
    }
  ]
}
```

**Response Body**

| Field | Type | Description |
|-------|------|-------------|
| `answer` | string | Generated answer in user's detected language |
| `language` | string | ISO 639-1 code of detected user language |
| `sources` | array | Array of source documents with URLs and titles |

**Response (404)**

```json
{
  "error": "Tenant not found"
}
```

**Response (500)**

```json
{
  "error": "Failed to process query",
  "message": "Error details"
}
```

#### Query Pipeline

The `/api/query` endpoint performs the following steps:

1. **Language Detection**: Detects language of user query using Claude
   - Returns ISO 639-1 language code (e.g., "en", "fr", "es", "zh")

2. **Query Translation**: Translates query to English (canonical language)
   - Needed because vector index is in English

3. **Embedding Generation**: Creates embedding of English query
   - Uses Claude Embeddings API (multilingual capable)

4. **Vector Search**: Retrieves top 5 relevant chunks from pgvector
   - Filters by tenantId
   - Similarity threshold: 0.5

5. **Answer Generation**: Prompts Claude with context chunks
   - System prompt includes detected language
   - Claude generates answer directly in user's language
   - Max 800 tokens

6. **Source Extraction**: Gathers unique URLs from retrieved chunks

7. **Response**: Returns answer + sources + detected language

#### Example Requests

**English Query**

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "How do I apply for scholarships?",
    "preferredLanguage": "auto"
  }'
```

**Spanish Query**

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "¿Dónde encuentro información sobre becas?",
    "preferredLanguage": "auto"
  }'
```

**Chinese Query**

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "我如何申请奖学金？",
    "preferredLanguage": "auto"
  }'
```

## Health Check

```http
GET /health
```

**Response (200)**

```json
{
  "status": "ok"
}
```

## Error Handling

All errors return JSON with `error` and optionally `message` fields:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common error codes:

- `400`: Bad request (missing required fields)
- `404`: Resource not found (tenant doesn't exist)
- `500`: Internal server error

## Rate Limiting

Currently no rate limiting implemented. Implement based on:

- Per-tenant limits
- Per-IP limits
- Token-based quotas

## Authentication

Currently no authentication. Add based on requirements:

- API key header (`Authorization: Bearer ...`)
- JWT tokens
- Tenant-specific keys

## Analytics

Queries are logged to the `queries` table with:

- Tenant ID
- Query text
- Detected language
- Response time (ms)
- Number of sources used

Access via direct DB query (future API endpoint):

```sql
SELECT * FROM queries WHERE tenant_id = $1 ORDER BY created_at DESC;
```

## Webhooks (Future)

Planned endpoints:

- `POST /api/webhooks`: Register webhook for crawl completion
- Sends notification when tenant crawl completes

## Versioning

Current version: `0.1.0` (MVP)

Consider implementing header-based versioning:

```http
X-API-Version: 1.0
```

## CORS

CORS enabled for all origins. For production, restrict to:

```typescript
await app.register(fastifyCors, {
  origin: ["https://yourdomain.com"],
});
```
