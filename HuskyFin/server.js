const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new Anthropic();

// Parse CSV from buffer
function parseCSV(buffer) {
  const text = buffer.toString('utf-8');
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  if (lines.length < 2) {
    throw new Error('CSV must have header and at least 1 data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const dateIdx = headers.indexOf('date');
  const timeIdx = headers.indexOf('time');
  const merchantIdx = headers.indexOf('merchant');
  const amountIdx = headers.indexOf('amount');
  const categoryIdx = headers.indexOf('category');
  const balanceIdx = headers.indexOf('balance');

  if (dateIdx === -1 || merchantIdx === -1 || amountIdx === -1) {
    throw new Error('CSV missing required columns: Date, Merchant, Amount');
  }

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim());
    if (parts.length > Math.max(dateIdx, merchantIdx, amountIdx)) {
      results.push({
        date: parts[dateIdx],
        time: timeIdx >= 0 ? parts[timeIdx] : '',
        merchant: parts[merchantIdx],
        amount: parseFloat(parts[amountIdx]),
        category: categoryIdx >= 0 ? parts[categoryIdx] : 'other',
        balance: balanceIdx >= 0 ? parseFloat(parts[balanceIdx]) : 0
      });
    }
  }

  if (results.length === 0) {
    throw new Error('No valid transaction rows found in CSV');
  }

  return results;
}

// Parse raw text transactions
function parseRawText(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const transactions = [];

  lines.forEach(line => {
    // Try to extract date, merchant, amount
    const match = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})\s+(.+?)\s+([-]?\$?\d+\.?\d*)/);
    if (match) {
      transactions.push({
        date: match[1],
        merchant: match[2].trim(),
        amount: parseFloat(match[3].replace(/[$-]/g, '')),
      });
    }
  });

  return transactions;
}

// Categorize transactions
function categorizeTransactions(transactions) {
  const categories = {
    coffee: ['starbucks', 'espresso', 'coffee', 'café'],
    snacks: ['vending', 'snack', 'candy', 'chips', 'popcorn'],
    market: ['district market', 'grocery', 'safeway', 'whole foods', 'market'],
    meals: ['dining', 'restaurant', 'grill', 'pizza', 'burger', 'cafe'],
    other: []
  };

  return transactions.map(txn => {
    const merchant = (txn.merchant || '').toLowerCase();
    let category = 'other';

    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => merchant.includes(kw))) {
        category = cat;
        break;
      }
    }

    return { ...txn, category };
  });
}

// Calculate spending analytics with trends and patterns
function analyzeSpending(transactions) {
  const totalSpent = transactions.reduce((sum, txn) => sum + (parseFloat(txn.amount) || 0), 0);

  // Get current balance from last transaction
  const currentBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  const categoryBreakdown = {};
  const merchantBreakdown = {};
  const timeOfDayBreakdown = {};
  const weeklyBreakdown = {};

  // Process each transaction
  transactions.forEach(txn => {
    const amount = parseFloat(txn.amount) || 0;
    if (amount > 0) {
      // Category breakdown
      const category = txn.category || 'other';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
      categoryBreakdown[category] += amount;

      // Merchant frequency and spending
      if (!merchantBreakdown[txn.merchant]) {
        merchantBreakdown[txn.merchant] = { count: 0, total: 0 };
      }
      merchantBreakdown[txn.merchant].count += 1;
      merchantBreakdown[txn.merchant].total += amount;

      // Time of day pattern
      if (txn.time) {
        const hour = parseInt(txn.time.split(':')[0]);
        let timeSlot = 'Night';
        if (hour >= 5 && hour < 12) timeSlot = 'Morning';
        else if (hour >= 12 && hour < 17) timeSlot = 'Afternoon';
        else if (hour >= 17 && hour < 21) timeSlot = 'Evening';

        if (!timeOfDayBreakdown[timeSlot]) {
          timeOfDayBreakdown[timeSlot] = 0;
        }
        timeOfDayBreakdown[timeSlot] += amount;
      }

      // Weekly breakdown
      const date = new Date(txn.date);
      const weekNum = Math.floor((date.getDate() - date.getDay() - 1) / 7) + 1;
      const weekKey = `Week ${weekNum}`;
      if (!weeklyBreakdown[weekKey]) {
        weeklyBreakdown[weekKey] = 0;
      }
      weeklyBreakdown[weekKey] += amount;
    }
  });

  // Calculate days span
  let daySpan = 1;
  if (transactions.length > 1) {
    const dates = transactions.map(t => new Date(t.date).getTime()).filter(d => !isNaN(d));
    if (dates.length > 1) {
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      daySpan = Math.max(1, Math.ceil((maxDate - minDate) / (24 * 60 * 60 * 1000)) + 1);
    }
  }

  const weeklyAverage = (totalSpent / daySpan) * 7;

  // Get top merchants
  const topMerchants = Object.entries(merchantBreakdown)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, data]) => ({ name, count: data.count, total: data.total }));

  // Calculate weekly trend
  const weeklyTrend = Object.entries(weeklyBreakdown)
    .sort()
    .map(([week, amount]) => ({ week, amount }));

  return {
    currentBalance,
    totalSpent,
    daySpan,
    weeklyAverage,
    categoryBreakdown,
    merchantBreakdown: topMerchants,
    timeOfDayBreakdown,
    weeklyTrend,
    transactions
  };
}

