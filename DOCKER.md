# Docker & Docker Compose Guide

## Overview
This project uses Docker Compose to orchestrate two services:

### **MongoDB 7.0** - Database
- NoSQL database with persistent volume storage
- Credentials: `admin:admin`
- Accessible internally via service name: `mongo` (Docker DNS resolution)
- Port 27017: Internal only (production) / Exposed (development via override)

### **API** - Express.js Web Service
- **Image**: Node.js 20.11 Alpine (specific version tag for environment consistency)
- **Port**: 3000 - **Exposed externally** for browsers, clients, and third-party applications
- **Development**: Hot-reload enabled via Nodemon with source code watching
- **Production**: Optimized multi-stage build for minimal image size
- **Database Access**: Connects to MongoDB via service name `mongo` (automatic DNS resolution within Docker network)
- **Non-root user**: Runs as unprivileged `appuser` for security
- **Health checks**: Built-in HTTP health check verifies API availability

All services are configured to run with a single command!

## Quick Start

### 1. Start the entire stack
```bash
docker-compose up
```

This will:
- Build the API Docker image from `api/dockerfile` (Node.js 20.11-alpine)
- Start MongoDB service with credentials `admin:admin`
- Start the API service on port 3000 **accessible from outside** (browsers, mobile apps, third-party services)
- Create persistent volumes for MongoDB data
- Apply development overrides (Nodemon, hot-reload, exposed MongoDB port)

### 2. Access the application

**External Access (from browsers, clients, etc.):**
- **Web API**: http://localhost:3000
- API is exposed on port 3000 and accessible from any client

**Internal Access (within Docker network):**
- MongoDB accessible via: `mongodb://admin:admin@mongo:27017/myapp?authSource=admin`
- Service name `mongo` is automatically resolved by Docker's built-in DNS

**Development Tools (when override is active):**
- **MongoDB Admin**: `mongodb://admin:admin@localhost:27017/myapp?authSource=admin`
  - Connect with MongoCompass or mongosh
  - Port 27017 exposed for debugging

### 3. Test the API

```bash
# Get home page
curl http://localhost:3000/

# Get all users (returns JSON)
curl http://localhost:3000/users

# Create a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**From Remote/Third-Party Apps:**
```bash
# Same endpoints work from mobile apps, external services, etc.
curl http://<your-server-ip>:3000/users
```

## Common Commands

### Build without starting
```bash
docker-compose build
```

### Start in background (detached mode)
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs mongo

# Follow logs in real-time
docker-compose logs -f
```

### Stop all services (keeps data)
```bash
docker-compose down
```

### Stop and remove volumes (clean slate)
```bash
docker-compose down -v
```

### Rebuild from scratch
```bash
docker-compose up --build
```

### Open MongoDB shell (dev mode only)
MongoDB port is only exposed in development mode. To access MongoDB shell:
```bash
# Requires docker-compose.override.yml (automatically loaded in dev)
docker exec -it devops_mongodb mongosh -u admin -p admin --authenticationDatabase admin
```

Or connect directly from your local MongoDB client:
```
mongodb://admin:admin@localhost:27017/myapp?authSource=admin
```

### View and manage database files
Database files are stored in the local `./db/` folder:
```bash
# View database folder size
du -sh ./db

# Backup database (when containers are stopped)
cp -r ./db ./db.backup

# Restore database backup
rm -rf ./db
cp -r ./db.backup ./db
```

To completely reset the database:
```bash
docker-compose down
rm -rf ./db
docker-compose up  # MongoDB will reinitialize with seed data
```

## Development Mode

The project includes `docker-compose.override.yml` which is automatically loaded for development:

```bash
docker-compose up
```

**Development features enabled:**
- ✅ Hot reload - changes to source code automatically restart the API (via nodemon)
- ✅ MongoDB port exposed on 27017 for local client tools
- ✅ NODE_ENV set to 'development' for verbose logging

