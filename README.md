# DevOps 2026 - Microservices Platform

[![Tests & Linting](https://github.com/yourusername/devops_2026/workflows/Tests%20&%20Linting/badge.svg)](https://github.com/yourusername/devops_2026/actions)

A production-ready microservices platform built with Node.js, Express, MongoDB, Docker, and comprehensive monitoring.

## 🚀 Quick Start

```bash
# One-command startup
docker-compose up -d

# Run tests locally
make test

# Run linting
make lint

# View all services
make status
```

## 📋 Service Status Overview

| Service | Port | Status | Database | Tests | Linting | Coverage |
|---------|------|--------|----------|-------|---------|----------|
| **API** | 3000 | ✅ Running | MongoDB (myapp) | ✅ Pass | ✅ Pass | 80%+ |
| **Products** | 3001 | ✅ Running | MongoDB (products) | ✅ Pass | ✅ Pass | 80%+ |
| **MongoDB (Users)** | 27017 | ✅ Running | N/A | N/A | N/A | N/A |
| **MongoDB (Products)** | 27018 | ✅ Running | N/A | N/A | N/A | N/A |
| **RabbitMQ** | 15672 | ✅ Running | N/A | N/A | N/A | N/A |
| **Prometheus** | 9090 | ✅ Running | N/A | N/A | N/A | N/A |
| **Grafana** | 3002 | ✅ Running | N/A | N/A | N/A | N/A |

### Service Details

#### API Service
- **Purpose**: User management microservice
- **Port**: 3000 (internal), 3000 (host)
- **Endpoints**:
  - `GET /users` - List all users
  - `POST /users` - Create new user
  - `GET /metrics` - Prometheus metrics
  - `GET /health` - Health check
- **Database**: MongoDB `myapp` with seed data
- **Test Status**: ✅ 3 test cases passing
- **Code Quality**: ✅ ESLint enforcing standards

#### Products Service
- **Purpose**: Product catalog microservice
- **Port**: 3001 (internal), 3001 (host)
- **Endpoints**:
  - `GET /products` - List all products
  - `POST /products` - Create new product
  - `GET /metrics` - Prometheus metrics
  - `GET /` - Health check
- **Database**: MongoDB `products` (independent)
- **Test Status**: ✅ 2+ test cases passing
- **Code Quality**: ✅ ESLint enforcing standards

#### MongoDB Databases
- **Users DB**: Service name `mongo`, port 27017
  - Database: `myapp`
  - Seed: 3 sample users
  - Credentials: admin/admin
- **Products DB**: Service name `mongo-products`, port 27017 (exposed as 27018)
  - Database: `products`
  - Credentials: admin/admin

#### Message Queue (RabbitMQ)
- **Service**: `rabbitmq:3.12-management-alpine`
- **AMQP Port**: 5672
- **Management UI**: http://localhost:15672
- **Features**: Message persistence, health checks, durable queues
- **Status**: Infrastructure ready for inter-service messaging

#### Monitoring Stack
- **Prometheus**: Metrics collection and alerting
  - Scrape interval: 15 seconds
  - Targets: API (`/metrics`), Products (`/metrics`)
  - Port: 9090
- **Grafana**: Visualization dashboards
  - Admin: admin/admin
  - Auto-provisioned Prometheus datasource
  - Included dashboards: Request rates, response times, error rates
  - Port: 3002

## 📊 Architecture

```
┌─────────────────────────────────────────────────────┐
│           Docker Compose Network (bridge)            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐        ┌──────────────┐              │
│  │   API    │◄──────►│   MongoDB    │              │
│  │ :3000    │        │    (Users)   │              │
│  └──────────┘        └──────────────┘              │
│       ↓                                              │
│  ┌──────────┐        ┌──────────────┐              │
│  │ Products │◄──────►│   MongoDB    │              │
│  │ :3001    │        │  (Products)  │              │
│  └──────────┘        └──────────────┘              │
│       │                                              │
│       └──────────┐                                  │
│                  ↓                                  │
│            ┌──────────────┐                        │
│            │  RabbitMQ    │                        │
│            │  (Messaging) │                        │
│            └──────────────┘                        │
│                  ↓                                  │
│       ┌──────────────────────┐                    │
│       │   Prometheus         │                    │
│       │  (Metrics Collection)│                    │
│       └──────────────────────┘                    │
│                  │                                  │
│                  ↓                                  │
│       ┌──────────────────────┐                    │
│       │    Grafana           │                    │
│       │   (Dashboards)       │                    │
│       └──────────────────────┘                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 🧪 Testing & Code Quality

### Automated Testing
All tests run automatically on:
- ✅ Push to `main` branch
- ✅ Pull requests to `main`
- ✅ Workflow: `.github/workflows/ci-and-lint.yml`

**API Service Tests** (`api/__tests__/routes/users.test.js`):
- ✅ GET /users - Fetch users
- ✅ POST /users - Create user
- ✅ Error handling

**Products Service Tests** (`products/__tests__/routes/products.test.js`):
- ✅ GET /products - Fetch products
- ✅ POST /products - Create product

### Code Quality Checks
All code is linted against ESLint standards:
- ✅ Semicolon enforcement
- ✅ Single quote preference
- ✅ 2-space indentation
- ✅ No trailing spaces
- ✅ Consistent code style

### Coverage Requirements
- Minimum coverage threshold: **80%**
- Both services must meet threshold or build fails
- Coverage reports generated on each test run

## 📦 Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Make (optional, for Makefile commands)

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/devops_2026.git
cd devops_2026

# Install dependencies
make install
# OR
cd api && npm install
cd ../products && npm install

# Start services
make up
# OR
docker-compose up -d
```

## 🛠️ Available Commands

### Service Management
```bash
make up              # Start all services
make down            # Stop all services
make logs            # View service logs
make status          # Check service health
make build           # Build Docker images
```

### Development & Testing
```bash
make install         # Install dependencies
make test            # Run all tests
make lint            # Run ESLint checks
make test-coverage   # Generate coverage reports
```

### Cleanup
```bash
make clean           # Remove node_modules, volumes, and coverage
```

## 📍 Service Endpoints

### API Service
- **Base URL**: http://localhost:3000
- **Users**: `GET/POST http://localhost:3000/users`
- **Health**: `GET http://localhost:3000/health`
- **Metrics**: `GET http://localhost:3000/metrics` (Prometheus format)

### Products Service
- **Base URL**: http://localhost:3001
- **Products**: `GET/POST http://localhost:3001/products`
- **Health**: `GET http://localhost:3001/`
- **Metrics**: `GET http://localhost:3001/metrics` (Prometheus format)

### Monitoring
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002 (admin/admin)
- **RabbitMQ**: http://localhost:15672

## 🗄️ Database

### MongoDB Databases
Both services have independent MongoDB instances with persistent storage:

**Users Database**:
```bash
# Connect
docker exec -it devops_2026-mongo-1 mongosh

# Use database
use myapp

# View collections
db.getCollectionNames()
```

**Products Database**:
```bash
# Connect
docker exec -it devops_2026-mongo-products-1 mongosh

# Use database
use products

# View collections
db.getCollectionNames()
```

### Default Credentials
- **Username**: admin
- **Password**: admin

## 📡 Messaging

Both services have RabbitMQ connectivity configured:
- Queue infrastructure ready for inter-service messaging
- Durable queues with message persistence
- Health checks enabled
- Management UI available at http://localhost:15672

**Current Status**: Infrastructure deployed, messaging patterns ready for implementation.

## 📈 Monitoring & Observability

### Prometheus Metrics
Both services expose Prometheus metrics at `/metrics` endpoint:
- `http_requests_total` - Total HTTP requests by method and status
- `http_request_duration_ms` - Request duration histogram
- `process_*` - Node.js process metrics
- `v8_*` - V8 engine statistics

Collected every 15 seconds into Prometheus.

### Grafana Dashboards
Pre-configured dashboards monitor:
1. **Request Rate** - Requests per minute
2. **Response Time** - 95th percentile latency
3. **Total Requests** - Cumulative requests
4. **Error Rate** - 5xx responses over time

Data source: Prometheus
Update interval: 5s

## 🐳 Docker Architecture

### Multi-Stage Builds
Both services use optimized multi-stage Docker builds:
- **Build Stage**: Installs dependencies, compiles code
- **Runtime Stage**: Lean production image based on `node:20-alpine`
- **Security**: Non-root user execution, health checks

### Image Optimization
- Base: `node:20-alpine` (minimal, ~150MB)
- Size: ~200MB per service image
- Health checks included
- Automatic restart on failure

## 🔧 Development

### Local Setup
```bash
# Install dependencies
cd api && npm install
cd ../products && npm install

# Start with nodemon (auto-reload on file changes)
cd api && npm run dev
# In another terminal
cd products && npm run dev
```

### ESLint Configuration
Both services use the same ESLint configuration:
- **File**: `eslint.config.mjs`
- **Enforces**: Semicolons, single quotes, 2-space indent, no trailing spaces

```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Unit Tests
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 📝 CI/CD Pipeline

### GitHub Actions Workflows
**File**: `.github/workflows/ci-and-lint.yml`

**Triggers**:
- ✅ Push to `main` branch
- ✅ Pull requests to `main`

**Jobs**:
1. **API Service**: ESLint + Jest + Coverage (80% threshold)
2. **Products Service**: ESLint + Jest + Coverage (80% threshold)
3. **Status Report**: Summary of all checks

**On Failure**:
- Build marked as failed
- PR comments with test results
- Coverage threshold violations block merge

## 📚 Project Structure

```
devops_2026/
├── docker-compose.yml              # Main orchestration
├── docker-compose.override.yml      # Dev overrides
├── Makefile                         # Helper commands
├── README.md                        # This file
│
├── api/                             # Users microservice
│   ├── app.js                       # Express app
│   ├── dockerfile                   # Docker build
│   ├── package.json                 # Dependencies
│   ├── eslint.config.mjs            # Linting rules
│   ├── nodemon.json                 # Dev auto-reload
│   ├── bin/www                      # HTTP server
│   ├── routes/                      # Express routes
│   ├── services/                    # Business logic
│   └── __tests__/                   # Unit tests
│
├── products/                        # Products microservice
│   ├── app.js                       # Express app
│   ├── dockerfile                   # Docker build
│   ├── package.json                 # Dependencies
│   ├── eslint.config.mjs            # Linting rules
│   ├── nodemon.json                 # Dev auto-reload
│   ├── bin/www                      # HTTP server
│   ├── routes/                      # Express routes
│   ├── services/                    # Business logic
│   └── __tests__/                   # Unit tests
│
├── prometheus/                      # Monitoring
│   └── prometheus.yml               # Scrape config
│
├── grafana/                         # Dashboards
│   ├── grafana.ini                  # Config
│   └── provisioning/                # Auto-provisioning
│
└── .github/workflows/               # CI/CD
    └── ci-and-lint.yml             # GitHub Actions
```

## 🚨 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs api
docker-compose logs products

# Check network
docker network ls
```

### Database connection failed
```bash
# Verify MongoDB is running
docker exec devops_2026-mongo-1 mongosh --eval "db.adminCommand('ping')"

# Check connection string in code
# Should be: mongodb://admin:admin@mongo:27017/myapp
```

### Port already in use
```bash
# Find and kill process on port
lsof -i :3000  # Find process on port 3000
kill -9 <PID>  # Kill process

# Or change ports in docker-compose.override.yml
```

### Tests failing
```bash
# Run locally first
make test

# Check coverage
make test-coverage

# Run ESLint
make lint
```

## 📖 Additional Documentation

- [Docker Setup Guide](./DOCKER.md) - Detailed Docker configuration
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Architecture decisions

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test: `make lint && make test`
3. Commit and push: `git push origin feature/name`
4. Open pull request to `main`
5. GitHub Actions automatically runs tests and linting
6. Merge after all checks pass

## 📝 Notes

- All tests and linting run automatically on PR/push
- Coverage threshold is 80% for both services
- Service status is visible in this README
- Rollback any service individually via `docker-compose restart <service>`

---

**Last Updated**: $(date)
**Status**: ✅ All services operational and monitored
