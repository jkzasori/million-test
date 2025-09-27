#!/bin/bash

# 🧪 Million Test Properties - E2E Testing Script
# This script sets up and runs end-to-end tests for the entire application

echo "🧪 Million Test Properties - E2E Testing Suite"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Function to show help
show_help() {
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start E2E test environment and run tests (default)"
    echo "  setup     Only setup E2E test environment"
    echo "  test      Run E2E tests (assumes environment is already running)"
    echo "  backend   Run only backend E2E tests"
    echo "  frontend  Run only frontend E2E tests"
    echo "  cleanup   Stop E2E environment and cleanup"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Setup environment and run all E2E tests"
    echo "  $0 setup             # Only setup test environment"
    echo "  $0 frontend          # Run only frontend E2E tests"
    echo "  $0 cleanup           # Cleanup test environment"
    echo ""
}

# Function to setup E2E environment
setup_e2e_environment() {
    echo "🚀 Setting up E2E test environment..."
    echo ""
    
    # Use docker compose (newer) or docker-compose (legacy)
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    echo "📦 Building and starting E2E services..."
    $COMPOSE_CMD -f docker-compose.e2e.yml up -d --build
    
    echo ""
    echo "⏳ Waiting for E2E services to be ready..."
    sleep 30
    
    echo ""
    echo "📊 E2E Service Status:"
    $COMPOSE_CMD -f docker-compose.e2e.yml ps
    
    echo ""
    echo "🎉 E2E test environment is ready!"
    echo ""
    echo "📍 E2E Environment URLs:"
    echo "   🌐 Frontend:  http://localhost:3001"
    echo "   🔧 Backend:   http://localhost:5001"
    echo "   🗄️  MongoDB:   localhost:27018"
    echo ""
}

# Function to run backend E2E tests
run_backend_e2e_tests() {
    echo "🧪 Running Backend E2E Tests..."
    echo ""
    
    cd backend/MillionTestApi
    
    # Set environment variables for E2E testing
    export ASPNETCORE_ENVIRONMENT=Testing
    export ConnectionStrings__DefaultConnection="mongodb://admin:million123@localhost:27018/MillionTestPropertiesE2E?authSource=admin"
    
    # Run E2E tests with specific filter
    dotnet test --filter "Category=E2E" --logger "console;verbosity=normal" --logger "trx;LogFileName=e2e-backend-results.trx"
    
    local backend_exit_code=$?
    cd ../..
    
    if [ $backend_exit_code -eq 0 ]; then
        echo "✅ Backend E2E tests passed"
    else
        echo "❌ Backend E2E tests failed"
    fi
    
    return $backend_exit_code
}

# Function to run frontend E2E tests
run_frontend_e2e_tests() {
    echo "🧪 Running Frontend E2E Tests..."
    echo ""
    
    cd frontend
    
    # Install Playwright browsers if not already installed
    if [ ! -d "node_modules/@playwright" ]; then
        echo "📦 Installing Playwright dependencies..."
        npm install
    fi
    
    # Install Playwright browsers
    npx playwright install
    
    # Set environment variables for E2E testing
    export PLAYWRIGHT_BASE_URL=http://localhost:3001
    export API_URL=http://localhost:5001
    
    # Run Playwright E2E tests
    npm run test:e2e
    
    local frontend_exit_code=$?
    cd ..
    
    if [ $frontend_exit_code -eq 0 ]; then
        echo "✅ Frontend E2E tests passed"
    else
        echo "❌ Frontend E2E tests failed"
    fi
    
    return $frontend_exit_code
}

# Function to run all E2E tests
run_all_e2e_tests() {
    echo "🧪 Running All E2E Tests..."
    echo ""
    
    local backend_result=0
    local frontend_result=0
    
    # Run backend E2E tests
    run_backend_e2e_tests
    backend_result=$?
    
    echo ""
    
    # Run frontend E2E tests
    run_frontend_e2e_tests
    frontend_result=$?
    
    echo ""
    echo "📊 E2E Test Results Summary:"
    echo "=========================="
    
    if [ $backend_result -eq 0 ]; then
        echo "✅ Backend E2E Tests: PASSED"
    else
        echo "❌ Backend E2E Tests: FAILED"
    fi
    
    if [ $frontend_result -eq 0 ]; then
        echo "✅ Frontend E2E Tests: PASSED"
    else
        echo "❌ Frontend E2E Tests: FAILED"
    fi
    
    echo ""
    
    if [ $backend_result -eq 0 ] && [ $frontend_result -eq 0 ]; then
        echo "🎉 All E2E tests passed successfully!"
        return 0
    else
        echo "💥 Some E2E tests failed. Check the logs above for details."
        return 1
    fi
}

# Function to cleanup E2E environment
cleanup_e2e_environment() {
    echo "🧹 Cleaning up E2E test environment..."
    
    if docker compose version &> /dev/null; then
        docker compose -f docker-compose.e2e.yml down -v
    else
        docker-compose -f docker-compose.e2e.yml down -v
    fi
    
    echo "✅ E2E environment cleaned up"
}

# Function to wait for service health
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be healthy..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo "✅ $service_name is healthy"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - waiting for $service_name..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to become healthy after $max_attempts attempts"
    return 1
}

# Main script logic
case "${1:-start}" in
    start)
        setup_e2e_environment
        
        # Wait for services to be healthy
        wait_for_service "Backend API" "http://localhost:5001/health"
        backend_health=$?
        
        wait_for_service "Frontend" "http://localhost:3001"
        frontend_health=$?
        
        if [ $backend_health -eq 0 ] && [ $frontend_health -eq 0 ]; then
            run_all_e2e_tests
            test_result=$?
            
            echo ""
            echo "🏁 E2E Testing Complete!"
            
            # Optionally cleanup after tests
            read -p "Do you want to cleanup the E2E environment? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                cleanup_e2e_environment
            fi
            
            exit $test_result
        else
            echo "❌ E2E environment setup failed. Cannot run tests."
            cleanup_e2e_environment
            exit 1
        fi
        ;;
    setup)
        setup_e2e_environment
        ;;
    test)
        run_all_e2e_tests
        ;;
    backend)
        run_backend_e2e_tests
        ;;
    frontend)
        run_frontend_e2e_tests
        ;;
    cleanup)
        cleanup_e2e_environment
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac