#!/bin/bash

echo "🎓 HuskySpend - Quick Start Setup"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your ANTHROPIC_API_KEY"
    echo "   Get one at: https://console.anthropic.com"
    echo ""
    echo "   Run this when ready:"
    echo "   npm start"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🚀 To start the server, run:"
echo "   npm start"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
