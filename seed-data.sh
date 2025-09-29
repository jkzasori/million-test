#!/bin/bash

# Million Test Properties - Database Seeder Script
echo "🎯 Million Test Properties - Database Seeder"
echo "============================================"

# Check if MongoDB is running
if ! nc -z localhost 27017 2>/dev/null; then
    echo "❌ MongoDB is not running on localhost:27017"
    echo "   Please start MongoDB and try again"
    exit 1
fi

echo "✅ MongoDB connection verified"

# Check if .NET is available
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found. Please install .NET Core 9 SDK"
    exit 1
fi

echo "✅ .NET SDK verified"

# Run the data seeder
echo ""
echo "🚀 Starting data generation process..."
cd backend/DataSeeder

echo "📦 Restoring dependencies..."
dotnet restore --verbosity quiet

echo "🎲 Generating sample data..."
dotnet run

echo ""
echo "🎉 Database seeding completed!"
echo ""
echo "📊 Your database now contains:"
echo "   👥 1,000 property owners"  
echo "   🏘️  2,500 properties"
echo "   📸 ~8,600 property images"
echo "   📈 ~5,000 transaction records"
echo ""
echo "🌐 Test your application:"
echo "   Backend API: http://localhost:5001/api/properties"
echo "   Frontend:    http://localhost:3000"
echo "   API Docs:    http://localhost:5001/swagger"
echo ""
echo "🔍 Quick API tests:"
echo "   curl 'http://localhost:5001/api/properties?pageSize=5'"
echo "   curl 'http://localhost:5001/api/properties?name=Villa'"
echo "   curl 'http://localhost:5001/api/properties?minPrice=100000&maxPrice=500000'"