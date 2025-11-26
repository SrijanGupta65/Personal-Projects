#!/bin/bash

# Bridgeling Quick Start Script

echo "=========================================="
echo "Bridgeling - Quick Start"
echo "=========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Please install Docker Desktop."
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+."
  exit 1
fi

if ! command -v yarn &> /dev/null; then
  echo "❌ Yarn not found. Installing..."
  npm install -g yarn
fi

echo "✅ Prerequisites OK"
echo ""

# Start Docker services
echo "Starting PostgreSQL and Redis..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services..."
sleep 5

# Configure backend
if [ ! -f "backend/.env" ]; then
  echo "Creating backend/.env file..."
  cp backend/.env.example backend/.env
  echo "⚠️  Please edit backend/.env and add your ANTHROPIC_API_KEY"
  read -p "Press Enter when done..."
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
cd backend && yarn install
cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the backend:"
echo "  cd backend && yarn dev"
echo ""
echo "To build and serve the widget (in another terminal):"
echo "  cd frontend && yarn dev"
echo ""
echo "Then open:"
echo "  http://localhost:8000/demo.html"
echo ""
echo "=========================================="
