# HuskySpend 🎓

**UW Student Finance Copilot** — Your AI-powered dining plan coach that prevents you from running out of money mid-quarter.

## 🎯 What's the Problem?

UW students constantly run out of Husky Card / Dining Plan money before the quarter ends. HuskySpend solves this with:
- 📊 Real-time spending analysis
- 🤖 AI-powered predictions & recommendations
- 💰 Personalized pacing strategies

## ⚡ Quick Start

### Prerequisites
- Node.js 16+
- An Anthropic API key (get one at https://console.anthropic.com)

### Installation

1. **Clone/Download and navigate to the project:**
   ```bash
   cd HuskyFin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...your-key-here...
   PORT=3000
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open in your browser:**
   ```
   http://localhost:3000
   ```

## 📱 How to Use

### Option 1: Upload a CSV
1. Export your Husky Card transactions as a CSV (columns: `Date`, `Merchant`, `Amount`, `Balance`)
2. Upload the file
3. Enter your current balance and weeks remaining
4. Click "Analyze My Spending"

### Option 2: Paste Raw Text
1. Copy-paste transactions in this format:
   ```
   11/20/2024 Starbucks $5.50
   11/21/2024 District Market $22.50
   ```
2. Enter your current balance and weeks remaining
3. Click "Analyze My Spending"

### What You Get
- 💵 **Current Balance** - Your remaining dining dollars
- 📅 **Projected Run-Out Date** - When you'll hit $0 at current pace
- 📈 **Recommended Weekly Budget** - How much to spend/week to make it through
- 📊 **Spending Breakdown** - Coffee, snacks, markets, meals
- 🤖 **AI Advisor Insights** - Personalized strategies to stretch your plan

## 🏗️ Architecture

### Backend (Node.js + Express)
- **POST /upload** - Parse CSV or raw text transactions
- **POST /analyze** - Send spending data to Claude API for insights
- **GET /health** - Health check

### Frontend (Single-Page App)
- React-free vanilla JS
- Responsive design (mobile-first)
- Real-time UI updates

### Claude Integration
- Model: `claude-3-5-sonnet-20241022`
- Analyzes spending patterns
- Predicts run-out date
- Generates tactical recommendations

## 📊 Sample Data

Use `sample-transactions.csv` to test:
```bash
# The app will load and analyze 20 sample transactions
```

## 🧪 Testing the API Directly

### Upload CSV:
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@sample-transactions.csv"
```

### Analyze Spending:
```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "analysis": {
      "weeklyAverage": 22.50,
      "categoryBreakdown": {
        "coffee": 45.00,
        "snacks": 15.50,
        "market": 120.00,
        "meals": 65.75
      },
      "weeksRemaining": 10
    },
    "currentBalance": 250.00,
    "targetDepletion": 10
  }'
```

## 🚀 Hackathon Build Timeline

**Hour 1 — Build**
- ✅ Backend setup + CSV parser
- ✅ Claude API integration
- ✅ Frontend upload & display

**Hour 2 — Polish**
- ✅ UI refinement
- ✅ Pacing projections
- ✅ AI recommendation prompts

**Total: ~2 hours to working prototype**

## 🎮 Features

### MVP (Done)
- ✅ CSV/text upload
- ✅ Transaction categorization (coffee, snacks, market, meals)
- ✅ Spending analytics
- ✅ AI-powered insights
- ✅ Run-out date projection
- ✅ Recommended weekly budget
- ✅ Beautiful responsive UI

### Future (Post-Hackathon)
- Full Plaid bank integration
- Credit score optimization
- Budget notifications
- Mobile app (React Native)
- UW Husky Card official API integration
- Multi-currency support for intl students

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla JS, HTML5, CSS3
- **AI:** Anthropic Claude API
- **Parsing:** csv-parser
- **File Upload:** multer

## 📝 Claude Prompt (Used Internally)

The AI advisor uses this structured prompt to analyze spending:

```
You are a friendly financial advisor for UW students.
Analyze this student's spending pattern and provide:
1. Projection of when they'll run out of money
2. Recommended weekly budget to make it through the quarter
3. Top 3 overspending categories
4. 3-5 tactical strategies to stretch their plan

Be warm, encouraging, and specific.
```

## 🤝 Contributing

This is a hackathon project. Feel free to extend it!

**Ideas for improvements:**
- Better transaction categorization (ML)
- Notification system
- Monthly comparison graphs
- Social features (compare with other UW students)
- Integration with UW dining schedules

## 📧 Support

Need help?
- Check the [Claude Code documentation](https://github.com/anthropics/claude-code)
- Review the [Anthropic API docs](https://docs.anthropic.com)
- Check your `.env` file has a valid API key

## 📜 License

Built during a hackathon. Use freely!

---

**Made with ❤️ for UW Students** 🎓
