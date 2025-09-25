#!/bin/bash

# Million Test Properties - Quick Start Script
echo "🚀 Million Test Properties - Starting Application..."
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET Core SDK not found. Please install .NET Core 9 SDK"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running on port 27017"
fi

echo "✅ Prerequisites check complete"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -i:$1 &>/dev/null; then
        echo "⚠️  Port $1 is already in use. Please stop the service or use a different port."
        return 1
    fi
    return 0
}

# Check ports
echo "🔍 Checking ports..."
check_port 5000 || exit 1
check_port 3000 || exit 1
echo "✅ Ports 3000 and 5000 are available"
echo ""

# Setup and start backend
echo "🔧 Setting up backend..."
cd backend/MillionTestApi

echo "   📦 Restoring dependencies..."
dotnet restore --verbosity quiet

echo "   🔨 Building project..."
dotnet build --verbosity quiet

echo "   🧪 Running tests..."
TEST_RESULT=$(dotnet test --verbosity quiet --logger "console;verbosity=quiet" 2>&1)
if [ $? -eq 0 ]; then
    echo "   ✅ All tests passed"
else
    echo "   ❌ Some tests failed:"
    echo "$TEST_RESULT"
    exit 1
fi

echo "   🚀 Starting backend API..."
dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Setup and start frontend
cd ../../frontend
echo ""
echo "🔧 Setting up frontend..."

echo "   📦 Installing dependencies..."
npm install --silent

echo "   🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo ""
echo "🎉 Application started successfully!"
echo ""
echo "📱 Access your application:"
echo "   🌐 Frontend:     http://localhost:3000"
echo "   🔗 Backend API:  http://localhost:5000"  
echo "   📚 API Docs:     http://localhost:5000/swagger"
echo ""
echo "📋 Process IDs:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop both services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop this script (services will continue running)"

# Keep script running
while true; do
    sleep 1
done