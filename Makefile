.PHONY: help install test lint test-coverage clean build up down logs status

# Default target
help:
	@echo "DevOps 2026 - Microservices Platform"
	@echo "===================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make install        - Install dependencies for all services"
	@echo "  make test           - Run tests for both API and Products services"
	@echo "  make lint           - Run ESLint on both services"
	@echo "  make test-coverage  - Run tests with coverage reports"
	@echo "  make build          - Build Docker images"
	@echo "  make up             - Start all services with Docker Compose"
	@echo "  make down           - Stop all services"
	@echo "  make logs           - View logs from all services"
	@echo "  make status         - Show service health status"
	@echo "  make clean          - Remove node_modules, coverage, and docker volumes"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing API dependencies..."
	cd api && npm install
	@echo "📦 Installing Products dependencies..."
	cd products && npm install
	@echo "✅ Dependencies installed"

# Run tests
test:
	@echo "🧪 Running API tests..."
	cd api && npm test
	@echo "🧪 Running Products tests..."
	cd products && npm test
	@echo "✅ All tests passed"

# Run linting
lint:
	@echo "🔍 Linting API..."
	cd api && npm run lint
	@echo "🔍 Linting Products..."
	cd products && npm run lint
	@echo "✅ Linting complete"

# Test coverage
test-coverage:
	@echo "📊 Running API tests with coverage..."
	cd api && npm test -- --coverage
	@echo "📊 Running Products tests with coverage..."
	cd products && npm test -- --coverage
	@echo "✅ Coverage reports generated"

# Docker operations
build:
	@echo "🐳 Building Docker images..."
	docker-compose build

up:
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Services started"
	@echo ""
	@echo "Service endpoints:"
	@echo "  - API:              http://localhost:3000"
	@echo "  - Products:         http://localhost:3001"
	@echo "  - Prometheus:       http://localhost:9090"
	@echo "  - Grafana:          http://localhost:3002 (admin/admin)"
	@echo "  - RabbitMQ:         http://localhost:15672"
	@echo ""

down:
	@echo "⏹️  Stopping services..."
	docker-compose down
	@echo "✅ Services stopped"

logs:
	@echo "📋 Tailing logs (Ctrl+C to exit)..."
	docker-compose logs -f

status:
	@echo "📡 Service Health Status"
	@echo "========================"
	@echo ""
	@mkdir -p .health
	@echo "Checking API..."; \
	if curl -s http://localhost:3000/health > .health/api.json 2>&1; then \
		echo "✅ API: Running"; \
	else \
		echo "❌ API: Not responding"; \
	fi
	@echo "Checking Products..."; \
	if curl -s http://localhost:3001/ > .health/products.json 2>&1; then \
		echo "✅ Products: Running"; \
	else \
		echo "❌ Products: Not responding"; \
	fi
	@echo "Checking MongoDB (Users)..."; \
	if docker exec devops_2026-mongo-1 mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then \
		echo "✅ MongoDB (Users): Running"; \
	else \
		echo "❌ MongoDB (Users): Not responding"; \
	fi
	@echo "Checking MongoDB (Products)..."; \
	if docker exec devops_2026-mongo-products-1 mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then \
		echo "✅ MongoDB (Products): Running"; \
	else \
		echo "❌ MongoDB (Products): Not responding"; \
	fi
	@echo "Checking RabbitMQ..."; \
	if curl -s http://localhost:15672 > /dev/null 2>&1; then \
		echo "✅ RabbitMQ: Running"; \
	else \
		echo "❌ RabbitMQ: Not responding"; \
	fi
	@echo "Checking Prometheus..."; \
	if curl -s http://localhost:9090 > /dev/null 2>&1; then \
		echo "✅ Prometheus: Running"; \
	else \
		echo "❌ Prometheus: Not responding"; \
	fi
	@echo "Checking Grafana..."; \
	if curl -s http://localhost:3002 > /dev/null 2>&1; then \
		echo "✅ Grafana: Running"; \
	else \
		echo "❌ Grafana: Not responding"; \
	fi
	@echo ""

# Clean
clean:
	@echo "🧹 Cleaning up..."
	@rm -rf api/node_modules api/coverage
	@rm -rf products/node_modules products/coverage
	@rm -rf .health
	@docker-compose down -v 2>/dev/null || true
	@echo "✅ Cleanup complete"

# Local development - run tests and lint on file changes
dev-watch:
	@echo "👀 Watching for changes (Ctrl+C to exit)..."
	@echo "This would require nodemon or similar file watcher"
	cd api && npm run dev &
	cd products && npm run dev &
	wait

.PHONY: all
all: install lint test
