#!/bin/bash

# 🐳 Million Test Properties - Docker Quick Start Script
# This script provides an easy way to start the entire application with Docker

echo "🏠 Million Test Properties - Docker Deployment"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not available. Please install Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Function to show help
show_help() {
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services (default)"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  logs      Show logs from all services"
    echo "  status    Show status of all services"
    echo "  clean     Stop services and remove volumes (CAUTION: deletes database)"
    echo "  build     Rebuild all images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Start all services"
    echo "  $0 start             # Start all services"
    echo "  $0 logs              # Show logs"
    echo "  $0 status            # Check service status"
    echo ""
}

# Function to start services
start_services() {
    echo "🚀 Starting Million Test Properties with Docker..."
    echo ""
    
    # Use docker compose (newer) or docker-compose (legacy)
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    echo "📦 Building and starting services..."
    $COMPOSE_CMD up -d --build
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo ""
    echo "📊 Service Status:"
    $COMPOSE_CMD ps
    
    echo ""
    echo "🎉 Million Test Properties is starting up!"
    echo ""
    echo "📍 Access your application:"
    echo "   🌐 Frontend:  http://localhost:3000"
    echo "   🔧 Backend:   http://localhost:5000"
    echo "   🗄️  MongoDB:   localhost:27017"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    $0 logs"
    echo "   Check status: $0 status"
    echo "   Stop:         $0 stop"
    echo ""
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping Million Test Properties..."
    
    if docker compose version &> /dev/null; then
        docker compose down
    else
        docker-compose down
    fi
    
    echo "✅ Services stopped"
}

# Function to restart services
restart_services() {
    echo "🔄 Restarting Million Test Properties..."
    stop_services
    sleep 2
    start_services
}

# Function to show logs
show_logs() {
    echo "📋 Showing logs from all services..."
    echo "   Press Ctrl+C to exit logs"
    echo ""
    
    if docker compose version &> /dev/null; then
        docker compose logs -f
    else
        docker-compose logs -f
    fi
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    
    if docker compose version &> /dev/null; then
        docker compose ps
    else
        docker-compose ps
    fi
    
    echo ""
    echo "🔍 Health Check URLs:"
    echo "   Frontend:  curl -f http://localhost:3000"
    echo "   Backend:   curl -f http://localhost:5000/health"
}

# Function to clean everything
clean_services() {
    echo "🧹 Cleaning Million Test Properties..."
    echo "⚠️  WARNING: This will delete all database data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if docker compose version &> /dev/null; then
            docker compose down -v
        else
            docker-compose down -v
        fi
        echo "✅ Services stopped and volumes removed"
    else
        echo "❌ Operation cancelled"
    fi
}

# Function to build images
build_images() {
    echo "🔨 Building Million Test Properties images..."
    
    if docker compose version &> /dev/null; then
        docker compose build --no-cache
    else
        docker-compose build --no-cache
    fi
    
    echo "✅ Images built successfully"
}

# Main script logic
case "${1:-start}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_services
        ;;
    build)
        build_images
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