To use production mode only (ignore override):
```bash
docker-compose -f docker-compose.yml up
```

## Configuration

### Database Setup
MongoDB configuration includes:
- **Username**: `admin`
- **Password**: `admin`
- **Database**: `myapp`
- **Data Storage**: Persistent `./db` folder with volume mapping
- **Initialization**: Automatic seed data loaded from `docker-entrypoint-initdb.d/mongo-init.js`
- **Restart Policy**: `restart: always` - automatically restarts if container crashes
- **Port Access**: 
  - **Production** (docker-compose.yml): Port NOT exposed outside Docker network
  - **Development** (docker-compose.override.yml): Port 27017 exposed on localhost for client tools

**Folder Structure:**
```
project-root/
├── db/                           # Persistent database files (auto-created)
│   ├── diagnostic.data
│   ├── journal/
│   ├── local.ns
│   └── ... (MongoDB data files)
├── docker-entrypoint-initdb.d/
│   └── mongo-init.js            # Initialization script (runs once on first start)
├── docker-compose.yml
└── ...
```

### Seed Data
When MongoDB starts for the first time, `mongo-init.js` automatically:
- Creates the `myapp` database
- Creates a `users` collection
- Inserts 3 sample users (John Doe, Jane Smith, Bob Johnson)
- Creates a unique index on the `email` field

To view initial data:
```bash
curl http://localhost:3000/users
```

To add custom seed data, edit `docker-entrypoint-initdb.d/mongo-init.js` before first startup.

### Environment Variables
- `.env` - Contains default settings (MONGO_USER, MONGO_PASS, DB_NAME, PORT)
- `docker-compose.yml` - Defines services, networks, and volumes
- `docker-compose.override.yml` - Development-only overrides (optional)

### Changing Credentials
To change MongoDB credentials:
1. Edit `docker-compose.yml`:
   ```yaml
   environment:
     MONGO_INITDB_ROOT_USERNAME: newuser
     MONGO_INITDB_ROOT_PASSWORD: newpassword
   ```
2. Update API connection string if needed:
   ```yaml
   MONGO_URL: mongodb://newuser:newpassword@mongo:27017/myapp?authSource=admin
   ```
3. **Important**: Only edit before first run. For existing data, use MongoDB backup/restore.

### API Setup
The API is built with **Node.js 20.11 Alpine** and configured for both development and production:

**Dockerfile Features:**
- **Specific version tag**: `node:20.11-alpine` - ensures consistent environment across deployments
- **Multi-stage build**: Reduces final image size by separating build dependencies from runtime
- **Non-root user**: Runs as unprivileged `appuser` for enhanced security
- **Health checks**: Built-in HTTP endpoint verification (`GET http://localhost:3000`)
- **dumb-init**: Proper signal handling for graceful container shutdown
- **Labels**: Environment and version metadata for Docker inspection

**Development Mode (Nodemon):**
- **Configuration file**: `api/nodemon.json` - watches for code changes
- **Watch paths**: `./bin`, `./routes`, `./services`, `./app.js`
- **Hot-reload**: Automatically restarts API on file changes
- **Debug output**: Verbose logging enabled
- **Environment**: `NODE_ENV=development` for better debugging

**Nodemon Configuration** (`api/nodemon.json`):
```json
{
  "watch": ["./bin", "./routes", "./services", "./app.js"],
  "ignore": ["./coverage/**", "./**/*.test.js", "./**/*.spec.js", "./node_modules/**"],
  "env": { "NODE_ENV": "development" },
  "exec": "node -r dotenv/config",
  "script": "./bin/www",
  "ext": "js,json",
  "delay": 500,
  "verbose": true
}
```

