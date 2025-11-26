# HuskySpend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     User's Web Browser                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Frontend UI (public/index.html)              │  │
│  │                                                            │  │
│  │  1. File Upload Component                                 │  │
│  │     - CSV file selector                                   │  │
│  │     - Raw text textarea                                   │  │
│  │                                                            │  │
│  │  2. Results Display                                       │  │
│  │     - Current balance                                     │  │
│  │     - Projected run-out date                             │  │
│  │     - Weekly budget recommendation                        │  │
│  │     - Category breakdown                                  │  │
│  │     - AI insights section                                 │  │
│  │                                                            │  │
│  │  3. Interactive Elements                                  │  │
│  │     - Toggle between CSV/text input                       │  │
│  │     - Real-time result updates                            │  │
│  │     - Loading indicators                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    HTTP Requests/Responses
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              Backend Server (server.js)                          │
│              Node.js + Express.js                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Express Routes                         │   │
│  │                                                          │   │
│  │  GET /health                                            │   │
│  │  └─ Returns: {"status":"ok"}                            │   │
│  │                                                          │   │
│  │  POST /upload                                           │   │
│  │  ├─ Accepts: CSV file OR raw text                       │   │
│  │  ├─ Processing:                                         │   │
│  │  │  ├─ CSV Parser (csv-parser library)                  │   │
│  │  │  ├─ Text Parser (regex)                              │   │
│  │  │  ├─ Data Validator                                   │   │
│  │  │  └─ Categorizer                                      │   │
│  │  └─ Returns: Parsed transactions + analytics            │   │
│  │                                                          │   │
│  │  POST /analyze                                          │   │
│  │  ├─ Accepts: Analysis data + current balance            │   │
│  │  ├─ Processing:                                         │   │
│  │  │  ├─ Data formatter                                   │   │
│  │  │  ├─ Prompt builder                                   │   │
│  │  │  ├─ Claude API call                                  │   │
│  │  │  └─ Response processor                               │   │
│  │  └─ Returns: AI insights + analysis metadata            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Processing Modules                         │   │
│  │                                                          │   │
│  │  1. CSV Parser Module                                   │   │
│  │     - Uses: csv-parser npm package                      │   │
│  │     - Input: Buffer (CSV file)                          │   │
│  │     - Output: Array of transaction objects              │   │
│  │     ├─ {date, merchant, amount, balance}                │   │
│  │     └─ Array length: 10-100+ transactions               │   │
│  │                                                          │   │
│  │  2. Text Parser Module                                  │   │
│  │     - Uses: Regex pattern matching                      │   │
│  │     - Input: Plain text string                          │   │
│  │     - Pattern: /(\d{1,2}\/\d{1,2}\/\d{2,4}) (.+?) (.+)/│   │
│  │     - Output: Array of transactions (if matches)        │   │
│  │                                                          │   │
│  │  3. Transaction Categorizer                             │   │
│  │     - Algorithm: Keyword matching                       │   │
│  │     - Categories: Coffee, Snacks, Market, Meals         │   │
│  │     - Fallback: "other"                                 │   │
│  │     - Adds "category" field to each transaction         │   │
│  │                                                          │   │
│  │  4. Analytics Engine                                    │   │
│  │     - Calculates:                                       │   │
│  │       ├─ Total spent                                    │   │
│  │       ├─ Weekly average                                 │   │
│  │       ├─ Category breakdown                             │   │
│  │       ├─ Weeks passed/remaining                         │   │
│  │       └─ Projected run-out week                         │   │
│  │                                                          │   │
│  │  5. Claude API Integration                              │   │
│  │     - Uses: @anthropic-ai/sdk                           │   │
│  │     - Model: claude-3-5-sonnet-20241022                 │   │
│  │     - Max tokens: 1024                                  │   │
│  │     - Prompt type: Structured financial advice          │   │
│  │     - Response: AI-generated recommendations            │   │
│  │                                                          │   │
│  │  6. Data Validator                                      │   │
│  │     - Validates:                                        │   │
│  │       ├─ Required fields present                        │   │
│  │       ├─ Numeric values are numbers                     │   │
│  │       ├─ Dates are parseable                            │   │
│  │       └─ Merchants are non-empty strings                │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬──────────────────────────────────┘
                              │
                   Anthropic API Call (HTTPS)
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│            Anthropic Claude API (Cloud)                        │
│            https://api.anthropic.com/v1/messages              │
│                                                               │
│  Request Structure:                                           │
│  ├─ Model: claude-3-5-sonnet-20241022                         │
│  ├─ Max tokens: 1024                                          │
│  ├─ Messages:                                                 │
│  │  └─ Role: user                                             │
│  │  └─ Content: Structured financial analysis prompt         │
│  │                                                            │
│  Claude Processing:                                           │
│  ├─ Read spending data                                        │
│  ├─ Analyze patterns                                          │
│  ├─ Reason about sustainability                              │
│  ├─ Generate 3-5 specific recommendations                    │
│  ├─ Format response in student-friendly language             │
│  └─ Return as text (with ~1-2s latency)                       │
│                                                               │
│  Response Structure:                                          │
│  └─ content[0].text: AI-generated advice                      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. CSV Upload Flow

