# Microservices Architecture & Services

## Overview

This is a complete microservices architecture with monitoring and dashboarding built on Docker. The system consists of:

- **2 Microservices** (API + Products) with independent databases
- **Message Queue** (RabbitMQ) for inter-service communication  
- **Monitoring** (Prometheus) for metrics collection
- **Dashboarding** (Grafana) for visualization
- **Full unit test coverage** for all services

## Services Breakdown

### 1. API Service (Port 3000)

**Purpose**: Main user management service
**Technology**: Node.js 20.11 + Express + MongoDB
**Database**: MongoDB (myapp database)

**Endpoints**:
- `GET /` - Home page
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /metrics` - Prometheus metrics

**Features**:
- ✅ GET and POST methods
- ✅ MongoDB integration
- ✅ Prometheus metrics export
- ✅ RabbitMQ messaging (for future inter-service communication)
- ✅ Unit tests for all endpoints
- ✅ Health checks
- ✅ Hot-reload in development mode (Nodemon)

### 2. Products Service (Port 3001)

**Purpose**: Secondary microservice for product management
**Technology**: Node.js 20.11 + Express + MongoDB
**Database**: MongoDB (products database - separate from API)

**Endpoints**:
- `GET /` - Service health check
- `GET /products` - Get all products
- `POST /products` - Create new product
- `GET /metrics` - Prometheus metrics

**Features**:
- ✅ GET and POST methods
- ✅ Independent MongoDB database
- ✅ Prometheus metrics export
- ✅ RabbitMQ messaging integration
- ✅ Unit tests
- ✅ Hot-reload in development mode
- ✅ Health checks

### 3. RabbitMQ (Port 5672, Management: 15672)

**Purpose**: Message queue for asynchronous inter-service communication

**Features**:
- Durable message queues
- Message persistence
- Health checks with diagnostic endpoints
- Management UI accessible at `http://localhost:15672`
- Credentials: guest/guest

**Usage Example**:
```javascript
// In API service: Publish order event
await publishMessage('order.created', { userId: 123, amount: 99.99 });

// In Products service: Subscribe to events
await subscribeToQueue('order.created', async (message) => {
  console.log('Order created:', message);
  // Process order, update inventory, etc.
});
```

### 4. Prometheus (Port 9090)

**Purpose**: Metrics collection and time-series database

**Features**:
- Scrapes metrics from API and Products services every 15 seconds
- Stores metrics in time-series format
- 15-second evaluation interval
- Data persistence via `prometheus-data` volume
- Web UI at `http://localhost:9090`

**Metrics Collected**:
- `http_requests_total` - Total HTTP requests by method, route, status
- `http_request_duration_ms` - Request duration histogram
- `process_*` - Node.js process metrics (memory, CPU, etc)
- `nodejs_*` - v8 JavaScript engine metrics

### 5. Grafana (Port 3002)

**Purpose**: Visualization and dashboarding for metrics

**Features**:
- Auto-provisioned Prometheus datasource
- Pre-configured monitoring dashboard
- Admin credentials: admin/admin
- Dashboard displays:
  - Request rate per minute
  - 95th percentile response time
  - Total requests count
  - Error rate (5xx responses)
- Volume persistence for dashboards and configuration

**Access**: http://localhost:3002

## How Services Communicate

### Database Architecture
```
┌─────────────────────────────────────────────────────────┐
│              Docker Network (devops_network)            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  API Service          Products Service                  │
│  (port 3000)          (port 3001)                       │
│      │                    │                              │
│      ▼                    ▼                              │
│  MongoDB #1           MongoDB #2                        │
│  (myapp)              (products)                         │
│  (port 27017)         (port 27017)                       │
│                                                         │
│              RabbitMQ (Message Queue)                    │
│              (port 5672)                                │
│                │                                        │
│      ┌─────────┴─────────┐                              │
│      │                   │                              │
│  API Posts Events   Products Listens                    │
│  (order created,    (updates inventory,                │
│   user registered)   recalculates stock)                │
│                                                         │
│              Prometheus (Metrics)                        │
│              (port 9090)                                │
│                │                                        │
│      ┌─────────┴──────────┐                             │
│      │                    │                             │
│  Scrapes API metrics Scrapes Products metrics           │
│  every 15 seconds                                       │
│                │                                        │
│                ▼                                        │
│           Grafana Dashboard                             │
│           (port 3002)                                   │
│           Visualizes metrics                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Service-to-Service Communication

**Asynchronous via RabbitMQ**:
- API publishes events to message queue
- Products service subscribes to topics
- Decoupled services - no direct HTTP calls needed
- Message persistence - no data loss if service is down

**Synchronous via Prometheus**:
- Each service exposes `/metrics` endpoint
- Prometheus scrapes metrics periodically
- Grafana queries Prometheus for visualization

## Database Strategy

### Two Independent Databases

**MongoDB #1 (Users/API Database)**:
- Container: `mongo`
- Port: 27017 (internal)
- Database: `myapp`
- Collections: `users`
- Data folder: `./db/`

**MongoDB #2 (Products Database)**:
- Container: `mongo-products`
- Port: 27017 (internal, exposed as 27018 in dev)
- Database: `products`
- Collections: `products`
- Data folder: `./db-products/`

**Why Separate Databases?**
- Microservices best practice: Each service owns its data
- Independent scaling: Can resize one DB without affecting other
- Technology freedom: Could swap MongoDB #2 for PostgreSQL later
- Failure isolation: Database problems don''t cascade

## Unit Tests

### API Service Tests
- File: `api/__tests__/routes/users.test.js`
- Coverage:
  - ✅ GET /users returns array
  - ✅ POST /users creates user
  - ✅ Invalid data handling

### Products Service Tests
- File: `products/__tests__/routes/products.test.js`
- Coverage:
  - ✅ GET /products returns array
  - ✅ POST /products creates product

## Quick Start Commands

```bash
# Start entire stack (with development overrides active)
docker-compose up