**Database Connectivity:**
- **Service Name Access**: API connects to MongoDB using service name `mongo` (not `localhost`)
- **Docker DNS**: Docker automatically resolves `mongo` to the MongoDB container's IP within `devops_network`
- **Connection String**: `mongodb://admin:admin@mongo:27017/myapp?authSource=admin`
- **Connection Method**: Passed via `MONGO_URL` environment variable from `docker-compose.yml`
- **Network**: Both services share `devops_network` bridge for inter-service communication

**Scripts** (from `package.json`):
```bash
npm start    # Production: runs node ./bin/www
npm run dev  # Development: nodemon with dotenv and hot-reload
npm test     # Run Jest tests with coverage
npm run lint # ESLint code quality checks
```

### Ports
- **API**: 3000 (always exposed externally for browser, mobile, third-party apps)
- **MongoDB**: 27017 (internal network only in production, exposed in dev mode)

## API Access Patterns

The API on port 3000 is **exposed externally** to support various client architectures:

### Local Development (Localhost)
```bash
curl http://localhost:3000/users
```

### Browser/Frontend Running on Host Machine
```javascript
// JavaScript fetch from desktop browser
fetch('http://localhost:3000/users')
  .then(r => r.json())
  .then(data => console.log(data));
```

### Mobile App / Remote Client on Same Network
Replace `localhost` with your machine's IP address:
```bash
# Discover your machine IP
ipconfig getifaddr en0      # macOS
hostname -I                 # Linux
ipconfig                    # Windows

# Access from mobile device on same network
curl http://192.168.1.100:3000/users
```

### External/Third-Party Application
Point API requests to your server's public IP or domain:
```bash
# External third-party service calling your API
curl https://example.com:3000/users    # With your domain
curl http://203.0.113.45:3000/users    # With public IP
```

### From Inside Docker Network
Other Docker containers can access the API via service name:
```javascript
// Connection URL for other Docker services
mongodb://api:3000  // Using service name within devops_network
```

### Docker Compose Scenarios

**Single Machine Development:**
- Frontend on browser: `http://localhost:3000`
- Frontend on Docker container: `http://api:3000` (service name)

**Network Deployment:**
- Frontend on different machine: `http://<server-ip>:3000`
- Frontend app on cloud: `http://<domain>:3000` (with reverse proxy/load balancer)

### Security Considerations

**In Development:**
- ✅ Port 3000 exposed on localhost only
- ✅ MongoDB port exposed for debugging
- ✅ Verbose logging enabled
- ✅ Non-root user enforcement

**In Production:**
- ⚠️ Consider using a reverse proxy (nginx, HAProxy) in front of port 3000
- ⚠️ Implement API rate limiting to prevent abuse
- ⚠️ Use CORS (Cross-Origin Resource Sharing) policies if needed
- ⚠️ Require authentication for production endpoints
- ⚠️ Use HTTPS/TLS in production (set up reverse proxy with SSL certificate)

**Firewall Rules (Production):**
```bash
# Only expose port 3000 from trusted networks
# Deny direct internet access if possible
sudo ufw allow from 192.168.1.0/24 to any port 3000
```

## Troubleshooting

### "Cannot connect to MongoDB"
Check logs: `docker-compose logs mongo`
Ensure MongoDB service is healthy: `docker-compose ps`

### "Port 3000 already in use"
1. Change port in `docker-compose.yml`: `ports: ["3001:3000"]`
2. Or kill the existing process on port 3000

### "Database connection timeout"
Ensure MongoDB service is healthy before API connects:
```bash
docker-compose logs mongo
```
Look for "waiting for connections on port 27017"

### Changes not appearing with hot-reload
1. Verify `docker-compose.override.yml` is being used (should say so in startup logs)
2. Restart container: `docker-compose restart api`
3. Check file permissions are readable to container
4. Verify `api/nodemon.json` watch paths include your modified files

### "Cannot communicate with MongoDB from API"
The API connects to MongoDB using service name `mongo` (not `localhost`):
- ✅ Inside Docker: `mongo:27017` (service name resolution)
- ❌ Wrong: `localhost:27017` (would only work from host machine)
- Check: `docker-compose logs api` for connection errors
- Verify: `docker-compose ps` shows both `devops_api` and `devops_mongodb` as healthy