// POST /upload - receives CSV or raw text
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    let transactions = [];

    if (req.file) {
      // Parse CSV file
      transactions = parseCSV(req.file.buffer);
    } else if (req.body.text) {
      // Parse raw text
      transactions = parseRawText(req.body.text);
    }

    if (transactions.length === 0) {
      return res.status(400).json({ error: 'No valid transactions found' });
    }

    // Categorize transactions
    const categorized = categorizeTransactions(transactions);

    // Analyze spending
    const analysis = analyzeSpending(categorized);

    res.json({
      success: true,
      transactionCount: categorized.length,
      analysis
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /analyze - sends to Claude for AI insights
app.post('/analyze', async (req, res) => {
  try {
    console.log('📊 /analyze endpoint called');
    console.log('Request body:', JSON.stringify(req.body).substring(0, 200));

    const { analysis, currentBalance, targetDepletion, weeksRemaining } = req.body;

    if (!analysis) {
      console.error('❌ Missing analysis data');
      return res.status(400).json({ error: 'Missing analysis data' });
    }

    const currentBalance_num = currentBalance || analysis.currentBalance || 0;
    const weeksRem = weeksRemaining || 10;
    const weeklyAverage = analysis.weeklyAverage || 0;
    const categoryBreakdown = analysis.categoryBreakdown || {};
    const merchantBreakdown = analysis.merchantBreakdown || [];
    const timeOfDayBreakdown = analysis.timeOfDayBreakdown || {};
    const weeklyTrend = analysis.weeklyTrend || [];

    console.log('✅ Data extracted:', { currentBalance_num, weeksRem, weeklyAverage });

    // Format merchant data
    const merchantsList = merchantBreakdown
      .slice(0, 5)
      .map(m => `- ${m.name}: ${m.count} visits, $${m.total.toFixed(2)} total`)
      .join('\n');

    // Format time of day data
    const timesList = Object.entries(timeOfDayBreakdown)
      .map(([time, amount]) => `- ${time}: $${amount.toFixed(2)}`)
      .join('\n');

    // Format weekly trend
    const trendList = weeklyTrend
      .map(w => `- ${w.week}: $${w.amount.toFixed(2)}`)
      .join('\n');

    // Calculate days until runout
    const daysUntilRunout = currentBalance_num > 0 ? Math.ceil((currentBalance_num / weeklyAverage) * 7) : 0;
    const weeksUntilRunout = Math.ceil(daysUntilRunout / 7);

    const prompt = `You are a financial advisor for UW students. Analyze this spending data and provide BRIEF, actionable advice. Keep response under 300 words.

SITUATION:
- Balance: $${currentBalance_num.toFixed(2)}
- Days until runout: ${daysUntilRunout}
- Weekly spending: $${weeklyAverage.toFixed(2)}
- Time period: ${analysis.daySpan} days

TOP SPENDING BY CATEGORY:
${Object.entries(categoryBreakdown)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)}`)
  .join(', ')}

TOP MERCHANTS:
${merchantBreakdown.slice(0, 3).map(m => `${m.name} (${m.count}x, $${m.total.toFixed(2)})`).join(', ')}

TOP SPENDING TIME: ${Object.entries(timeOfDayBreakdown).sort((a,b) => b[1]-a[1])[0]?.[0] || 'Unknown'} ($${Object.entries(timeOfDayBreakdown).sort((a,b) => b[1]-a[1])[0]?.[1].toFixed(2) || '0'})

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (short bullet points only):

🚨 STATUS: [URGENT/AT RISK/ON TRACK]

💰 TOP ISSUE: [One sentence about biggest spending problem]

✂️ QUICK FIXES (pick 2-3):
• [Specific action #1 with savings amount]
• [Specific action #2 with savings amount]
• [Specific action #3 with savings amount]

📊 REVISED BUDGET: $X/week recommended

Include ONLY the most important information. Be concise and specific with numbers.`;

    console.log('🤖 Calling Claude API...');
    console.log('Prompt preview:', prompt.substring(0, 300) + '...');

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log('✅ Claude API response received');

    const aiInsights = message.content[0].type === 'text' ? message.content[0].text : '';

    console.log('💡 Insights length:', aiInsights.length);

    res.json({
      success: true,
      insights: aiInsights,
      analysis: {
        currentBalance: currentBalance_num,
        weeksRemaining: weeksRem,
        weeklyAverage,
        daysUntilRunout,
        weeksUntilRunout,
        categoryBreakdown,
        merchantBreakdown,
        timeOfDayBreakdown
      }
    });
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎓 HuskySpend server running on http://localhost:${PORT}`);
});
