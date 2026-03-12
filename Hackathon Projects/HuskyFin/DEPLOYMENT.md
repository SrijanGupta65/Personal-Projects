# HuskySpend Deployment Guide

## Local Development

### Quick Start (1 minute)

```bash
# 1. Install dependencies
npm install

# 2. Create .env with your API key
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-...

# 3. Start server
npm start

# 4. Open browser
http://localhost:3000
```

### Using the Quick Start Script

```bash
chmod +x QUICK_START.sh
./QUICK_START.sh
```

## Production Deployment

### Option 1: Vercel (Recommended for hackathons)

**Advantages:** Free tier, instant deploys, auto-scaling

1. **Create Vercel account:**
   - Go to https://vercel.com/signup
   - Sign up with GitHub (recommended)

2. **Deploy the app:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Add environment variable:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY=sk-ant-...`
   - Redeploy: `vercel --prod`

### Option 2: Heroku

**Advantages:** Simple deployment, reliable

1. **Create Heroku account:**
   - Go to https://www.heroku.com/
   - Sign up and create new app

2. **Deploy:**
   ```bash
   npm install -g heroku
   heroku login
   heroku create huskyfin
   git push heroku main
   ```

3. **Set environment variable:**
   ```bash
   heroku config:set ANTHROPIC_API_KEY=sk-ant-...
   ```

### Option 3: Railway.app

**Advantages:** Good free tier, Python/Node support

1. Create account at https://railway.app
2. Connect GitHub repo
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy automatically

### Option 4: Docker Deployment

**Create Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t huskyfin .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... huskyfin
```

## Environment Variables

### Required
- `ANTHROPIC_API_KEY` - Your Anthropic API key
  - Get at: https://console.anthropic.com

### Optional
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production` for production

## API Rate Limiting

The Anthropic API has built-in rate limiting. For hackathon/demo:
- ✅ 100 requests/minute should be plenty
- ✅ 50-100 users simultaneously supported

For larger deployments, consider implementing caching:

```javascript
// Simple in-memory cache example
const analysisCache = new Map();

app.post('/analyze', async (req, res) => {
  const cacheKey = JSON.stringify(req.body);

  if (analysisCache.has(cacheKey)) {
    return res.json(analysisCache.get(cacheKey));
  }

  // ... perform analysis ...
  analysisCache.set(cacheKey, result);
  res.json(result);
});
```

## Monitoring

### Check Server Health

```bash
curl https://your-app.vercel.app/health
# Returns: {"status":"ok"}
```

### View Logs

**Vercel:**
```bash
vercel logs
```

**Heroku:**
```bash
heroku logs --tail
```

**Railway:**
- View in dashboard under "Logs" tab

## Performance Optimization

### Frontend
- Currently single HTML file → Already optimized
- Consider adding gzip compression (auto on Vercel/Heroku)

### Backend
- CSV parsing: ~100ms per file
- Claude API call: 1-2 seconds (API dependent)
- Total response time: 2-3 seconds

### Scaling
For high traffic:
1. Add Redis caching (UpstashRedis has free tier)
2. Use CDN for static files
3. Database to store transaction history

## Troubleshooting Deployment

### Issue: "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API key not working
1. Verify key is set in environment variables
2. Check key format: should start with `sk-ant-`
3. Ensure no extra whitespace

### Issue: CORS errors in frontend
Add to server.js if needed:
```javascript
app.use(cors({
  origin: ['https://your-domain.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue: Slow Claude API responses
This is expected (API takes 1-2 seconds). Consider:
- Adding loading animation (✅ already done)
- Implementing request timeout of 30 seconds
- Using Claude API streaming for faster display

## Security Checklist

- ✅ API key in environment variables (not hardcoded)
- ✅ CORS properly configured
- ✅ Input validation on CSV/text parsing
- ✅ No sensitive data logged

For production, also consider:
- Rate limiting per IP
- Authentication for admin endpoints
- HTTPS only (auto on Vercel/Heroku)

## Monitoring & Analytics

### Option 1: Vercel Analytics
- Built-in, automatic
- View at https://vercel.com/dashboard

### Option 2: Sentry (Error tracking)
```bash
npm install @sentry/node @sentry/tracing
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

## Scaling Strategy

### Phase 1 (Hackathon)
- Single server instance
- In-memory caching
- Manual monitoring

### Phase 2 (Post-hackathon)
- Add database (PostgreSQL)
- Implement user accounts
- Add transaction history

### Phase 3 (Production)
- Multi-server deployment
- Redis caching
- Advanced monitoring
- API versioning

## Cost Estimation

### Free/Hackathon Tier
| Service | Cost | Limit |
|---------|------|-------|
| Vercel | Free | 100GB bandwidth/month |
| Heroku | Free | Up to 5 apps |
| Anthropic API | ~$0.003 per 1K tokens | Pay as you go |

For 100 users × 1000 tokens each = ~$0.30

### Estimated Monthly (100 active users)
- Hosting: Free (Vercel/Railway)
- API: ~$10-20 (1-2M tokens/month)
- Total: ~$10-20/month

## Next Steps

1. Deploy to Vercel/Heroku
2. Share live demo link
3. Collect user feedback
4. Iterate on features
5. Plan mobile app (React Native)
6. Integrate real Husky Card API (when available)

---

Need help? Check README.md or TESTING.md