# Run production only (no hot-reload)
docker-compose -f docker-compose.yml up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f          # All services
docker-compose logs -f api      # Just API
docker-compose logs -f products # Just Products
docker-compose logs -f prometheus # Just Prometheus
docker-compose logs -f grafana   # Just Grafana

# Run tests (build images first)
docker-compose build
docker-compose exec api npm test
docker-compose exec products npm test

# Stop services
docker-compose down             # Stop, keep volumes
docker-compose down -v          # Stop, remove volumes

# Access services
API:         http://localhost:3000/users
Products:    http://localhost:3001/products
RabbitMQ:    http://localhost:15672
Prometheus:  http://localhost:9090
Grafana:     http://localhost:3002
```

## Production Deployment Checklist

- [ ] Use `docker-compose.yml` only (no override)
- [ ] Set strong MongoDB credentials
- [ ] Configure CORS on services
- [ ] Set up reverse proxy (nginx) for API
- [ ] Enable HTTPS/TLS certificates
- [ ] Configure log aggregation
- [ ] Set up alerting rules in Prometheus
- [ ] Scale services: `docker-compose -f docker-compose.yml up --scale products=3`
- [ ] Set resource limits: memory and CPU constraints
- [ ] Configure backup strategy for MongoDB volumes
- [ ] Set up external monitoring alert notifications
- [ ] Implement rate limiting on API endpoints
- [ ] Enable request authentication/authorization

## Monitoring & Observability

Grafana Dashboard includes:
1. **Request Rate** - Requests per minute by endpoint
2. **Response Time** - 95th percentile latency in milliseconds
3. **Total Requests** - Cumulative request counter
4. **Error Rate** - 5xx errors over time

**Add Custom Alerts** in Prometheus:
```yaml
groups:
  - name: microservices
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
```

## Troubleshooting

**Services won''t start**:
- Check Docker daemon is running
- Verify no port conflicts: `netstat -ano | findstr :3000`
- Check logs: `docker-compose logs service-name`

**Cannot connect between services**:
- Services use service names: `api`, `mongo`, `rabbitmq` (not localhost)
- Verify network: `docker network ls`
- Test connectivity: `docker exec api ping mongo`

**Metrics not appearing in Grafana**:
- Check Prometheus targets: http://localhost:9090/targets
- Verify services export `/metrics` endpoint
- Check Prometheus scrape logs

**RabbitMQ connection failed**:
- Management UI: http://localhost:15672 (guest/guest)
- Check RabbitMQ logs: `docker-compose logs rabbitmq`
- Verify network connectivity between services
''@ | Out-File SERVICES.md -Encoding UTF8
cd 'c:\Users\Jesper\Documents\GitHub\devops_2026'; ls -d api products prometheus grafana db* --include-dirs 2>/dev/null | wc -l
cd 'c:\Users\Jesper\Documents\GitHub\devops_2026'; Get-ChildItem -Directory | Where-Object { $_.Name -match "(api|products|prometheus|grafana|db)" } | Select-Object Name
pwd
cd 'c:\Users\Jesper\Documents\GitHub\devops_2026\api'; @'
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.node,
    },
  },
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["warn"],
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "semi": ["error", "always"],
      "quotes": ["error", "single", { avoidEscape: true }],
      "indent": ["error", 2],
      "comma-dangle": ["error", "never"],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"]
    }
  }
];
