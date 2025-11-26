# Bridgeling Quick Start Guide

## 5-Minute Setup

### 1. Prerequisites

```bash
# Check Node.js
node --version  # Should be 18+
npm --version   # Should be 9+

# Check Docker
docker --version
docker-compose --version
```

### 2. Start Infrastructure

```bash
docker-compose up -d

# Verify services are running
docker-compose ps
```

This starts:
- PostgreSQL with pgvector (port 5432)
- Redis (port 6379)

### 3. Configure Backend

```bash
cd backend
cp .env.example .env

# Edit .env with your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE
```

### 4. Install & Run Backend

```bash
npm install

# Initialize database schema
npm run migrate

# Start dev server
npm run dev
```

Backend should be running at `http://localhost:3000`

### 5. Build Widget (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

Widget will be served at `http://localhost:8000`

### 6. Test It

**Create a tenant:**

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "uw",
    "allowedDomains": ["washington.edu"]
  }'
```

Copy the returned `id`.

**Send a query:**

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "YOUR-TENANT-ID",
    "query": "Where can I find financial aid?",
    "preferredLanguage": "auto"
  }'
```

You should get back an answer with sources.

**View the widget demo:**

Open http://localhost:8000/demo.html in your browser. Click "Initialize Widget" to see the chat interface.

## Architecture Overview

```
User (any language)
    ↓
Bridgeling Widget (vanilla JS)
    ↓ POST /api/query
Backend API (Fastify)
    ├→ Claude: Detect language + translate
    ├→ Claude Embeddings: Generate embedding
    ├→ pgvector: Vector search
    ├→ Claude: Generate answer in user's language
    ↓
Widget: Display answer + sources
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Fastify server + routes |
| `backend/src/services/claude.ts` | All Claude API calls |
| `backend/src/db/postgres.ts` | Database setup & queries |
| `backend/src/db/vector.ts` | Vector search (pgvector) |
| `backend/src/crawler/crawler.ts` | BFS crawl + ingestion |
| `frontend/src/widget.ts` | Embeddable chat widget |
| `shared/types/index.ts` | Shared TypeScript types |

## Next Steps

### 1. Add Institutional Content

Crawl and embed your institution's website:

```typescript
// In backend, create a crawl endpoint or run manually:
import { crawlDomain } from "./crawler/crawler";

await crawlDomain("YOUR-TENANT-ID", "https://washington.edu", {
  allowedDomains: ["washington.edu"],
  maxDepth: 5,
  rateLimit: 100,
});
```

**Note**: Crawler needs `node-fetch`, `jsdom`, and `readability-js`. Add to package.json if missing:

```json
{
  "node-fetch": "^3.4.0",
  "jsdom": "^23.0.1",
  "@mozilla/readability": "^0.4.4"
}
```

### 2. Embed Widget on Your Site

```html
<!-- Add one line to your site -->
<script src="https://api.bridgeling.com/widget.js"
  data-tenant-id="uw"
  data-api-url="https://api.bridgeling.com"></script>
```

### 3. Customize Colors/Behavior

Edit `frontend/src/widget.ts`:
- Lines 60-150: CSS styles (change gradient colors, sizes)
- Lines 200+: JavaScript initialization logic
- Line 300: Auto-open behavior

### 4. Deploy

See `DEPLOYMENT.md` (coming soon) for:
- Docker containerization
- Vercel/Heroku deployment
- AWS Lambda setup
- Custom domain routing

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix**: Ensure PostgreSQL is running:

```bash
docker-compose ps  # Check if postgres is up
docker-compose logs postgres  # See logs
```

### ANTHROPIC_API_KEY not found

```
Error: Missing ANTHROPIC_API_KEY environment variable
```

**Fix**: Create `.env` file in `backend/` with your key:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-YOUR-KEY" > backend/.env
```

### Widget not loading

Check browser console for errors. Common issues:

1. CORS error → backend not running or wrong API URL
2. 404 on widget.js → frontend not running on 8000
3. Tenant not found → use correct tenant ID

### Slow answers

Claude inference takes 2-5 seconds. To debug:

```bash
# Check response time in curl output
time curl -X POST http://localhost:3000/api/query ...
```

Expected breakdown:
- Language detection: 0.5s
- Translation: 0.5s
- Embedding: 0.3s
- Vector search: 0.1s
- Answer generation: 2-3s

## Environment Variables Reference

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Database (defaults shown)
DATABASE_URL=postgresql://bridgeling:bridgeling-dev@localhost:5432/bridgeling

# Redis (optional for MVP)
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development

# Crawler
CRAWLER_MAX_DEPTH=5
CRAWLER_RATE_LIMIT=100
CRAWLER_USER_AGENT=Bridgeling-Bot/1.0

# Claude
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

## Performance Tips

1. **Batch queries**: Process multiple queries in parallel
2. **Cache embeddings**: Skip re-embedding unchanged chunks
3. **Limit chunk count**: Retrieve 5-10 chunks max for faster generation
4. **Index documents**: Ensure `chunks(tenant_id, document_id)` are indexed
5. **Connection pooling**: Postgres pool size = (CPU cores * 2) + 1

## Cost Estimates (Monthly)

For 1,000 queries/day with avg 3,000 tokens each:

- Claude inference: ~$0.003/query × 30,000 = $90
- Database: Free (pgvector)
- Redis: Free (local) or ~$15 (AWS)
- Hosting: ~$10-50/month

**Total MVP cost: ~$100-150/month**

## Support

- Check `API.md` for endpoint reference
- Check `README.md` for architecture details
- Review logs: `docker-compose logs postgres`
- Test with `curl` before embedding widget

## Next: Production Deployment

Once MVP is working locally:

1. Set up RDS PostgreSQL (AWS/GCP/Azure)
2. Deploy backend (Railway, Render, Fly.io)
3. Deploy widget (Vercel, Cloudflare, S3)
4. Add authentication (API keys)
5. Set up monitoring (Sentry, LogRocket)