### API container keeps restarting
```bash
# Check logs for startup errors
docker-compose logs api

# Common issues:
# - Node.js syntax errors in code
# - Missing npm dependencies (try rebuild)
# - Port 3000 already in use on host
docker-compose up --build
```

### Nodemon not restarting on code changes
1. Verify development mode is active: `docker-compose logs api | grep "NODE_ENV"`
2. Should see: `NODE_ENV: development` and active nodemon process
3. Check if file is in watched paths (see `api/nodemon.json`)
4. Try hard reset: `docker-compose restart api`
5. Verify file is saved with proper line endings (Unix style, not Windows CRLF)

### "Port 3000 already in use" error
```bash
# Find process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Expose internal 3000 as external 3001
```

### API health check failing
- Verify API is responding: `curl http://localhost:3000/`
- Check logs: `docker-compose logs api`
- Health check runs every 30 seconds and retries 3 times with 5-second timeout
- Common causes: API crashes, port misconfig, slow startup

## Architecture

```
                                    Host Machine
                         (Windows/Linux/Mac)
                                    │
                        ┌──────────┴──────────┐
                        │                     │
                        ▼                     ▼
                  http://localhost:3000   (MongoDB: not exposed)
                        │
     ┌──────────────────────────────────────────────────────────┐
     │         Docker Bridge Network (devops_network)           │
     ├──────────────────────────────────────────────────────────┤
     │                                                          │
     │  ┌────────────────────┐        ┌──────────────────────┐ │
     │  │   MongoDB 7.0      │        │   Express API        │ │
     │  │  (devops_mongodb)  │        │   (devops_api)       │ │
     │  │                    │◄───────┤                      │ │
     │  │ Port: 27017        │        │ Port: 3000           │ │
     │  │ (internal only)    │        │ (exposed to host)    │ │
     │  │                    │        │                      │ │
     │  │ User: admin        │        │ Gets connection      │ │
     │  │ Pass: admin        │        │ string from env      │ │
     │  │                    │        │                      │ │
     │  │ Volumes:           │        │ Depends on: mongo    │ │
     │  │ - ./db → /data/db  │        │ Restart: auto        │ │
     │  │ Init script ran    │        │                      │ │
     │  │ Restart: always    │        │                      │ │
     │  │                    │        │                      │ │
     │  └────────────────────┘        └──────────────────────┘ │
     │          │                              │                │
     │          └─ Persistent data stored      └─ Depends on    │
     │                                            health check   │
     │                                                          │
     └──────────────────────────────────────────────────────────┘
                        │
                        ▼
              Host File System
              ./db/ folder
         (contains MongoDB data files
          automatically created on first run)
```

**Key Features:**
- ✅ MongoDB port 27017 NOT exposed outside Docker network (production secure)
- ✅ MongoDB port 27017 exposed in dev mode via `docker-compose.override.yml`
- ✅ API port 3000 always exposed for external access
- ✅ Data persists in `./db/` folder on host machine
- ✅ Automatic restart on crash (`restart: always`)
- ✅ Health checks ensure MongoDB is ready before API starts
- ✅ Seed data auto-loaded on first run from `docker-entrypoint-initdb.d/mongo-init.js`

## Production Considerations

For production deployment, you should:
1. Remove `docker-compose.override.yml` to disable hot-reload
2. Use `.env.production` with strong MongoDB credentials
3. Implement backup strategy for MongoDB volumes
4. Use reversed proxy (nginx) or load balancer in front
5. Configure health checks and auto-restart policies
6. Set resource limits (CPU, memory) in docker-compose

For example production setup:
```yaml
api:
  # ... other config
  environment:
    NODE_ENV: production
  restart: always
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
```

## Further Reading
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