```
User Browser
    │
    ├─ Select CSV file
    ├─ Set balance ($200)
    ├─ Set weeks remaining (10)
    │
    └─► POST /upload (FormData with file)
            │
            ├─ Read file buffer
            ├─ Parse with csv-parser
            │   Date,Merchant,Amount,Balance
            │   11/20/2024,Starbucks,$5.50,244.50
            │   11/21/2024,Market,$22.50,222.00
            │   ...
            │
            ├─ Validate each row
            ├─ Create transaction objects
            ├─ Categorize each transaction
            │   {date, merchant, amount, balance, category}
            │
            ├─ Calculate analytics
            │   ├─ totalSpent: $246.48
            │   ├─ weeklyAverage: $82.16
            │   ├─ categoryBreakdown: {...}
            │   └─ weeksRemaining: 7
            │
            └─ Response (JSON)
                {
                  success: true,
                  transactionCount: 20,
                  analysis: { ... }
                }
                    │
                    └─► Frontend renders results
                        ├─ Balance: $250.00
                        ├─ Weekly average: $82.16
                        ├─ Categories breakdown
                        └─ Send to /analyze endpoint
```

### 2. AI Analysis Flow

```
Frontend (has analysis data)
    │
    └─► POST /analyze (JSON)
            {
              analysis: {
                weeklyAverage: 82.16,
                categoryBreakdown: {...},
                weeksRemaining: 7
              },
              currentBalance: 250.00,
              targetDepletion: 7
            }
                │
                ├─ Format data for Claude
                ├─ Build comprehensive prompt:
                │
                │  "You are a friendly financial advisor.
                │   Current balance: $250
                │   Weeks remaining: 7
                │   Weekly average: $82.16
                │
                │   Provide:
                │   1. Run-out projection
                │   2. Recommended budget
                │   3. Top 3 overspending
                │   4. 3-5 strategies"
                │
                └─► Claude API Call
                        │
                        ├─ Model processes prompt
                        ├─ Generates analysis
                        └─ Returns advice (~1-2s)
                            │
                            "You're on track to run out in Week 3.
                             Reduce spending by $10/week...

                             Top money savers:
                             1. Starbucks: reduce to 2x/week (-$8)
                             2. Markets: meal prep (-$30)
                             3. Vending: eliminate (-$3)

                             You can make it! 💪"
                            │
                            └─► Response (JSON)
                                {
                                  success: true,
                                  insights: "[Claude text]",
                                  analysis: {...}
                                }
                                    │
                                    └─► Frontend renders
                                        ├─ Displays insights
                                        ├─ Updates projections
                                        └─ Shows recommendations
```

### 3. Text Parsing Flow

```
User pastes:
"11/20/2024 Starbucks $5.50
 11/21/2024 District Market $22.50
 11/22/2024 Vending Machine $3.00"
    │
    └─► POST /upload (JSON: {text: "..."})
            │
            ├─ Split by newlines
            ├─ Apply regex to each line:
            │  /(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(.+?)\s+([-]?\$?\d+\.?\d*)/
            │
            ├─ Extract matches:
            │  - date: "11/20/2024"
            │  - merchant: "Starbucks"
            │  - amount: "5.50"
            │
            ├─ Create transaction objects
            ├─ Categorize
            ├─ Calculate analytics
            └─ Return same format as CSV
```

