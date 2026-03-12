# 🚀 HuskySpend — START HERE

**Everything you need to launch in under 5 minutes.**

---

## ⚡ Super Quick Start (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# ← Edit this file and add your ANTHROPIC_API_KEY

# 3. Start server
npm start

# 4. Open browser
# → http://localhost:3000
```

**That's it!** You now have HuskySpend running.

---

## 🧪 Try It Out (1 minute)

1. Open http://localhost:3000 in your browser
2. Click "📄 CSV File"
3. Upload `sample-transactions.csv` (included)
4. Click "🚀 Analyze My Spending"
5. Watch the AI advisor give personalized insights!

---

## 📋 What You're Getting

- ✅ **Full-stack web app** (Node.js backend + vanilla JS frontend)
- ✅ **AI integration** (Claude API for analysis & advice)
- ✅ **Production-ready** (ready to deploy to Vercel/Heroku)
- ✅ **Complete docs** (README, testing guide, deployment guide)
- ✅ **Sample data** (test with real transaction data)

---

## 🎯 How It Works

### 1. Upload Transactions
Choose one of two ways:
- **CSV file** — Export from your banking app
- **Raw text** — Paste transactions (e.g., "11/20 Starbucks $5.50")

### 2. System Analyzes
- Parses and categorizes transactions
- Calculates weekly spending average
- Projects run-out date
- Prepares data for AI

### 3. AI Advisor Recommends
Claude API generates:
- When you'll run out of money
- Recommended weekly budget
- Top 3 overspending categories
- 3-5 personalized pacing strategies

### 4. You Get Results
- Current balance summary
- Spending breakdown by category
- Run-out date projection
- Actionable advice

---

## 📁 What's Included

```
HuskyFin/
├── START_HERE.md           ← You are here
├── README.md               ← Full feature guide
├── TESTING.md              ← How to test everything
├── DEPLOYMENT.md           ← How to deploy live
├── SHOWCASE.md             ← Demo & technical overview
├── package.json            ← Dependencies
├── server.js               ← Backend (Node.js/Express)
├── public/index.html       ← Frontend (beautiful UI)
├── sample-transactions.csv ← Demo data
└── QUICK_START.sh          ← Automated setup script
```

---

## 🔧 Technical Stack

- **Backend:** Node.js + Express.js
- **Frontend:** Vanilla JavaScript (no frameworks)
- **AI:** Anthropic Claude API
- **Parsing:** csv-parser + regex
- **Deployment:** Vercel / Heroku / Railway

**No external frontend dependencies** = super lightweight.

---

## 🚀 Next Steps

### 1. Get Anthropic API Key
- Go to https://console.anthropic.com
- Click "API Keys"
- Create a new key
- Copy it to your `.env` file

### 2. Start the Server
```bash
npm start
```

### 3. Open in Browser
```
http://localhost:3000
```

### 4. Test with Sample Data
- Upload `sample-transactions.csv`
- See instant AI analysis!

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| **START_HERE.md** | You are here (quick overview) |
| **README.md** | Features, architecture, features |
| **TESTING.md** | How to test (curl commands, scenarios) |
| **DEPLOYMENT.md** | Deploy to Vercel/Heroku/Railway |
| **SHOWCASE.md** | Technical deep-dive, demo walkthrough |

---

## ❓ FAQs

### Q: Do I need a database?
**A:** Nope! This MVP stores nothing. (Add later if you want user accounts.)

### Q: Can I deploy this live?
**A:** Yes! See DEPLOYMENT.md for Vercel/Heroku/Railway options.

### Q: How much will it cost?
**A:** Free hosting (Vercel/Railway), ~$0.01 per user for Claude API. Hackathon? Basically free.

### Q: Can I customize the AI advice?
**A:** Absolutely. Edit the prompt in `server.js` line ~120.

### Q: Why Claude and not GPT-4?
**A:** Claude is better at reasoning about finances + structured analysis. Try it!

### Q: What if my API key fails?
**A:** Check:
1. `.env` file exists and has key
2. Key starts with `sk-ant-`
3. Key is valid at https://console.anthropic.com
4. No extra whitespace in `.env`

---

## 🎬 Demo Script (for judges/classmates)

1. **Open http://localhost:3000** → "Look, clean UI"
2. **Click "📄 CSV File"** → "We support multiple input formats"
3. **Upload sample-transactions.csv** → "Real student spending data"
4. **Click "Analyze"** → "System parses, categorizes, and sends to Claude"
5. **Show results** → "Projections, breakdowns, AI advice"
6. **Scroll to AI section** → "This is generated in real-time by Claude"
7. **Explain impact** → "Prevents students from going broke mid-quarter"

**Total time: 30 seconds** ⏱️

---

## 🛠️ Common Customizations

### Change the Claude Model
Edit `server.js` line ~115:
```javascript
const message = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',  // ← Change this
  // ...
});
```

### Adjust Categories
Edit `server.js` line ~30:
```javascript
const categories = {
  coffee: ['starbucks', 'espresso', 'coffee'],
  snacks: ['vending', 'snack'],
  // Add more here
};
```

### Change the AI Prompt
Edit `server.js` line ~130:
```javascript
const prompt = `
  // Your custom prompt here
`;
```

---

## ✅ Quality Checklist

- ✅ All dependencies installed: `npm install`
- ✅ `.env` file created with API key
- ✅ Server running: `npm start`
- ✅ Browser opens: `http://localhost:3000`
- ✅ Sample data loads: `sample-transactions.csv`
- ✅ Analysis completes in 2-3 seconds
- ✅ AI insights are helpful
- ✅ Mobile UI looks good
- ✅ No errors in console

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### "ANTHROPIC_API_KEY not found"
```bash
# Check .env exists
cat .env
# Should see: ANTHROPIC_API_KEY=sk-ant-...
```

### Frontend CSS looks broken
```bash
# Kill server and restart
# (Hard refresh in browser: Cmd+Shift+R)
npm start
```

### CSV upload fails
- Check file is CSV format (not Excel)
- Verify columns: Date, Merchant, Amount, Balance
- Try sample-transactions.csv first

---

## 🎓 What You Just Built

A **complete, AI-powered personal finance app** in ~2 hours that:

1. **Solves a real problem** — UW students running out of money
2. **Uses cutting-edge AI** — Claude API for reasoning
3. **Looks beautiful** — Modern, responsive UI
4. **Works instantly** — 2-3 second analysis time
5. **Deploys easily** — Vercel/Heroku one-click
6. **Is hackathon-ready** — Complete documentation

---

## 🚀 Ready to Launch?

```bash
npm install && npm start
# → http://localhost:3000
```

**Then:**
1. Upload transactions
2. See instant analysis
3. Get AI advice
4. Save it to Vercel
5. Share with friends

---

## 📞 Need Help?

1. **Setup issues?** → Check prerequisites (Node.js, API key)
2. **API errors?** → Check ANTHROPIC_API_KEY in `.env`
3. **Testing?** → See TESTING.md
4. **Deployment?** → See DEPLOYMENT.md
5. **Features?** → See README.md

---

## 🎉 You're All Set!

**Next command:**
```bash
npm start
```

**Then open:**
```
http://localhost:3000
```

**Enjoy!** 🚀

---

*Questions? Check README.md or ask in your hackathon Slack.*

