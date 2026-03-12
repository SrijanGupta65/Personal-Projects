# How to Run Bridgeling

## Prerequisites

- **Node.js 18+**
- **Docker** (for PostgreSQL + Redis)
- **Anthropic API Key** (free tier OK)
- **Yarn** (will be installed if needed)

## Step 1: Start Infrastructure

```bash
cd /Users/srijangupta/Library/Mobile\ Documents/com~apple~CloudDocs/Personal-Projects/Bridgling

docker-compose up -d
```

Verify:
```bash
docker-compose ps
```

You should see PostgreSQL and Redis running.

## Step 2: Configure Backend API Key

Edit the backend `.env` file:

```bash
open -a TextEdit backend/.env
```

Add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE
```

Save and close.

## Step 3: Install Backend Dependencies

```bash
cd backend
yarn install
```

This will install all Node dependencies (Fastify, Claude SDK, etc.)

## Step 4: Start Backend Server

```bash
cd backend
yarn dev
```

You should see:
```
Server running on port 3000
Database initialized
```

Leave this running in a terminal.

## Step 5: Build & Serve Frontend Widget (New Terminal)

```bash
cd frontend
yarn install
yarn dev
```

You should see the widget being compiled and served on `http://localhost:8000`

## Step 6: Test Everything

### Option A: Test with API directly

In a new terminal:
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "test",
    "query": "Hello, can you help?",
    "preferredLanguage": "auto"
  }'
```

You should get a JSON response with an answer.

### Option B: Test with Demo Widget

Open browser:
```
http://localhost:8000/demo.html
```

Click "Initialize Bridgeling Widget" button and try asking questions!

## Terminal Setup (Recommended)

You need 3 terminals running:

**Terminal 1: Backend**
```bash
cd backend
yarn dev
```

**Terminal 2: Frontend**
```bash
cd frontend
yarn dev
```

**Terminal 3: Testing**
```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/query ...

# Or just visit the demo
open http://localhost:8000/demo.html
```

## Troubleshooting

### "Cannot find module '@anthropic-ai/sdk'"

Dependencies didn't install. Run:
```bash
cd backend && yarn install
```

### "Error: connect ECONNREFUSED 127.0.0.1:5432"

PostgreSQL isn't running:
```bash
docker-compose logs postgres  # See error
docker-compose restart postgres
```

### "ANTHROPIC_API_KEY not found"

Add your API key to `backend/.env`:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-YOUR-KEY" >> backend/.env
```

### "Port 3000 already in use"

Change port:
```bash
PORT=3001 yarn dev
```

### Widget not loading at http://localhost:8000/demo.html

Frontend dev server isn't running:
```bash
cd frontend && yarn dev
```

### "tsx: command not found"

TypeScript runner didn't install:
```bash
cd backend && yarn add -D tsx
```

## Quick Commands

```bash
# Kill all Node processes
pkill -f node

# Restart Docker
docker-compose down && docker-compose up -d

# Clear npm/yarn cache
yarn cache clean

# Start fresh
rm -rf node_modules backend/node_modules frontend/node_modules
yarn install
```

## What's Running Where

| Service | Port | URL |
|---------|------|-----|
| Backend API | 3000 | http://localhost:3000/api/query |
| Frontend Widget Dev | 8000 | http://localhost:8000/widget.js |
| Demo Page | 8000 | http://localhost:8000/demo.html |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

## Next Steps

1. **Add Content**: Crawl your institutional website to add real content
2. **Create Tenants**: Set up tenants via `POST /api/tenants`
3. **Test Queries**: Send queries via `POST /api/query`
4. **Embed Widget**: Add `<script>` tag to your website

See `API.md` for full API documentation.
See `ARCHITECTURE.md` for system design.

## Getting Help

- Check `.env` is set up correctly
- Ensure all 3 services are running (backend, frontend, docker)
- Check logs: `docker-compose logs postgres`
- Test API with curl before using widget

**Good luck! 🚀**