## Component Architecture

### Backend Components

```
server.js
├── Express App Setup
│   ├── CORS middleware
│   ├── JSON parser
│   ├── Static file serving
│   └── Route definitions
│
├── CSV Parser
│   ├── Buffer → Stream conversion
│   ├── csv-parser library
│   └── Promise wrapper
│
├── Text Parser
│   ├── String splitting
│   ├── Regex matching
│   └── Field extraction
│
├── Categorizer
│   ├── Keyword matching engine
│   ├── Category definitions
│   └── Fallback to "other"
│
├── Analytics Engine
│   ├── Spending calculation
│   ├─ Week calculation
│   ├─ Category aggregation
│   └─ Stats generation
│
├── Claude Integration
│   ├── Prompt builder
│   ├── API client setup
│   ├── Request formatting
│   ├─ Response parsing
│   └─ Error handling
│
└── Routes
    ├── GET /health
    ├── POST /upload
    └── POST /analyze
```

### Frontend Components

```
index.html (single file)
├── HTML Structure
│   ├── Header (branding)
│   ├── Upload section
│   │   ├── Mode toggle (CSV/Text)
│   │   ├── File input
│   │   ├── Textarea
│   │   └── Balance/weeks inputs
│   └── Results section
│       ├── Metrics display
│       ├── Category breakdown
│       └── AI insights
│
├── CSS Styles
│   ├── Layout (grid/flex)
│   ├── Colors (gradient purple)
│   ├── Animations (spinner, transitions)
│   ├── Responsive design (@media)
│   └── State styles (.active, .warning)
│
└── JavaScript Logic
    ├── Event listeners
    ├── API calls (fetch)
    ├── UI updates
    ├── Loading states
    └── Error handling
```

## Database Schema (None in MVP)

This MVP has **zero database**. All data is:
- Parsed in memory
- Processed in real-time
- Displayed to user
- Discarded (not persisted)

**Future:** Add PostgreSQL for user accounts and transaction history.

## API Schema

### Endpoint: POST /upload

**Request (CSV):**
```
FormData {
  file: <binary CSV file>
}
```

**Request (Text):**
```json
{
  "text": "11/20/2024 Starbucks $5.50\n11/21/2024 Market $22.50"
}
```

**Response:**
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

### Endpoint: POST /analyze

**Request:**
```json
{
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
}
```

**Response:**
```json
{
  "success": true,
  "insights": "[Claude-generated text advice]",
  "analysis": {
    "currentBalance": 250.00,
    "weeksRemaining": 7,
    "weeklyAverage": 82.16,
    "categoryBreakdown": {...},
    "projectedRunoutWeek": 3
  }
}
```

## Error Handling

```
┌─ Frontend Error
│  ├─ No file/text selected → "Please upload or paste data"
│  ├─ API fails → Display error message
│  └─ Network timeout → Retry with timeout indicator
│
└─ Backend Error
   ├─ CSV parse fail → "No valid transactions found"
   ├─ Missing fields → 400 Bad Request
   ├─ API key invalid → 500 with error message
   └─ Claude API fail → 500 with error details
```

## Security Considerations

- ✅ No SQL injection (no database)
- ✅ No XSS (using textContent, not innerHTML)
- ✅ API key in env variables (not in code)
- ✅ CORS enabled (configurable)
- ✅ Input validation on all uploads
- ✅ No sensitive data logged

## Scaling Strategy

**Current (MVP):**
- Single server instance
- In-memory processing
- No database

**Phase 2 (Add user accounts):**
- Add PostgreSQL database
- User authentication
- Transaction history storage
- Redis caching

**Phase 3 (Production):**
- Multi-server load balancing
- Advanced caching
- Rate limiting
- Request logging
- Error monitoring (Sentry)

---

For deployment architecture, see **DEPLOYMENT.md**
For testing details, see **TESTING.md**
