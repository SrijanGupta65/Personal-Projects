# HuskySpend Testing Guide

## Setup for Testing

1. Make sure the server is running:
   ```bash
   npm start
   ```

2. The server should be available at `http://localhost:3000`

## Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok"}
```

## Test 2: Upload CSV File

```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@sample-transactions.csv"
```

Expected response includes:
```json
{
  "success": true,
  "transactionCount": 20,
  "analysis": {
    "weeksPassed": 3,
    "weeksRemaining": 7,
    "totalWeeks": 10,
    "totalSpent": 246.48,
    "weeklyAverage": 82.16,
    "categoryBreakdown": {
      "coffee": 38.50,
      "snacks": 5.50,
      "market": 170.00,
      "meals": 32.48
    },
    "transactions": [...]
  }
}
```

## Test 3: Parse Raw Text

```bash
curl -X POST http://localhost:3000/upload \
  -H "Content-Type: application/json" \
  -d '{
    "text": "11/20/2024 Starbucks $5.50\n11/21/2024 District Market $22.50\n11/22/2024 Vending Machine $3.00"
  }'
```

## Test 4: Get AI Insights

Use the analysis from Test 2:

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "analysis": {
      "weeklyAverage": 82.16,
      "categoryBreakdown": {
        "coffee": 38.50,
        "snacks": 5.50,
        "market": 170.00,
        "meals": 32.48
      },
      "weeksRemaining": 7
    },
    "currentBalance": 250.00,
    "targetDepletion": 7
  }'
```

Expected response:
```json
{
  "success": true,
  "insights": "[AI-generated personalized spending advice...]",
  "analysis": {
    "currentBalance": 250.00,
    "weeksRemaining": 7,
    "weeklyAverage": 82.16,
    "categoryBreakdown": {...},
    "projectedRunoutWeek": 3
  }
}
```

## Test 5: Web UI

1. Navigate to `http://localhost:3000` in your browser
2. Choose one of the input methods:
   - **CSV Upload**: Click the CSV option and select `sample-transactions.csv`
   - **Raw Text**: Click the Text option and paste sample transactions
3. Adjust "Current Balance" (default: $200)
4. Adjust "Weeks Remaining" (default: 10)
5. Click "Analyze My Spending"
6. View results:
   - Current balance
   - Projected run-out date
   - Recommended weekly budget
   - Spending by category
   - AI advisor insights

## Example Transaction Formats

### CSV Format
```
Date,Merchant,Amount,Balance
11/20/2024,Starbucks,5.50,245.50
11/21/2024,District Market,22.50,223.00
```

### Raw Text Format
```
11/20/2024 Starbucks $5.50
11/21/2024 District Market $22.50
11/22/2024 Vending Machine $3.00
```

## Troubleshooting

### Issue: "Cannot find module '@anthropic-ai/sdk'"
**Solution:** Run `npm install` again

### Issue: "ANTHROPIC_API_KEY not set"
**Solution:** Create `.env` file with your API key:
```
ANTHROPIC_API_KEY=sk-ant-...your-key...
PORT=3000
```

### Issue: "ECONNREFUSED" when making curl requests
**Solution:** Make sure the server is running (`npm start`)

### Issue: CSV not parsing
**Solution:** Verify the CSV has columns: `Date`, `Merchant`, `Amount`, `Balance`

### Issue: No AI insights
**Solution:** Check that:
- Your ANTHROPIC_API_KEY is valid
- You have API credits
- The server logs show Claude API calls

## Performance Notes

- CSV parsing: ~100ms for 100 transactions
- Claude API call: ~1-2 seconds (depends on API load)
- Total analysis time: ~2-3 seconds

## Testing Scenarios

### Scenario 1: Student on track
- Current balance: $300
- Weekly average: $25
- Weeks remaining: 12
- **Expected:** "On track to finish quarter"

### Scenario 2: Student at risk
- Current balance: $150
- Weekly average: $50
- Weeks remaining: 12
- **Expected:** "Running out in Week 3, reduce weekly spending"

### Scenario 3: Student in crisis
- Current balance: $50
- Weekly average: $75
- Weeks remaining: 8
- **Expected:** "Will run out in less than a week"

## Mobile Testing

The UI is responsive. Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Use browser DevTools responsive mode for quick testing.
